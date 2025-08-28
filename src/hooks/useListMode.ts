"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ListMode = "pages" | "scroll";

const DESKTOP_MQ = "(min-width: 992px)"; // matches your `large` breakpoint
export function useListMode(storageKey = "metricCategoriesMode") {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initial = useMemo<ListMode>(() => {
    const fromUrl = params?.get("mode");
    if (fromUrl === "pages" || fromUrl === "scroll") return fromUrl;
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(storageKey) as ListMode | null;
      if (saved === "pages" || saved === "scroll") return saved;
      return window.matchMedia(DESKTOP_MQ).matches ? "pages" : "scroll";
    }
    return "pages";
  }, []); // eslint-disable-line

  const [mode, setMode] = useState<ListMode>(initial);

  // keep URL in sync (and don’t scroll jump)
  const replaceParam = (m: ListMode) => {
    const sp = new URLSearchParams(params?.toString() || "");
    sp.set("mode", m);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    window.localStorage.setItem(storageKey, m);
    setMode(m);
  };

  useEffect(() => {
    const fromUrl = params?.get("mode");
    if (fromUrl === "pages" || fromUrl === "scroll") setMode(fromUrl);
  }, [params]);

  return { mode, setMode: replaceParam, isPages: mode === "pages" };
}
