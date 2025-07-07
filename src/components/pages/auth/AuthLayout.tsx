// app/auth/layout.tsx
import Header from "@/src/components/layout/Header";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    // min-h-screen flex flex-col
    // flex items-center justify-center min-h-screen bg-gray-100
    // <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    //   < />
    //   <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
    //     {children}
    //   </div>
    // </div>

    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Main Content Area */}
      <main className="flex items-center justify-center">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-800 text-center p-4">
        © {new Date().getFullYear()} Lakira
      </footer>
    </div>
  );
}
