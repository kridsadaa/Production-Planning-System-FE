import axiosInstance from "@/lib/axios";
import type { LoginCredentials, AuthResponse } from "../types";

export const login = async (data: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  // axiosInstance is already configured to return response.data in the interceptor
  return response as unknown as AuthResponse;
};
