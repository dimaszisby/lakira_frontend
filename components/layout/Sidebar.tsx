// compponent/layout/Sidebar.tsx

/**
 * Sidebar component for the application layout.
 * - with mobile drawer and logout confirmation modal.
 *
 * TODO: Refactor the sidebar component to make it slimmer
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { List, X, SignOut } from "phosphor-react";
import Modal from "@/components/ui/ModalProps"; // ✅ Ensure correct import (folder renamed to "components")
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/utils/auth";
import { useAtom } from "jotai";
import { userAtom } from "@/state/atoms";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Metrics", href: "/metrics" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [, setUser] = useAtom(userAtom);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  // Updated: Using "status" property to check if the mutation is loading.
  const { mutate: handleLogout, status } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    },
  });

  return (
    <>
      {/* ✅ Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-md fixed top-0 w-full z-50">
        <h2 className="text-xl font-bold flex items-center">📊 Lakira</h2>
        <button onClick={toggleMobileMenu} aria-label="Toggle Menu">
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="p-6 fixed inset-y-0 left-0 w-64 bg-white shadow-lg h-screen z-50 lg:flex flex-col hidden">
        <h2 className="text-2xl font-bold mb-6">📊 Lakira</h2>

        {/* Debugging Line */}
        <label className="text-red-500 text-lg font-bold mb-6">
          This is desktop Sidebar
        </label>

        <nav>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-md transition ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ✅ Logout Button */}
        <div className="mt-auto">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
          >
            <SignOut size={20} className="mr-2" />
            Log Out
          </button>
        </div>
      </div>

      {/* ✅ Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeMobileMenu}
        >
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4"
              onClick={closeMobileMenu}
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">📊 Lakira</h2>

            <label className="text-red-500 text-lg font-bold mb-6">
              This is Mobile
            </label>

            <nav>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-2 rounded-md transition ${
                        pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6">
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
              >
                <SignOut size={20} className="mr-2" />
                Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ✅ Logout Confirmation Modal */}
      <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Logout Confirmation</h2>
          <p className="text-gray-600 mb-6">Do you really want to log out?</p>
          <div className="bg-slate-100 flex justify-center space-x-4">
            {/* Cancel Button */}
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            {/* Confirm Logout Button */}
            <button
              onClick={() => handleLogout()}
              disabled={status === "pending"}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {status === "pending" ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
