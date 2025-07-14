"use client";

import Layout from "@/src/components/layout/Layout";
import { withAuth } from "@/src/components/hoc/withAuth";


const DashboardPage = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-center">Dashboard</h1>
      </div>

      {/* <Dashboard /> */}
    </Layout>
  );
};

export default withAuth(DashboardPage);
