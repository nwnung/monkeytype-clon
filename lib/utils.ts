import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcula las palabras por minuto (WPM) basado en caracteres correctos
 * Formula estándar: (caracteres correctos / 5) / (tiempo en minutos)
 * Se dividen entre 5 porque se considera que una palabra promedio tiene 5 caracteres
 *
 * @param correctChars - Número de caracteres escritos correctamente
 * @param timeElapsedMs - Tiempo transcurrido en milisegundos
 * @returns WPM redondeado al entero más cercano
 */
export function calculateWPM(
  correctChars: number,
  timeElapsedMs: number
): number {
  if (timeElapsedMs <= 0) return 0;

  const timeElapsedMinutes = timeElapsedMs / 1000 / 60;
  const words = correctChars / 5;
  const wpm = words / timeElapsedMinutes;

  return Math.round(wpm);
}

/**
 * Calcula la precisión como porcentaje basado en caracteres correctos e incorrectos
 * Formula: (caracteres correctos / total de caracteres escritos) * 100
 *
 * @param correctChars - Número de caracteres escritos correctamente
 * @param incorrectChars - Número de caracteres escritos incorrectamente
 * @returns Precisión como porcentaje (0-100) redondeado al entero más cercano
 */
export function calculateAccuracy(
  correctChars: number,
  incorrectChars: number
): number {
  const totalChars = correctChars + incorrectChars;

  if (totalChars === 0) return 100; // 100% si no se ha escrito nada

  const accuracy = (correctChars / totalChars) * 100;
  return Math.round(accuracy);
}
