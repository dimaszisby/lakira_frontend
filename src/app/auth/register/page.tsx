import RegisterForm from "@/components/pages/auth/RegisterForm";
import AuthLayout from "@/components/pages/auth/AuthLayout";

export const metadata = {
  title: "Register - Lakira",
};

const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
