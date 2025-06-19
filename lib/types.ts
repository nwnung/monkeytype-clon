import { WordData } from "./words";

/**
 * Estados posibles para cada carácter durante el test
 */
export type CharacterStatus = "pending" | "correct" | "incorrect";

/**
 * Estados posibles para el test completo
 */
export type TestStatus = "waiting" | "running" | "finished";

/**
 * Representa un carácter individual en el test
 */
export interface TestCharacter {
  /** El carácter original */
  char: string;
  /** Estado actual del carácter */
  status: CharacterStatus;
  /** Índice global del carácter en todo el test */
  globalIndex: number;
  /** Índice de la palabra a la que pertenece */
  wordIndex: number;
  /** Índice del carácter dentro de su palabra */
  charIndex: number;
  /** Si es un espacio entre palabras */
  isSpace?: boolean;
}

/**
 * Representa una palabra completa en el test
 */
export interface TestWord {
  /** Datos originales de la palabra */
  data: WordData;
  /** Array de caracteres que forman la palabra */
  characters: TestCharacter[];
  /** Índice de la palabra en el test */
  index: number;
}

/**
 * Configuración del test
 */
export interface TestConfig {
  /** Duración del test en segundos */
  duration: number;
  /** Nombre de la lista de palabras a usar */
  wordListName: string;
}

/**
 * Métricas calculadas del test
 */
export interface TestMetrics {
  /** Palabras por minuto */
  wpm: number;
  /** Precisión como porcentaje (0-100) */
  accuracy: number;
  /** Caracteres correctos */
  correctChars: number;
  /** Caracteres incorrectos */
  incorrectChars: number;
  /** Total de caracteres escritos */
  totalChars: number;
}

/**
 * Estado completo del test de mecanografía
 */
export interface TypingTestState {
  /** Estado actual del test */
  status: TestStatus;
  /** Configuración del test */
  config: TestConfig;
  /** Array de palabras del test */
  words: TestWord[];
  /** Posición actual del cursor (índice global) */
  currentPosition: number;
  /** Tiempo restante en segundos */
  timeRemaining: number;
  /** Métricas actuales */
  metrics: TestMetrics;
  /** Timestamp cuando empezó el test */
  startTime?: number;
  /** Errores de entrada (para debugging) */
  errors: string[];
}

/**
 * Acciones posibles para el reducer del test
 */
export type TypingTestAction =
  | { type: "START_TEST" }
  | { type: "TYPE_CHARACTER"; payload: { char: string } }
  | { type: "BACKSPACE" }
  | { type: "TICK_TIMER" }
  | { type: "FINISH_TEST" }
  | { type: "RESET_TEST"; payload: { words: WordData[]; config: TestConfig } }
  | { type: "UPDATE_METRICS" };

/**
 * Props para el componente Character
 */
export interface CharacterProps {
  character: TestCharacter;
  isActive: boolean;
}

/**
 * Props para el componente Caret
 */
export interface CaretProps {
  position: number;
  isVisible: boolean;
}
