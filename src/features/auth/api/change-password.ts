import axiosInstance from "@/lib/axios";
import type { ChangePasswordCredentials } from "../types";

export const changePassword = async (data: ChangePasswordCredentials): Promise<void> => {
  await axiosInstance.post("/auth/change-password", data);
};
