"use client";

import { useTranslations } from "next-intl";

const AGENT_SLUGS: Record<string, string> = {
  "Blog Writer": "blogWriter",
};

export interface AgentLabel {
  name: string;
  description: string;
}

export function useAgentLabel() {
  const t = useTranslations("Agents");

  return (name: string, description?: string | null): AgentLabel => {
    const slug = AGENT_SLUGS[name];
    const nameKey = slug ? `${slug}.name` : "";
    const descKey = slug ? `${slug}.description` : "";

    return {
      name: nameKey && t.has(nameKey) ? t(nameKey) : name,
      description: descKey && t.has(descKey) ? t(descKey) : (description ?? ""),
    };
  };
}
