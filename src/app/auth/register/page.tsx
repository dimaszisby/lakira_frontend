import RegisterForm from "@/src/components/pages/auth/RegisterForm";
import AuthLayout from "@/src/components/pages/auth/AuthLayout";

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
