import { api, apiUrl, setAccessToken } from "./api";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  role_id: number;
}

interface AuthTokensResponse {
  user: ApiUser;
  accessToken: string;
}

export interface GoogleLinkStatus {
  enabled: boolean;
  linked: boolean;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
}

export const authApi = {
  async googleLoginEnabled(): Promise<boolean> {
    const result = await api.get<{ enabled: boolean }>("/auth/google/status");
    return result.enabled;
  },
  googleLoginUrl(returnTo?: string): string {
    const url = new URL(apiUrl("/auth/google"));
    if (returnTo) url.searchParams.set("returnTo", returnTo);
    return url.toString();
  },
  async googleLinkStatus(signal?: AbortSignal): Promise<GoogleLinkStatus> {
    return api.get<GoogleLinkStatus>("/auth/google/link/status", signal);
  },
  async startGoogleLink(returnTo: string): Promise<string> {
    const result = await api.post<{ authorizationUrl: string }>("/auth/google/link", { returnTo });
    return result.authorizationUrl;
  },
  async login(email: string, password: string): Promise<ApiUser> {
    const result = await api.post<AuthTokensResponse>("/auth/login", { email, password });
    setAccessToken(result.accessToken);
    return result.user;
  },
  async register(input: { name: string; email: string; password: string; phone?: string }): Promise<ApiUser> {
    const result = await api.post<AuthTokensResponse>("/auth/register", input);
    setAccessToken(result.accessToken);
    return result.user;
  },
  async restore(): Promise<ApiUser> {
    const tokens = await api.post<{ accessToken: string }>("/auth/refresh", {});
    setAccessToken(tokens.accessToken);
    const result = await api.get<{ user: ApiUser }>("/auth/me");
    return result.user;
  },
  async updateProfile(input: UpdateProfileInput): Promise<ApiUser> {
    const result = await api.patch<{ user: ApiUser }>("/auth/me", input);
    return result.user;
  },
  async logout(): Promise<void> {
    try {
      await api.post<{ message: string }>("/auth/logout", {});
    } finally {
      setAccessToken(null);
    }
  },
  async forgotPassword(email: string): Promise<void> {
    await api.post<{ message: string }>("/auth/forgot-password", { email });
  },
};
