import LoginForm from "@/components/pages/auth/LoginForm";
import AuthLayout from "@/components/pages/auth/AuthLayout";

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
