import {LoginRequest, AuthResponse, RegisterRequest} from "@/models/auth.model";
import api from "@/services/api";

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}

