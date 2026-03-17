import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <ChangePasswordForm />
        <div className="flex justify-center">
          <Button variant="ghost" className="text-slate-500" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout and try later
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ChangePasswordPage;
