// components/layout/Layout.tsx

import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <footer className="bg-gray-50 text-gray-800 text-center p-4">
        © {new Date().getFullYear()} Lakira
      </footer>
    </div>
  );
};

export default Layout;
