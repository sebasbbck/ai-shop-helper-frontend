const AGENT_NAME_TO_SLUG: Record<string, string> = {
  "Blog Writer": "blogWriter",
};

export function isBlogWriterAgent(agentName: string): boolean {
  return AGENT_NAME_TO_SLUG[agentName] === "blogWriter";
}
