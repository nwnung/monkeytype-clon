"use client";

import { WordData } from "@/lib/words";

interface TypingTestContainerProps {
  initialWords: WordData[];
}

export function TypingTestContainer({
  initialWords,
}: TypingTestContainerProps) {
  // TODO: En los siguientes pasos implementaremos:
  // - useReducer para manejar el estado complejo del test
  // - Event listeners para capturar la entrada del teclado
  // - Lógica del temporizador
  // - Cálculo de métricas (WPM, precisión)
  // - Renderizado de caracteres con estados (correcto/incorrecto/pendiente)

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header del test con métricas */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-8 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">WPM:</span>{" "}
            <span className="text-lg font-bold">0</span>
          </div>
          <div>
            <span className="font-medium">Precisión:</span>{" "}
            <span className="text-lg font-bold">100%</span>
          </div>
          <div>
            <span className="font-medium">Tiempo:</span>{" "}
            <span className="text-lg font-bold">60s</span>
          </div>
        </div>
      </div>

      {/* Área del test de escritura */}
      <div
        className="relative min-h-[200px] p-6 border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        tabIndex={0}
        // TODO: Añadir autoFocus y event listeners en próximos pasos
      >
        {/* Contenedor de palabras */}
        <div className="text-xl leading-relaxed space-x-1 flex flex-wrap">
          {initialWords.slice(0, 50).map((word, wordIndex) => (
            <span key={`${word.id}-${wordIndex}`} className="inline-block">
              {word.text.split("").map((char, charIndex) => (
                <span
                  key={`${word.id}-${wordIndex}-${charIndex}`}
                  className="relative inline-block"
                >
                  {/* TODO: Aplicar clases de estado en próximos pasos */}
                  <span className="text-muted-foreground">{char}</span>
                </span>
              ))}
              {/* Espacio después de cada palabra */}
              {wordIndex < initialWords.slice(0, 50).length - 1 && (
                <span className="text-muted-foreground"> </span>
              )}
            </span>
          ))}
        </div>

        {/* Cursor/Caret - TODO: Implementar posicionamiento dinámico */}
        <div className="absolute top-6 left-6 w-0.5 h-6 bg-primary animate-pulse" />
      </div>

      {/* Instrucciones */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          Haz clic en el área de arriba y comienza a escribir para iniciar el
          test
        </p>
      </div>

      {/* Debug: Mostrar información de las palabras cargadas */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Debug:</strong> Se cargaron {initialWords.length} palabras.
          Mostrando las primeras 50 para el test.
        </p>
      </div>
    </div>
  );
}
