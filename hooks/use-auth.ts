"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import { useUser } from "@/hooks/use-user";
import type {
  SignInData,
  SignUpData,
  ResetPasswordData,
} from "@/lib/validations/auth";

interface UseAuthReturn {
  // Estados
  isLoading: boolean;
  error: string | null;
  user: ReturnType<typeof useUser>["user"];
  userLoading: ReturnType<typeof useUser>["loading"];

  // Acciones
  signIn: (data: SignInData, redirectTo?: string) => Promise<void>;
  signUp: (data: SignUpData, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (data: ResetPasswordData, redirectTo: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: userLoading, refreshUser } = useUser();

  const clearError = () => setError(null);

  const signIn = async (data: SignInData, redirectTo = "/protected") => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signIn(data);
      await refreshUser();
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    data: SignUpData,
    redirectTo = "/auth/sign-up-success"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signUp(data);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cuenta");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signOut();
      await refreshUser();
      router.push("/auth/sign-in");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cerrar sesión");
      // Redirigir de todos modos por seguridad
      router.push("/auth/sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordData, redirectTo: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(data, redirectTo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al resetear contraseña"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.updatePassword(password);
      await refreshUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar contraseña"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estados
    isLoading,
    error,
    user,
    userLoading,

    // Acciones
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
  };
}
