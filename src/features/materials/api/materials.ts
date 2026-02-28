import axiosInstance from "@/lib/axios";
import type { Material, MaterialListResponse } from "../types";

export const getMaterials = async (params: any): Promise<MaterialListResponse> => {
  const response = await axiosInstance.get("/materials", { params });
  return response as unknown as MaterialListResponse;
};

export const createMaterial = async (data: any): Promise<Material> => {
  const response = await axiosInstance.post("/materials", data);
  return response as unknown as Material;
};

export const updateMaterial = async (id: string, data: any): Promise<Material> => {
  const response = await axiosInstance.patch(`/materials/${id}`, data);
  return response as unknown as Material;
};

export const deleteMaterial = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/materials/${id}`);
};
