import { api, setAccessToken } from "./api";

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

export const authApi = {
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
