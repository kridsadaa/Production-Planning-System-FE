import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/change-password";
import { useAuthStore } from "@/store/authStore";
import type { ChangePasswordCredentials } from "../types";

export const useChangePassword = () => {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: ChangePasswordCredentials) => changePassword(data),
    onSuccess: () => {
      // After successful password change, the user no longer needs to change password
      updateUser({ passwordChangeRequired: false });
    },
  });
};
