"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { useAgentsGetAgents } from "@/api/endpoints/agents/agents";
import { useConnectionsGetWordpressStatus } from "@/api/endpoints/connections/connections";
import { customInstance } from "@/lib/api/custom-instance";
import { appendExecution, readExecutions } from "@/features/agents/blog-executions";
import type { BlogExecution } from "@/features/agents/blog-executions";
import { isBlogWriterAgent } from "@/features/agents/demo-n8n";
import { useActiveContext } from "@/features/shell/ActiveContext";
import { useAgentLabel } from "@/features/agents/use-agent-label";

type ImageMethod = "ia_images" | "upload_images";

const IMAGE_METHODS: ImageMethod[] = ["ia_images"];

type BlogStep = "inputs" | "pick-title" | "generating" | "done" | "error";

interface BlogInputs {
  business: string;
  audience: string;
  imageMethod: ImageMethod;
}

interface ProxyResponse {
  status_code: number;
  data?: unknown;
  raw?: string;
  error?: string;
}

const DIRECT_BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

function callProxy(
  projectId: string,
  workflow: "titles" | "generate",
  payload: Record<string, unknown>,
): Promise<ProxyResponse> {
  return customInstance<ProxyResponse>({
    url: `/connections/wordpress/${projectId}/proxy`,
    method: "POST",
    data: { workflow, payload },
    timeout: 600000,
    ...(DIRECT_BACKEND_ORIGIN
      ? { baseURL: `${DIRECT_BACKEND_ORIGIN}/api/v1` }
      : {}),
  });
}

function isInsufficientCredits(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const response = (err as { response?: { status?: number } }).response;
  return response?.status === 402;
}

function unwrapTitlePayload(data: unknown): unknown {
  let current = data;
  for (const key of ["data", "response", "output"]) {
    if (typeof current === "object" && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    }
  }
  return current;
}

function extractTitles(data: unknown): string[] {
  const payload = unwrapTitlePayload(data);

  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const titles = Object.entries(payload as Record<string, unknown>)
      .filter(([key]) => key !== "context_titles")
      .map(([, value]) => value)
      .filter((value): value is string => typeof value === "string" && value.trim() !== "");
    if (titles.length > 0) return titles;
  }

  if (Array.isArray(payload)) {
    const flat = payload.filter((x): x is string => typeof x === "string" && x.trim() !== "");
    if (flat.length > 0) return flat;
  }

  if (typeof payload === "string") return splitLines(payload);
  return [];
}

function splitLines(s: string): string[] {
  return s
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[-*\d.]+\s*/, "").trim())
    .filter(Boolean);
}

interface GenerateResult {
  title: string;
  url_post: string;
  image_url: string | null;
}

function extractGenerateResult(data: unknown): GenerateResult | null {
  const payload = unwrapTitlePayload(data);
  if (typeof payload !== "object" || payload === null) return null;
  const obj = payload as Record<string, unknown>;
  const title = typeof obj["title"] === "string" ? obj["title"] : null;
  const url_post = typeof obj["url_post"] === "string" ? obj["url_post"] : null;
  if (!title || !url_post) return null;
  const image_url = typeof obj["image_url"] === "string" ? obj["image_url"] : null;
  return { title, url_post, image_url };
}

interface AgentRunProps {
  agentId: string;
}

export default function AgentRun({ agentId }: AgentRunProps) {
  const t = useTranslations("AgentRun");
  const agentLabel = useAgentLabel();
  const { activeProjectTypeId, activeProject, isLoading: contextLoading } = useActiveContext();

  const { data: agentsData, isLoading: agentsLoading } = useAgentsGetAgents(
    { project_type_id: activeProjectTypeId ?? undefined },
    { query: { enabled: !!activeProjectTypeId } },
  );

  const agent = (agentsData?.items ?? []).find((a) => a.id === agentId);
  const label = agent ? agentLabel(agent.name, agent.description) : null;
  const isBlogWriter = agent ? isBlogWriterAgent(agent.name) : false;

  const projectId = activeProject?.id ?? null;

  const { data: wpStatus, isLoading: wpLoading } = useConnectionsGetWordpressStatus(
    projectId ?? "",
    { query: { enabled: isBlogWriter && !!projectId } },
  );

  const [inputs, setInputs] = useState<BlogInputs>({
    business: "",
    audience: "",
    imageMethod: "ia_images",
  });
  const [step, setStep] = useState<BlogStep>("inputs");
  const [titles, setTitles] = useState<string[]>([]);
  const [chosenTitle, setChosenTitle] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<GenerateResult | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [currentActionId, setCurrentActionId] = useState<string>(() => crypto.randomUUID());
  const [executions, setExecutions] = useState<BlogExecution[]>(() =>
    projectId ? readExecutions(projectId) : [],
  );

  const titlesMutation = useMutation({
    mutationFn: (actionId: string) => {
      if (!projectId || !wpStatus?.site_url) throw new Error("missing");
      const payload: Record<string, unknown> = {
        "¿Cuál es la URL de tu Wordpress?": wpStatus.site_url,
        "Conecta tu WordPress": "WordPress conectado con éxito",
        "¿De que va tu web y qué servicios ofreces en ella?": inputs.business,
        "¿Cuál es el público objetivo de tus servicios?": inputs.audience,
        url: wpStatus.site_url,
        language: "es",
        nav_menu_urls: [],
        action_id: actionId,
      };
      return callProxy(projectId, "titles", payload);
    },
    onSuccess: (res) => {
      const list = extractTitles(res.data ?? res.raw);
      if (list.length === 0) {
        setRawError(
          res.error ?? (res.raw ? String(res.raw).slice(0, 300) : t("noTitlesReturned")),
        );
        setStep("error");
        return;
      }
      setTitles(list);
      setChosenTitle(list[0]);
      setStep("pick-title");
    },
    onError: (err: unknown) => {
      setRawError(err instanceof Error ? err.message : t("runError"));
      setStep("error");
    },
  });

  const generateMutation = useMutation({
    mutationFn: ({
      actionId,
      title,
    }: {
      actionId: string;
      title: string;
    }) => {
      if (!projectId || !wpStatus?.site_url) throw new Error("missing");
      const payload: Record<string, unknown> = {
        "¿Cuál es la URL de tu Wordpress?": wpStatus.site_url,
        "Conecta tu WordPress": "WordPress conectado con éxito",
        "¿De que va tu web y qué servicios ofreces en ella?": inputs.business,
        "¿Cuál es el público objetivo de tus servicios?": inputs.audience,
        "Escoge un título para tu publicación": title,
        "¿Cómo quieres añadir imágenes?": inputs.imageMethod,
        url: wpStatus.site_url,
        language: "es",
        nav_menu_urls: [],
        action_id: actionId,
      };
      return callProxy(projectId, "generate", payload);
    },
    onSuccess: (res) => {
      const result = extractGenerateResult(res.data);
      if (!result) {
        const snippet =
          res.error ??
          (res.raw
            ? String(res.raw).slice(0, 500)
            : res.data
              ? JSON.stringify(res.data).slice(0, 500)
              : t("runError"));
        setRawError(snippet);
        setStep("error");
        return;
      }
      setLastResult(result);
      if (projectId) {
        const entry: BlogExecution = {
          id: crypto.randomUUID(),
          agentName: agent?.name ?? "Blog Writer",
          title: result.title,
          url_post: result.url_post,
          image_url: result.image_url,
          createdAt: new Date().toISOString(),
        };
        setExecutions(appendExecution(projectId, entry));
      }
      setStep("done");
    },
    onError: (err: unknown) => {
      setRawError(
        isInsufficientCredits(err)
          ? t("insufficientCredits")
          : err instanceof Error
            ? err.message
            : t("runError"),
      );
      setStep("error");
    },
  });

  function resetRun() {
    setStep("inputs");
    setTitles([]);
    setChosenTitle(null);
    setLastResult(null);
    setRawError(null);
    setCurrentActionId(crypto.randomUUID());
  }

  const isLoading = contextLoading || agentsLoading || (isBlogWriter && wpLoading);

  if (isLoading) return <AgentRunSkeleton />;

  if (!agent || !label) {
    return (
      <Box sx={{ textAlign: "center", py: 12, px: 4, borderRadius: 3, bgcolor: "action.hover" }}>
        <SmartToyOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {t("notFoundHeading")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("notFoundBody")}
        </Typography>
      </Box>
    );
  }

  if (!isBlogWriter) {
    return (
      <Box>
        <AgentHeader label={label} />
        <Box sx={{ p: 4, borderRadius: 3, bgcolor: "action.hover", maxWidth: 480 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            {t("notAvailableHeading")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("notAvailableBody")}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!wpStatus?.connected) {
    return (
      <Box>
        <AgentHeader label={label} />
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "action.hover",
            maxWidth: 480,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <LinkIcon sx={{ fontSize: 20, color: "text.secondary", mt: 0.2 }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("connectFirst")}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {t("connectFirstBody")}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="small"
            href={projectId ? `/project/settings` : "#"}
            component="a"
            sx={{ alignSelf: "flex-start" }}
          >
            {t("connectLink")}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <AgentHeader label={label} />

      <Box sx={{ maxWidth: 600 }}>
        {step === "inputs" && (
          <BlogInputsForm
            inputs={inputs}
            onChange={(field, value) =>
              setInputs((prev) => ({ ...prev, [field]: value }))
            }
            loading={titlesMutation.isPending}
            onSubmit={() => {
              titlesMutation.mutate(currentActionId);
            }}
            t={t}
          />
        )}

        {step === "pick-title" && (
          <TitlePicker
            titles={titles}
            chosen={chosenTitle}
            onChoose={setChosenTitle}
            loading={generateMutation.isPending}
            onGenerate={() => {
              if (!chosenTitle) return;
              generateMutation.mutate({
                actionId: currentActionId,
                title: chosenTitle,
              });
            }}
            t={t}
          />
        )}

        {step === "generating" && (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", py: 3 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("generating")}
            </Typography>
          </Box>
        )}

        {step === "done" && lastResult && (
          <BlogResult
            result={lastResult}
            onReset={resetRun}
            t={t}
          />
        )}

        {step === "error" && (
          <ErrorPanel
            message={rawError}
            onRetry={resetRun}
            t={t}
          />
        )}

        {executions.length > 0 && (
          <ExecutionsList executions={executions} t={t} />
        )}
      </Box>
    </Box>
  );
}

interface AgentHeaderProps {
  label: { name: string; description: string };
}

function AgentHeader({ label }: AgentHeaderProps) {
  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: "primary.lighter",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <ArticleOutlinedIcon sx={{ fontSize: 24, color: "primary.dark" }} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5, mb: 0.5 }}>
        {label.name}
      </Typography>
      {label.description && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label.description}
        </Typography>
      )}
    </Box>
  );
}

interface BlogInputsFormProps {
  inputs: BlogInputs;
  onChange: (field: keyof BlogInputs, value: string) => void;
  loading: boolean;
  onSubmit: () => void;
  t: ReturnType<typeof useTranslations>;
}

function BlogInputsForm({ inputs, onChange, loading, onSubmit, t }: BlogInputsFormProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <TextField
        label={t("businessLabel")}
        placeholder={t("businessPlaceholder")}
        value={inputs.business}
        onChange={(e) => onChange("business", e.target.value)}
        disabled={loading}
        size="small"
        fullWidth
        multiline
        minRows={2}
      />
      <TextField
        label={t("audienceLabel")}
        placeholder={t("audiencePlaceholder")}
        value={inputs.audience}
        onChange={(e) => onChange("audience", e.target.value)}
        disabled={loading}
        size="small"
        fullWidth
        multiline
        minRows={2}
      />
      <FormControl size="small" fullWidth>
        <InputLabel>{t("imageMethodLabel")}</InputLabel>
        <Select
          value={inputs.imageMethod}
          label={t("imageMethodLabel")}
          onChange={(e) => onChange("imageMethod", e.target.value)}
          disabled={loading}
        >
          {IMAGE_METHODS.map((method) => (
            <MenuItem key={method} value={method}>
              {t(`imageMethod.${method}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ pt: 0.5 }}>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading || !inputs.business.trim() || !inputs.audience.trim()}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? t("generating") : t("generateTitles")}
        </Button>
      </Box>
    </Box>
  );
}

interface TitlePickerProps {
  titles: string[];
  chosen: string | null;
  onChoose: (t: string) => void;
  loading: boolean;
  onGenerate: () => void;
  t: ReturnType<typeof useTranslations>;
}

function TitlePicker({ titles, chosen, onChoose, loading, onGenerate, t }: TitlePickerProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {t("selectTitle")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {titles.map((title) => (
          <Box
            key={title}
            onClick={() => !loading && onChoose(title)}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: chosen === title ? "primary.main" : "divider",
              bgcolor: chosen === title ? "primary.lighter" : "background.paper",
              cursor: loading ? "default" : "pointer",
              transition: "border-color 150ms, background-color 150ms",
              "&:hover": loading
                ? {}
                : {
                    borderColor: "primary.light",
                    bgcolor: "action.hover",
                  },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: chosen === title ? 600 : 400,
                color: chosen === title ? "primary.dark" : "text.primary",
              }}
            >
              {title}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          variant="contained"
          onClick={onGenerate}
          disabled={loading || !chosen}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? t("generating") : t("generateBlog")}
        </Button>
      </Box>
    </Box>
  );
}

interface BlogResultProps {
  result: GenerateResult;
  onReset: () => void;
  t: ReturnType<typeof useTranslations>;
}

function BlogResult({ result, onReset, t }: BlogResultProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "success.light",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <CheckCircleOutlinedIcon sx={{ fontSize: 22, color: "success.main", mt: 0.1 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {result.title}
          </Typography>
          {result.image_url && (
            <Box
              component="img"
              src={result.image_url}
              alt={result.title}
              sx={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 2,
                mb: 1.5,
              }}
            />
          )}
          <Button
            variant="outlined"
            size="small"
            endIcon={<OpenInNewIcon sx={{ fontSize: 15 }} />}
            href={result.url_post}
            target="_blank"
            rel="noopener noreferrer"
            component="a"
          >
            {t("viewPost")}
          </Button>
        </Box>
      </Box>
      <Button
        variant="text"
        size="small"
        startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
        onClick={onReset}
        sx={{ alignSelf: "flex-start", color: "text.secondary" }}
      >
        {t("runAgain")}
      </Button>
    </Box>
  );
}

interface ErrorPanelProps {
  message: string | null;
  onRetry: () => void;
  t: ReturnType<typeof useTranslations>;
}

function ErrorPanel({ message, onRetry, t }: ErrorPanelProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: "error.lighter",
        border: "1px solid",
        borderColor: "error.light",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        <ErrorOutlinedIcon sx={{ fontSize: 20, color: "error.main", flexShrink: 0, mt: 0.1 }} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "error.dark", mb: 0.25 }}>
            {t("runError")}
          </Typography>
          {message && (
            <Typography variant="body2" sx={{ color: "error.dark" }}>
              {message}
            </Typography>
          )}
        </Box>
      </Box>
      <Button
        variant="text"
        size="small"
        startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
        onClick={onRetry}
        sx={{ alignSelf: "flex-start", color: "error.main" }}
      >
        {t("retry")}
      </Button>
    </Box>
  );
}

interface ExecutionsListProps {
  executions: BlogExecution[];
  t: ReturnType<typeof useTranslations>;
}

function ExecutionsList({ executions, t }: ExecutionsListProps) {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        {t("executionsHeading")}
      </Typography>
      {executions.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("noExecutions")}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {executions.map((ex) => (
            <Box
              key={ex.id}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {ex.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {new Date(ex.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Button
                variant="text"
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                href={ex.url_post}
                target="_blank"
                rel="noopener noreferrer"
                component="a"
                sx={{ flexShrink: 0, color: "text.secondary", fontSize: "0.75rem" }}
              >
                {t("viewPost")}
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function AgentRunSkeleton() {
  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" width={240} height={40} />
        <Skeleton variant="text" width={320} height={20} sx={{ mt: 0.5 }} />
      </Box>
      <Box sx={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="rounded" height={72} />
        <Skeleton variant="rounded" height={72} />
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={40} />
      </Box>
    </Box>
  );
}
