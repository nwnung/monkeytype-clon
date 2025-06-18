"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

export function useAuthGuard(redirectTo = "/auth/sign-in") {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // Solo redirigir si no está cargando y no hay usuario
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Retorna el estado para que los componentes puedan usarlo si necesitan
  return { user, loading };
}
