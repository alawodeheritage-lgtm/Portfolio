const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; details?: string[] };
    if (body.details?.length) {
      return `${body.error || 'Unable to send your message.'}: ${body.details.join('; ')}`;
    }
    return body.error || 'Unable to send your message.';
  } catch {
    return 'Unable to send your message.';
  }
}

export async function submitContactMessage(payload: ContactMessagePayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
