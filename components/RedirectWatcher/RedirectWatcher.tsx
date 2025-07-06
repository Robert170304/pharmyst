"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/store/useAppStore";

export default function RedirectWatcher() {
  const router = useRouter();
  const shouldRedirect = useAppStore((s) => s.shouldRedirect);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/auth/login");
      useAppStore.getState().clearRedirect();
    }
  }, [shouldRedirect, router]);

  return null;
}
