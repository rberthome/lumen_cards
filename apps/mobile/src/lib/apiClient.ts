const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8001/api';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // eslint-disable-next-line no-restricted-syntax
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...defaultHeaders, ...init?.headers },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};
