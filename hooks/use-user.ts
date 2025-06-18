"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const getUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        if (
          error.message.includes("Auth session missing") ||
          error.message.includes("session_not_found") ||
          error.name === "AuthSessionMissingError"
        ) {
          setUser(null);
          return;
        }
        setError(error.message);
        setUser(null);
        return;
      }

      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error obteniendo usuario");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Obtener usuario inicial
    getUser();

    // Escuchar cambios en el estado de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
      } else if (event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return {
    user,
    loading,
    error,
    refreshUser: getUser,
  };
}
