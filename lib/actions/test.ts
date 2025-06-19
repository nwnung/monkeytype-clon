"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { calculateWPM, calculateAccuracy } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

/**
 * Datos necesarios para guardar un resultado de test
 */
export interface SaveTestResultData {
  /** Lista de palabras utilizada */
  wordListName: string;
  /** Duración configurada del test en segundos */
  duration: number;
  /** Caracteres correctos */
  correctChars: number;
  /** Caracteres incorrectos */
  incorrectChars: number;
  /** Tiempo que duró el test en milisegundos */
  testDurationMs: number;
}

/**
 * Resultado de la operación de guardado
 */
export type SaveTestResultResponse =
  | { success: true; testId: string }
  | { success: false; error: string };

/**
 * Server Action para guardar el resultado de un test de mecanografía
 * Recalcula las métricas en el servidor y las guarda en la base de datos
 */
export async function saveTestResult(
  data: SaveTestResultData
): Promise<SaveTestResultResponse> {
  try {
    // Obtener la sesión del usuario de forma segura
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Si no hay sesión, el resultado no se guarda (usuario invitado)
    // Pero no es un error, simplemente retornamos éxito sin guardar
    if (!user) {
      return { success: true, testId: "guest-test" };
    }

    // Asegurarse de que el perfil del usuario exista en la DB pública (Upsert)
    // Esto resuelve el problema para usuarios que se registraron antes de que la sincronización existiera.
    try {
      await db.user.upsert({
        where: { id: user.id },
        update: { email: user.email }, // Actualizar el email por si ha cambiado
        create: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (dbError) {
      console.error("Error al sincronizar el perfil de usuario:", dbError);
      return {
        success: false,
        error: "Fallo al sincronizar el perfil de usuario",
      };
    }

    // Recalcular métricas en el servidor para validación
    const totalChars = data.correctChars + data.incorrectChars;
    const wpm = calculateWPM(data.correctChars, data.testDurationMs);
    const accuracy = calculateAccuracy(data.correctChars, data.incorrectChars);

    // Validaciones básicas
    if (data.correctChars < 0 || data.incorrectChars < 0) {
      return { success: false, error: "Caracteres no pueden ser negativos" };
    }

    if (data.testDurationMs <= 0) {
      return { success: false, error: "Duración del test debe ser positiva" };
    }

    if (wpm > 300) {
      return { success: false, error: "WPM demasiado alto, posible error" };
    }

    // Buscar la lista de palabras por nombre
    const wordList = await db.wordList.findUnique({
      where: { name: data.wordListName },
    });

    if (!wordList) {
      return { success: false, error: "Lista de palabras no encontrada" };
    }

    // Crear el registro en la base de datos
    const testResult = await db.testResult.create({
      data: {
        userId: user.id,
        wordListId: wordList.id,
        wpm,
        accuracy,
        correctChars: data.correctChars,
        incorrectChars: data.incorrectChars,
        totalChars,
        duration: data.duration,
      },
    });

    // Revalidar la página de perfil si existe
    revalidatePath("/profile");

    return { success: true, testId: testResult.id };
  } catch (error) {
    console.error("Error al guardar resultado del test:", error);

    // Retornar error específico según el tipo
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Error interno del servidor" };
  }
}
