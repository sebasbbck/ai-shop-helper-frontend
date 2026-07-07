export interface BlogExecution {
  id: string;
  agentName: string;
  title: string;
  url_post: string;
  image_url: string | null;
  createdAt: string;
}

function storageKey(projectId: string): string {
  return `blog_executions:${projectId}`;
}

export function readExecutions(projectId: string): BlogExecution[] {
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as BlogExecution[];
  } catch {
    return [];
  }
}

export function appendExecution(
  projectId: string,
  entry: BlogExecution,
): BlogExecution[] {
  const current = readExecutions(projectId);
  const next = [entry, ...current];
  try {
    localStorage.setItem(storageKey(projectId), JSON.stringify(next));
  } catch {
  }
  return next;
}
