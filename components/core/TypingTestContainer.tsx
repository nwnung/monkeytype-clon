"use client";

import { useMemo, useReducer, useEffect, useRef } from "react";
import { WordData } from "@/lib/words";
import {
  TestWord,
  TestCharacter,
  TestConfig,
  TypingTestState,
  TypingTestAction,
  TestMetrics,
} from "@/lib/types";
import { calculateWPM, calculateAccuracy } from "@/lib/utils";
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

/**
 * Calcula las métricas actuales basadas en el estado
 */
function calculateMetrics(state: TypingTestState): TestMetrics {
  const allCharacters = state.words.flatMap((word) => word.characters);
  const typedCharacters = allCharacters.slice(0, state.currentPosition);

  const correctChars = typedCharacters.filter(
    (char) => char.status === "correct"
  ).length;
  const incorrectChars = typedCharacters.filter(
    (char) => char.status === "incorrect"
  ).length;
  const totalChars = correctChars + incorrectChars;

  // Calcular tiempo transcurrido desde el inicio
  const timeElapsedMs = state.startTime ? Date.now() - state.startTime : 0;

  // Usar las funciones utilitarias para calcular WPM y precisión
  const wpm = calculateWPM(correctChars, timeElapsedMs);
  const accuracy = calculateAccuracy(correctChars, incorrectChars);

  return {
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    totalChars,
  };
}

/**
 * Reducer para manejar el estado del test de mecanografía
 */
function typingTestReducer(
  state: TypingTestState,
  action: TypingTestAction
): TypingTestState {
  switch (action.type) {
    case "START_TEST": {
      if (state.status !== "waiting") return state;

      return {
        ...state,
        status: "running",
        startTime: Date.now(),
        timeRemaining: state.config.duration,
      };
    }

    case "TYPE_CHARACTER": {
      if (state.status !== "running" && state.status !== "waiting")
        return state;

      const { char } = action.payload;
      const allCharacters = state.words.flatMap((word) => word.characters);
      const currentChar = allCharacters[state.currentPosition];

      if (!currentChar) return state;

      // Determinar si el carácter es correcto
      const isCorrect = currentChar.char === char;

      // Crear nueva copia de las palabras con el carácter actualizado
      const newWords = state.words.map((word) => ({
        ...word,
        characters: word.characters.map((character) =>
          character.globalIndex === state.currentPosition
            ? {
                ...character,
                status: isCorrect
                  ? ("correct" as const)
                  : ("incorrect" as const),
              }
            : character
        ),
      }));

      const newPosition = state.currentPosition + 1;
      const isTestComplete = newPosition >= allCharacters.length;

      const newState = {
        ...state,
        words: newWords,
        currentPosition: newPosition,
        // Si estamos esperando, cambiar a running al procesar el primer carácter
        // Si el test está completo, cambiar a finished
        status: isTestComplete
          ? ("finished" as const)
          : state.status === "waiting"
          ? ("running" as const)
          : state.status,
        startTime: state.status === "waiting" ? Date.now() : state.startTime,
      };

      // Recalcular métricas
      const newMetrics = calculateMetrics(newState);

      return {
        ...newState,
        metrics: newMetrics,
      };
    }

    case "BACKSPACE": {
      if (
        (state.status !== "running" && state.status !== "waiting") ||
        state.currentPosition === 0
      )
        return state;

      const newPosition = state.currentPosition - 1;

      // Crear nueva copia de las palabras con el carácter resetado
      const newWords = state.words.map((word) => ({
        ...word,
        characters: word.characters.map((character) =>
          character.globalIndex === newPosition
            ? { ...character, status: "pending" as const }
            : character
        ),
      }));

      const newState = {
        ...state,
        words: newWords,
        currentPosition: newPosition,
      };

      // Recalcular métricas
      const newMetrics = calculateMetrics(newState);

      return {
        ...newState,
        metrics: newMetrics,
      };
    }

    case "TICK_TIMER": {
      if (state.status !== "running") return state;

      const newTimeRemaining = state.timeRemaining - 1;

      if (newTimeRemaining <= 0) {
        return {
          ...state,
          status: "finished",
          timeRemaining: 0,
        };
      }

      return {
        ...state,
        timeRemaining: newTimeRemaining,
      };
    }

    case "FINISH_TEST": {
      return {
        ...state,
        status: "finished",
      };
    }

    case "RESET_TEST": {
      const { words, config } = action.payload;
      const testWords = prepareTestWords(words.slice(0, 50));

      return {
        status: "waiting",
        config,
        words: testWords,
        currentPosition: 0,
        timeRemaining: config.duration,
        metrics: {
          wpm: 0,
          accuracy: 100,
          correctChars: 0,
          incorrectChars: 0,
          totalChars: 0,
        },
        startTime: undefined,
        errors: [],
      };
    }

    case "UPDATE_METRICS": {
      const newMetrics = calculateMetrics(state);
      return {
        ...state,
        metrics: newMetrics,
      };
    }

    default:
      return state;
  }
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
    return prepareTestWords(initialWords.slice(0, 50));
  }, [initialWords]);

  // Estado inicial
  const initialState: TypingTestState = {
    status: "waiting",
    config: testConfig,
    words: testWords,
    currentPosition: 0,
    timeRemaining: testConfig.duration,
    metrics: {
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    },
    startTime: undefined,
    errors: [],
  };

  // Reducer para manejar el estado
  const [state, dispatch] = useReducer(typingTestReducer, initialState);

  // Referencia al contenedor para el foco
  const containerRef = useRef<HTMLDivElement>(null);

  // Crear un array plano de todos los caracteres para renderizado
  const allCharacters = useMemo(() => {
    return state.words.flatMap((word) => word.characters);
  }, [state.words]);

  // Listener de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Evitar que el evento se propague si no estamos en el contenedor
      if (document.activeElement !== containerRef.current) return;

      // Prevenir comportamientos por defecto del navegador
      event.preventDefault();

      if (event.key === "Backspace") {
        dispatch({ type: "BACKSPACE" });
      } else if (event.key.length === 1) {
        // Solo procesar caracteres imprimibles (longitud 1)
        if (state.status === "running" || state.status === "waiting") {
          dispatch({
            type: "TYPE_CHARACTER",
            payload: { char: event.key },
          });
        }
      }
    };

    // Agregar el listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.status]);

  // Timer para el test
  useEffect(() => {
    if (state.status !== "running") return;

    const interval = setInterval(() => {
      dispatch({ type: "TICK_TIMER" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  // Auto-focus en el contenedor al montar
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header del test con métricas */}
      <div className="mb-8">
        {/* Métricas principales */}
        <div className="flex justify-center gap-12 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {state.metrics.wpm}
            </div>
            <div className="text-sm text-muted-foreground font-medium">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {state.metrics.accuracy}%
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Precisión
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                state.timeRemaining <= 10 ? "text-destructive" : "text-primary"
              }`}
            >
              {Math.floor(state.timeRemaining / 60)}:
              {String(state.timeRemaining % 60).padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Tiempo
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Estado:{" "}
            <span className="font-medium capitalize">{state.status}</span>
          </div>
          <div className="flex gap-4">
            <span>{state.metrics.correctChars} correctos</span>
            <span>{state.metrics.incorrectChars} errores</span>
            <span>{state.metrics.totalChars} total</span>
          </div>
        </div>
      </div>

      {/* Área del test de escritura */}
      <div
        ref={containerRef}
        className="relative min-h-[200px] p-6 border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-text"
        tabIndex={0}
        autoFocus
      >
        {/* Contenedor de palabras y caracteres */}
        <div className="text-xl leading-relaxed relative">
          {/* Renderizar todos los caracteres */}
          {allCharacters.map((character, index) => (
            <Character
              key={`char-${character.globalIndex}`}
              character={character}
              isActive={index === state.currentPosition}
            />
          ))}

          {/* Cursor posicionado en el carácter actual */}
          <Caret
            position={state.currentPosition}
            isVisible={state.status !== "finished"}
          />
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 text-center">
        {state.status === "waiting" && (
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              Haz clic en el área de arriba y comienza a escribir para iniciar
              el test
            </p>
            <p className="text-sm text-muted-foreground">
              Presiona Backspace para corregir errores durante el test
            </p>
          </div>
        )}
        {state.status === "running" && (
          <div className="space-y-2">
            <p className="text-lg font-medium text-primary">¡Escribiendo!</p>
            <p className="text-sm text-muted-foreground">
              Presiona Backspace para corregir errores
            </p>
          </div>
        )}
        {state.status === "finished" && (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-primary">
              ¡Test Completado! 🎉
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-lg font-medium">Resultados Finales:</p>
              <div className="flex justify-center gap-8 text-sm">
                <span>
                  <strong>WPM:</strong> {state.metrics.wpm}
                </span>
                <span>
                  <strong>Precisión:</strong> {state.metrics.accuracy}%
                </span>
                <span>
                  <strong>Caracteres:</strong> {state.metrics.correctChars}/
                  {state.metrics.totalChars}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug: Información del renderizado */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Debug:</strong> Se cargaron {initialWords.length} palabras
            originales.
          </p>
          <p>
            Renderizando {state.words.length} palabras con{" "}
            {allCharacters.length} caracteres totales.
          </p>
          <p>
            Posición actual del cursor: {state.currentPosition} /{" "}
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
          <p>
            Métricas: {state.metrics.correctChars} correctos,{" "}
            {state.metrics.incorrectChars} incorrectos,{" "}
            {state.metrics.totalChars} total
          </p>
        </div>
      </div>
    </div>
  );
}
