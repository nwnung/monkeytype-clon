"use client";

import { useMemo } from "react";
import { WordData } from "@/lib/words";
import { TestWord, TestCharacter, TestConfig } from "@/lib/types";
import { Character } from "./Character";
import { Caret } from "./Caret";

interface TypingTestContainerProps {
  initialWords: WordData[];
}

/**
 * Convierte las palabras iniciales en el formato requerido para el test
 */
function prepareTestWords(words: WordData[]): TestWord[] {
  let globalIndex = 0;

  return words.map((wordData, wordIndex) => {
    const characters: TestCharacter[] = [];

    // Convertir cada carácter de la palabra
    wordData.text.split("").forEach((char, charIndex) => {
      characters.push({
        char,
        status: "pending",
        globalIndex: globalIndex++,
        wordIndex,
        charIndex,
        isSpace: false,
      });
    });

    // Añadir espacio después de cada palabra (excepto la última)
    if (wordIndex < words.length - 1) {
      characters.push({
        char: " ",
        status: "pending",
        globalIndex: globalIndex++,
        wordIndex,
        charIndex: wordData.text.length,
        isSpace: true,
      });
    }

    return {
      data: wordData,
      characters,
      index: wordIndex,
    };
  });
}

export function TypingTestContainer({
  initialWords,
}: TypingTestContainerProps) {
  // Configuración inicial del test
  const testConfig: TestConfig = {
    duration: 60,
    wordListName: "english_200",
  };

  // Preparar las palabras para el test (memoizado para evitar recálculos)
  const testWords = useMemo(() => {
    return prepareTestWords(initialWords.slice(0, 50)); // Limitamos a 50 palabras para empezar
  }, [initialWords]);

  // Crear un array plano de todos los caracteres para renderizado
  const allCharacters = useMemo(() => {
    return testWords.flatMap((word) => word.characters);
  }, [testWords]);

  // Estado inicial (en próximos pasos esto será manejado por useReducer)
  const currentPosition = 0;
  const isTestRunning = false;

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
            <span className="text-lg font-bold">{testConfig.duration}s</span>
          </div>
        </div>
      </div>

      {/* Área del test de escritura */}
      <div
        className="relative min-h-[200px] p-6 border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        tabIndex={0}
        // TODO: Añadir autoFocus y event listeners en próximos pasos
      >
        {/* Contenedor de palabras y caracteres */}
        <div className="text-xl leading-relaxed relative">
          {/* Renderizar todos los caracteres */}
          {allCharacters.map((character, index) => (
            <Character
              key={`char-${character.globalIndex}`}
              character={character}
              isActive={index === currentPosition}
            />
          ))}

          {/* Cursor posicionado en el carácter actual */}
          <Caret
            position={currentPosition}
            isVisible={!isTestRunning} // Visible cuando no está corriendo el test
          />
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          Haz clic en el área de arriba y comienza a escribir para iniciar el
          test
        </p>
      </div>

      {/* Debug: Información del renderizado */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Debug:</strong> Se cargaron {initialWords.length} palabras
            originales.
          </p>
          <p>
            Renderizando {testWords.length} palabras con {allCharacters.length}{" "}
            caracteres totales.
          </p>
          <p>
            Posición actual del cursor: {currentPosition} /{" "}
            {allCharacters.length}
          </p>
          <p>
            Estados:{" "}
            {allCharacters.filter((c) => c.status === "pending").length}{" "}
            pendientes,{" "}
            {allCharacters.filter((c) => c.status === "correct").length}{" "}
            correctos,{" "}
            {allCharacters.filter((c) => c.status === "incorrect").length}{" "}
            incorrectos
          </p>
        </div>
      </div>
    </div>
  );
}
