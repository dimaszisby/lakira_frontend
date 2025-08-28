import React from "react";
import Link from "next/link";
import { NavigationProps } from "./type";

const SideBarNavigationItems = ({
  navItems,
  pathname,
  onClick,
  className,
}: NavigationProps) => {
  return (
    <nav className={className}>
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

export default SideBarNavigationItems;
