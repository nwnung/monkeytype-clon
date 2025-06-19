import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Rutas que REQUIEREN autenticación
const protectedRoutes = ["/protected"];

// Rutas que NO pueden acceder usuarios autenticados
const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/update-password",
];

// Rutas públicas (acceso libre)
const publicRoutes = ["/", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Actualizar sesión y obtener respuesta
  let supabaseResponse = await updateSession(request);

  // 2. Crear cliente para verificar autenticación en rutas específicas
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {}, // No necesitamos setear cookies aquí
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Lógica de redirección para rutas protegidas
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !user) {
    const loginUrl = new URL("/auth/sign-in", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Redirigir usuarios autenticados desde páginas de auth
  if (authRoutes.includes(pathname) && user) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
