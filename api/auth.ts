import { LoginRequest, LoginResponse } from "@/models/auth.model";
import api from "@/services/api";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};
