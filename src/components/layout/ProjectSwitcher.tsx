"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { useActiveContext } from "@/features/shell/ActiveContext";
import AgentsNavList from "./AgentsNavList";
import CreateProjectDialog from "./CreateProjectDialog";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

interface ProjectSwitcherProps {
  collapsed: boolean;
}

export default function ProjectSwitcher({ collapsed }: ProjectSwitcherProps) {
  const t = useTranslations("Shell");
  const router = useRouter();
  const pathname = usePathname();
  const { activeOrg, activeProject, activeProjectId, setActiveProject } = useActiveContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const projects = activeOrg?.projects ?? [];

  const handleSelectProject = (id: string) => {
    setActiveProject(id);
    router.push("/project");
    setAnchorEl(null);
  };

  const projectInitials = activeProject ? initials(activeProject.name) : null;
  const settingsActive = pathname === "/project/settings";

  const switcherMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{ paper: { sx: { minWidth: 220 } } }}
    >
      {projects.length === 0 && (
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            {t("noProjects")}
          </Typography>
        </MenuItem>
      )}
      {projects.map((project) => (
        <MenuItem key={project.id} onClick={() => handleSelectProject(project.id)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
            <Avatar
              sx={{
                width: 22,
                height: 22,
                bgcolor: "primary.lighter",
                color: "primary.dark",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              {initials(project.name)}
            </Avatar>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {project.name}
            </Typography>
            {project.id === activeProjectId && (
              <CheckIcon sx={{ fontSize: 15, color: "primary.main" }} />
            )}
          </Box>
        </MenuItem>
      ))}
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          setCreateDialogOpen(true);
        }}
      >
        <AddIcon sx={{ mr: 1.5, fontSize: 17, color: "text.secondary" }} />
        <Typography variant="body2">{t("newProject")}</Typography>
      </MenuItem>
    </Menu>
  );

  if (collapsed) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", py: 0.5, mt: 2 }}>
        <Tooltip title={t("switchProject")} placement="right" arrow>
          <ListItemButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              minHeight: 40,
              px: 0,
              justifyContent: "center",
              mx: 0.5,
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 0, color: "text.secondary", "& svg": { fontSize: 20 } }}
            >
              <FolderIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
        <AgentsNavList collapsed={true} />
        <Tooltip title={t("settings")} placement="right" arrow>
          <ListItemButton
            selected={settingsActive}
            onClick={() => router.push("/project/settings")}
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
                color: settingsActive ? "primary.dark" : "text.secondary",
                "& svg": { fontSize: 20 },
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
        {switcherMenu}
        <CreateProjectDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pt: 4, pb: 0.5 }}>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ display: "block", mb: 0.5, fontWeight: 500, userSelect: "none" }}
      >
        {t("projectSection")}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
        <Tooltip title={t("switchProject")} placement="right">
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0.5, flexShrink: 0 }}
          >
            <Avatar
              sx={{
                width: 26,
                height: 26,
                bgcolor: "primary.light",
                color: "primary.darker",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {projectInitials ?? <FolderIcon sx={{ fontSize: 14 }} />}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Typography
          variant="body2"
          noWrap
          onClick={() => activeProject && router.push("/project")}
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            cursor: activeProject ? "pointer" : "default",
            color: "text.primary",
            "&:hover": activeProject ? { color: "primary.main" } : {},
            transition: "color 0.15s",
          }}
        >
          {activeProject?.name ?? t("noProjects")}
        </Typography>

        <IconButton
          size="small"
          onClick={() => setSectionOpen((prev) => !prev)}
          sx={{ color: "text.disabled", flexShrink: 0 }}
        >
          {sectionOpen ? (
            <ExpandLessIcon sx={{ fontSize: 16 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>

      <Collapse in={sectionOpen} unmountOnExit>
        <Box sx={{ pl: 1, pt: 0.25, pb: 0.5 }}>
          <AgentsNavList collapsed={false} />
          <List dense disablePadding>
            <ListItemButton
              selected={settingsActive}
              onClick={() => router.push("/project/settings")}
              sx={{
                minHeight: 36,
                borderRadius: 1,
                px: 1.5,
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
                  color: settingsActive ? "primary.dark" : "text.secondary",
                  "& svg": { fontSize: 20 },
                }}
              >
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary={t("settings")}
                slotProps={{
                  primary: { variant: "body2", sx: { fontWeight: settingsActive ? 600 : 400 } },
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Collapse>

      {switcherMenu}
      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </Box>
  );
}
