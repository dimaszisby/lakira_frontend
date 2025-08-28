"use client";

import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="pb-20 sm:pb-24 lg:pb-4 flex-1 min-h-screen sm:p-0 lg:p-6 overflow-x-hidden lg:ml-[272px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
