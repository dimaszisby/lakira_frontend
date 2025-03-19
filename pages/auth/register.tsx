import RegisterForm from "../../components/pages/auth/RegisterForm.js";
import Layout from "../../components/layout/Layout.js";
import Head from "next/head";

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
