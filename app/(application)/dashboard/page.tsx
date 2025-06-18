"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";
import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardPage() {
  const { user, loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Usuario</h2>
            <p className="text-muted-foreground">Bienvenido, {user?.email}</p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Protección</h2>
            <p className="text-muted-foreground">
              Esta página usa el hook useAuthGuard para protección automática.
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Arquitectura</h2>
            <p className="text-muted-foreground">
              useAuthGuard → useUser → Datos centralizados y protección
              automática.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Datos del Usuario</h2>
          {user ? (
            <pre className="text-sm bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">
              No hay datos del usuario disponibles
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
