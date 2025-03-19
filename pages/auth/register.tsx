import Head from "next/head";
import RegisterForm from "@/components/pages/auth/RegisterForm";
import Layout from "@/components/layout/Layout";

const RegisterPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>Register - MiraiHealth</title>
        </Head>
        <RegisterForm />
      </Layout>
    </>
  );
};

export default RegisterPage;
