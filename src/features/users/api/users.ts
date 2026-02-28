import axiosInstance from "@/lib/axios";
import type { User, UserListResponse } from "../types";

export const getUsers = async (params: any): Promise<UserListResponse> => {
  const response = await axiosInstance.get("/users", { params });
  return response as unknown as UserListResponse;
};

export const createUser = async (data: any): Promise<User> => {
  const response = await axiosInstance.post("/users", data);
  return response as unknown as User;
};

export const updateUser = async (id: string, data: any): Promise<User> => {
  const response = await axiosInstance.patch(`/users/${id}`, data);
  return response as unknown as User;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
