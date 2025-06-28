"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";
import { Provider as JotaiProvider } from "jotai";
import { Quicksand, Plus_Jakarta_Sans } from "next/font/google";

// Font Optimization
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className={`${quicksand.className} ${plusJakartaSans.className}`}>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          {/* Ensures hydration for server-side data fetching */}
          <HydrationBoundary>
            {children}
          </HydrationBoundary>
        </QueryClientProvider>
      </JotaiProvider>
    </div>
  );
}