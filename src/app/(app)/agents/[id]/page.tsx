import AgentRun from "@/features/agents/AgentRun";

interface AgentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;
  return <AgentRun agentId={id} />;
}
