import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/login";
import { useAuthStore } from "@/store/authStore";
import type { LoginCredentials } from "../types";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginCredentials) => login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
      
      if (response.user.passwordChangeRequired) {
        navigate("/change-password");
      } else {
        navigate("/");
      }
    },
  });
};
