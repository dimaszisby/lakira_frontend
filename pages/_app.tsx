// pages/_app.tsx

import "@/styles/globals.css"; // Import global styles
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";
import { Provider as JotaiProvider } from "jotai";
import { Quicksand, Plus_Jakarta_Sans } from "next/font/google";
import type { AppProps } from "next/app";

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

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className={`${quicksand.variable} ${plusJakartaSans.variable}`}>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          {/* Ensures hydration for server-side data fetching */}
          <HydrationBoundary state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </HydrationBoundary>
        </QueryClientProvider>
      </JotaiProvider>
    </div>
  );
}
