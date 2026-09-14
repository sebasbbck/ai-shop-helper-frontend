"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useProjectTypesGetProjectTypes } from "@/api/endpoints/project-types/project-types";
import { useActiveContext } from "@/features/shell/ActiveContext";
import CreateProjectDialog from "@/components/layout/CreateProjectDialog";
import ProjectCard from "@/features/org/ProjectCard";

export default function OrgDashboard() {
  const t = useTranslations("Org");
  const router = useRouter();
  const { activeOrg, setActiveProject } = useActiveContext();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: typesData } = useProjectTypesGetProjectTypes({});
  const typeMap = new Map(
    (typesData?.items ?? []).map((pt) => [pt.id, pt.name]),
  );

  const projects = activeOrg?.projects ?? [];

  const handleOpen = (projectId: string) => {
    setActiveProject(projectId);
    router.push("/project");
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        mt: 3,
        mb: 3,
        p: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          mb: 5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, letterSpacing: -0.5 }}
          >
            {activeOrg?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {t("projectCount", { count: projects.length })}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          size="small"
        >
          {t("newProject")}
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            px: 4,
            borderRadius: 3,
            bgcolor: "action.hover",
          }}
        >
          <FolderOutlinedIcon
            sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {t("noProjectsHeading")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            {t("noProjectsBody")}
          </Typography>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            {t("newProject")}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProjectCard
                name={project.name}
                typeName={
                  typeMap.get(project.project_type_id) ??
                  project.project_type_id
                }
                onOpen={() => handleOpen(project.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Box>
  );
}
