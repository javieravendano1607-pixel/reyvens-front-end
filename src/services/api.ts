export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  error?: ApiErrorPayload;
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const productionApiBaseUrl = "https://api.reyvens.com/api/v1";
const apiBaseUrl = (configuredBaseUrl || (import.meta.env.PROD ? productionApiBaseUrl : undefined))?.replace(/\/$/, "");
let accessToken: string | null = null;
let refreshRequest: Promise<string | null> | null = null;
const sessionExpiredListeners = new Set<() => void>();
const REQUEST_TIMEOUT_MS = 20_000;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function apiUrl(path: string): string {
  return urlFor(path);
}

export function onSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

function urlFor(path: string): string {
  if (!apiBaseUrl) {
    throw new ApiError("La API no está configurada. Define VITE_API_BASE_URL.", 0, "API_NOT_CONFIGURED");
  }
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      try {
        const response = await fetch(urlFor("/auth/refresh"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: "{}",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        const payload = await response.json() as ApiEnvelope<{ accessToken: string }>;
        if (!response.ok || !payload.success || !payload.data?.accessToken) {
          setAccessToken(null);
          return null;
        }
        setAccessToken(payload.data.accessToken);
        return payload.data.accessToken;
      } catch {
        setAccessToken(null);
        return null;
      } finally {
        refreshRequest = null;
      }
    })();
  }
  return refreshRequest;
}

function shouldTryRefresh(path: string, token: string | null, retried: boolean): boolean {
  return !retried && Boolean(token) && !/^\/auth\/(login|register|refresh|logout)(\/|$)/.test(path);
}

async function performRequest<T>(path: string, init: RequestInit, retried = false): Promise<T> {
  const token = accessToken;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body !== undefined && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(urlFor(path), {
      ...init,
      headers,
      credentials: "include",
      signal: init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("No fue posible conectar con REYVENS. Revisa tu conexión e intenta de nuevo.", 0, "NETWORK_ERROR");
  }

  if (response.status === 401 && shouldTryRefresh(path, token, retried)) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) return performRequest<T>(path, init, true);
    sessionExpiredListeners.forEach(listener => listener());
  }

  if (response.status === 204) return undefined as T;
  let payload: ApiEnvelope<T>;
  try {
    payload = await response.json() as ApiEnvelope<T>;
  } catch {
    throw new ApiError("El servidor devolvió una respuesta inesperada.", response.status, "INVALID_API_RESPONSE");
  }
  if (!response.ok || payload.success !== true || payload.data === undefined) {
    const error = payload.error;
    throw new ApiError(
      error?.message ?? "No se pudo completar la solicitud.",
      response.status,
      error?.code ?? "API_ERROR",
      error?.details,
    );
  }
  if (Array.isArray(payload.data) && payload.pagination) {
    return { data: payload.data, pagination: payload.pagination } as T;
  }
  return payload.data;
}

export const api = {
  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return performRequest<T>(path, { method: "GET", signal });
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return performRequest<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
  },
  patch<T>(path: string, body: unknown): Promise<T> {
    return performRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) });
  },
  delete<T = void>(path: string): Promise<T> {
    return performRequest<T>(path, { method: "DELETE" });
  },
};

export function userMessageFor(error: unknown): string {
  if (!(error instanceof ApiError)) return "Ocurrió un error inesperado. Intenta de nuevo.";
  if (error.status === 0) return error.message;
  if (error.status === 401) return "Tu sesión expiró. Inicia sesión nuevamente.";
  if (error.status === 403) return "No tienes permiso para realizar esta acción.";
  if (error.status === 404) return error.message || "No encontramos la información solicitada.";
  if (error.status === 409 || error.status === 422 || error.status === 400) return error.message;
  if (error.status === 429) return "Hay muchas solicitudes. Espera un momento e intenta de nuevo.";
  if (error.status === 503) return error.message;
  return "No pudimos completar la solicitud. Intenta de nuevo más tarde.";
}
