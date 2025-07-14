// src/app/auth/login/page.tsx

import LoginForm from "@/src/components/pages/auth/LoginForm";
import AuthLayout from "@/src/components/pages/auth/AuthLayout";

export const metadata = {
  title: "Login - Lakira",
};

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
