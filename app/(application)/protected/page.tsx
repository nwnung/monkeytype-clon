"use client";

import { InfoIcon } from "lucide-react";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function ProtectedPage() {
  const { user, loading } = useAuthGuard(); // Protege la página y obtiene el usuario

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Esta es una página protegida con useAuthGuard - Solo usuarios
          autenticados pueden verla
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Detalles de tu usuario</h2>
        {user && (
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        )}
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">
          Bienvenido a tu área protegida
        </h2>
        <p className="text-muted-foreground">
          Has accedido exitosamente a esta sección protegida. Esta página usa el
          hook useAuthGuard que internamente usa useUser para obtener los datos
          del usuario de forma centralizada y reactiva.
        </p>
      </div>
    </div>
  );
}
