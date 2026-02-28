import { AuthLayout } from "@/layouts/AuthLayout";

const ChangePasswordPage = () => {
  return (
    <AuthLayout>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Change Password Required</h2>
        <p className="text-slate-600 mb-6">
          Your account requires a password change before you can continue.
        </p>
        <p className="text-sm text-slate-400 italic">
          (Implementation of change password form coming soon...)
        </p>
      </div>
    </AuthLayout>
  );
};

export default ChangePasswordPage;
