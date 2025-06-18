import { AuthButton } from "@/components/auth/auth-button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
      <div className="flex flex-col items-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Mejora tu velocidad de escritura
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Practica mecanografía con nuestro test de velocidad. Mejora tu WPM y
            precisión.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Comenzar Test
            </Link>
            <AuthButton />
          </div>

          <p className="text-sm text-muted-foreground">
            ¿Primera vez? No necesitas registrarte para hacer el test
          </p>
        </div>
      </div>
    </div>
  );
}
