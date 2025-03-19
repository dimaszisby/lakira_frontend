import Head from "next/head";
import LoginForm from "@/components/pages/auth/LoginForm";
import Layout from "@/components/layout/Layout";

const LoginPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>Login - Lakira</title>
        </Head>
        <LoginForm />
      </Layout>
    </>
  );
};

export default LoginPage;
