import React from "react";

export const metadata = {
  title: "Dashboard - Lakira",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}