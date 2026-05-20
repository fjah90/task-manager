const TOKEN_KEY = 'tm_token';

export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// On the server (Next.js SSR/RSC inside Docker) use the internal service name.
// On the browser, use relative '/api' — nginx (or Next.js rewrites in dev) proxies to the backend.
const API_URL =
  typeof window === 'undefined'
    ? (process.env.API_INTERNAL_URL ?? 'http://api:4000/api')
    : '/api';

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const token = tokenStorage.get();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      'No se pudo conectar con el servidor. Verifica que API y Docker esten arriba.',
    );
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: { code: 'INVALID_RESPONSE', message: text } };
    }
  }

  if (!res.ok) {
    const err = (data as { error?: { code?: string; message?: string } })
      ?.error;
    throw new ApiError(
      res.status,
      err?.code ?? 'UNKNOWN',
      err?.message ?? res.statusText,
    );
  }
  return data as T;
}
