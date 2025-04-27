// components/layout/Layout.tsx

"use client";

import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar/>

      {/* ✅ Adjust main content layout to prevent overflow issues */}
      <main className="flex-1 min-h-screen lg:ml-64 p-6 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
