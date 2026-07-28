"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAgentsGetAgents } from "@/api/endpoints/agents/agents";
import { useActiveContext } from "@/features/shell/ActiveContext";
import { useAgentLabel } from "@/features/agents/use-agent-label";

interface AgentsNavListProps {
  collapsed: boolean;
}

export default function AgentsNavList({ collapsed }: AgentsNavListProps) {
  const t = useTranslations("Shell");
  const agentLabel = useAgentLabel();
  const pathname = usePathname();
  const router = useRouter();
  const { activeProjectTypeId } = useActiveContext();

  const isAnyAgentActive = pathname.startsWith("/agents/");
  const [open, setOpen] = useState(isAnyAgentActive);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data } = useAgentsGetAgents(
    { project_type_id: activeProjectTypeId },
    { query: { enabled: !!activeProjectTypeId } },
  );
  const agents = data?.items ?? [];

  if (collapsed) {
    return (
      <>
        <Tooltip title={t("agents")} placement="right" arrow>
          <ListItemButton
            selected={isAnyAgentActive}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              minHeight: 40,
              px: 0,
              justifyContent: "center",
              mx: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.lighter",
                "& .MuiListItemIcon-root": { color: "primary.dark" },
                "&:hover": { bgcolor: "primary.lighter" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: isAnyAgentActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <SmartToyIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, px: 2, py: 0.5, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            {t("agents")}
          </Typography>
          {agents.length === 0 && (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {t("noProjects")}
              </Typography>
            </MenuItem>
          )}
          {agents.map((agent) => (
            <MenuItem
              key={agent.id}
              selected={pathname === `/agents/${agent.id}`}
              onClick={() => {
                router.push(`/agents/${agent.id}`);
                setAnchorEl(null);
              }}
            >
              <Typography variant="body2">
                {agentLabel(agent.name).name}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <>
      <ListItemButton
        selected={isAnyAgentActive && !open}
        onClick={() => {
          router.push("/project");
          setOpen((prev) => !prev);
        }}
        sx={{
          minHeight: 40,
          pl: 1.5,
          pr: 0.25,
          mx: 0.5,
          "&.Mui-selected": {
            bgcolor: "primary.lighter",
            color: "primary.dark",
            "& .MuiListItemIcon-root": { color: "primary.dark" },
            "&:hover": { bgcolor: "primary.lighter" },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 1.5,
            color: isAnyAgentActive ? "primary.dark" : "text.secondary",
            "& svg": { fontSize: 20 },
          }}
        >
          <SmartToyIcon />
        </ListItemIcon>
        <ListItemText
          primary={t("agents")}
          slotProps={{ primary: { variant: "body2", sx: { fontWeight: isAnyAgentActive ? 600 : 400 } } }}
        />
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        )}
      </ListItemButton>

      <Collapse in={open} unmountOnExit>
        <Box sx={{ pl: 1.5 }}>
          {agents.map((agent) => {
            const agentActive = pathname === `/agents/${agent.id}`;
            return (
              <ListItemButton
                key={agent.id}
                selected={agentActive}
                onClick={() => router.push(`/agents/${agent.id}`)}
                sx={{
                  minHeight: 36,
                  px: 1.5,
                  mx: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.lighter",
                    color: "primary.dark",
                    "&:hover": { bgcolor: "primary.lighter" },
                  },
                }}
              >
                <ListItemText
                  primary={agentLabel(agent.name).name}
                  slotProps={{ primary: { variant: "body2", sx: { fontWeight: agentActive ? 600 : 400 } } }}
                />
              </ListItemButton>
            );
          })}
        </Box>
      </Collapse>
    </>
  );
}
