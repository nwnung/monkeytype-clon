"use client";

import { authService } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      await authService.signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      // Redirigir de todos modos por seguridad
      router.push("/auth/sign-in");
    }
  };

  return <Button onClick={logout}>Logout</Button>;
}
