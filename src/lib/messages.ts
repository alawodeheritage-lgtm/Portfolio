import type { AdminMessageItem } from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

interface MessagesResponse {
  messages: AdminMessageItem[];
}

interface MessageResponse {
  message: AdminMessageItem;
}

interface ReplyMessageResponse {
  message: string;
  reply: {
    id: string;
  };
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; details?: string[] };
    if (body.details?.length) {
      return `${body.error || 'Message request failed.'}: ${body.details.join('; ')}`;
    }
    return body.error || 'Message request failed.';
  } catch {
    return 'Message request failed.';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
}

export async function fetchAdminMessages(): Promise<AdminMessageItem[]> {
  const response = await request<MessagesResponse>('/api/admin/messages');
  return response.messages;
}

async function updateMessage(id: string, action: string): Promise<AdminMessageItem> {
  const response = await request<MessageResponse>(
    `/api/admin/messages/${encodeURIComponent(id)}/${action}`,
    { method: 'PATCH' },
  );
  return response.message;
}

export function markAdminMessageRead(id: string): Promise<AdminMessageItem> {
  return updateMessage(id, 'read');
}

export function markAdminMessageUnread(id: string): Promise<AdminMessageItem> {
  return updateMessage(id, 'unread');
}

export function archiveAdminMessage(id: string): Promise<AdminMessageItem> {
  return updateMessage(id, 'archive');
}

export function unarchiveAdminMessage(id: string): Promise<AdminMessageItem> {
  return updateMessage(id, 'unarchive');
}

export async function deleteAdminMessage(id: string): Promise<void> {
  await request<{ message: string }>(`/api/admin/messages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function replyToAdminMessage(id: string, message: string): Promise<ReplyMessageResponse> {
  return request<ReplyMessageResponse>(`/api/admin/messages/${encodeURIComponent(id)}/reply`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
