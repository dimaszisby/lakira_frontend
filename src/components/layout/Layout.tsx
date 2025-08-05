// components/layout/Layout.tsx

"use client";

import Sidebar from "./Sidebar";

// TODO: Calculate the Layout children width accoring to the Sidebar width

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      {/* ✅ Adjust main content layout to prevent overflow issues */}
      <main className="pt-20 sm:pt-20 lg:pt-4 bg-red-100 flex-1 min-h-screen sm:p-0 lg:p-6 overflow-x-hidden lg:ml-[272px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
