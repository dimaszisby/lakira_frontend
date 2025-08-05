// compponent/layout/Sidebar.tsx

/**
 * Sidebar component for the application layout.
 * - with mobile drawer and logout confirmation modal.
 *
 * TODO: Refactor the sidebar component according to the newest UI changes.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { List, X } from "phosphor-react";
import Modal from "@/src/components/ui/Modal"; // ✅ Ensure correct import (folder renamed to "components")
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/src/services/api/auth.api";
import { useAtom } from "jotai";
import { userAtom } from "@/src/services/state/atoms";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  SquaresFour,
  ChartBar,
  Folder,
  UserCircle,
  SignOut,
} from "phosphor-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: SquaresFour },
  { name: "Metrics", href: "/metrics", icon: ChartBar },
  { name: "Category", href: "/metric-categories", icon: Folder },
  { name: "Account", href: "/account", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [, setUser] = useAtom(userAtom);

  // queryClient to update cache
  const queryClient = useQueryClient();

  // Mobile state handlers
  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  // Updated: Using "status" property to check if the mutation is loading.
  const { mutate: handleLogout, status } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["userProfile"], null); // ✅ Reset cache
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    },
  });

  const mobileTopBar = () => (
    <div className="lg:hidden flex items-center bg-white p-4 shadow-md fixed top-0 w-full z-50 space-x-4">
      <button onClick={toggleMobileMenu} aria-label="Toggle Menu">
        {mobileOpen ? <X size={24} /> : <List size={24} />}
      </button>
      <h2 className="text-xl font-bold flex items-center">📊 Lakira</h2>
    </div>
  );

  const logoutButton = () => (
    <div className="mt-auto">
      <button
        onClick={() => setLogoutModalOpen(true)}
        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
      >
        <SignOut size={20} className="mr-2" />
        Sign Out
      </button>
    </div>
  );

  return (
    <>
      {/* ✅ Mobile Top Bar */}
      {mobileTopBar()}

      {/* ✅ Desktop Sidebar */}
      <div className="fixed top-4 left-4 bottom-4 w-64 p-6 bg-white shadow-lg z-50 lg:flex flex-col hidden rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">📊 Lakira</h2>
        <NavigationItems pathname={pathname || ""} />

        {/* ✅ Logout Button */}
        {logoutButton()}
      </div>

      {/* ✅ Mobile Sidebar Drawer */}
      {mobileOpen && (
        <Modal isOpen={mobileOpen} onClose={closeMobileMenu}>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "fluid", stiffness: 100 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50"
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

            <NavigationItems
              pathname={pathname || ""}
              onClick={closeMobileMenu}
            />

            <div className="mt-6">
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                <SignOut size={20} className="mr-2" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </Modal>
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

// Subcomponent for Navigation Items
const NavigationItems = ({
  pathname,
  onClick,
}: {
  pathname: string;
  onClick?: () => void;
}) => {
  return (
    <nav>
      <ul className="space-y-3">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClick}
              className={`flex items-center px-4 py-2 rounded-lg transition font-semibold ${
                pathname === item.href
                  ? "bg-pink-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} className="mr-2" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
