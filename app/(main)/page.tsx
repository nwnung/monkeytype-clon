import { TypingTestContainer } from "@/components/core/TypingTestContainer";
import { getWords } from "@/lib/words";

export default async function HomePage() {
  // Obtenemos las palabras iniciales desde la base de datos
  const initialWords = await getWords("english_200");

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center space-y-8">
        {/* Header del proyecto */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Test de Mecanografía
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Mejora tu velocidad de escritura y precisión. Practica con palabras
            en inglés.
          </p>
        </div>

        {/* Componente principal del test */}
        <TypingTestContainer initialWords={initialWords} />
      </div>
    </div>
  );
}
