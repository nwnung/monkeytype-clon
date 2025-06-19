"use client";

import { TestMetrics } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, Target, RotateCcw } from "lucide-react";

interface ResultsProps {
  /** Métricas finales del test */
  metrics: TestMetrics;
  /** Duración configurada del test en segundos */
  testDuration: number;
  /** Función para reiniciar el test */
  onRestart?: () => void;
  /** Estado de guardado del resultado */
  saveStatus?: "idle" | "saving" | "saved" | "error";
  /** Mensaje de error si el guardado falló */
  saveError?: string;
}

/**
 * Componente que muestra los resultados finales del test de mecanografía
 */
export function Results({
  metrics,
  testDuration,
  onRestart,
  saveStatus = "idle",
  saveError,
}: ResultsProps) {
  // Determinar el mensaje de rendimiento basado en WPM
  const getPerformanceMessage = (
    wpm: number
  ): { message: string; emoji: string; color: string } => {
    if (wpm >= 70)
      return { message: "¡Excelente!", emoji: "🔥", color: "text-green-600" };
    if (wpm >= 50)
      return { message: "¡Muy bien!", emoji: "🎯", color: "text-blue-600" };
    if (wpm >= 30)
      return {
        message: "¡Buen trabajo!",
        emoji: "👍",
        color: "text-yellow-600",
      };
    return {
      message: "¡Sigue practicando!",
      emoji: "💪",
      color: "text-orange-600",
    };
  };

  const performance = getPerformanceMessage(metrics.wpm);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header de resultados */}
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8" />
          ¡Test Completado!
        </div>
        <div className={`text-xl font-semibold ${performance.color}`}>
          {performance.message} {performance.emoji}
        </div>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WPM */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Palabras por Minuto
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.wpm}</div>
            <p className="text-xs text-muted-foreground">WPM</p>
          </CardContent>
        </Card>

        {/* Precisión */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisión</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {metrics.accuracy}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.correctChars} de {metrics.totalChars} correctos
            </p>
          </CardContent>
        </Card>

        {/* Caracteres */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caracteres</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📝</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {metrics.totalChars}
            </div>
            <p className="text-xs text-muted-foreground">Total escritos</p>
          </CardContent>
        </Card>
      </div>

      {/* Detalles adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalles del Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                Duración:
              </span>
              <div className="text-lg font-semibold">{testDuration}s</div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Errores:
              </span>
              <div className="text-lg font-semibold text-red-600">
                {metrics.incorrectChars}
              </div>
            </div>
          </div>

          {/* Barra de progreso de precisión */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-muted-foreground">
                Distribución de caracteres
              </span>
              <span className="text-muted-foreground">
                {metrics.accuracy}% precisión
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.accuracy}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{metrics.correctChars} correctos</span>
              <span>{metrics.incorrectChars} errores</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado del guardado */}
      {saveStatus !== "idle" && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-center space-x-2">
              {saveStatus === "saving" && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  <span className="text-sm text-muted-foreground">
                    Guardando resultado...
                  </span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <div className="text-green-600">✓</div>
                  <span className="text-sm text-green-600">
                    Resultado guardado exitosamente
                  </span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <div className="text-red-600">✗</div>
                  <span className="text-sm text-red-600">
                    Error al guardar: {saveError || "Error desconocido"}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón para reiniciar */}
      {onRestart && (
        <div className="flex justify-center">
          <Button
            onClick={onRestart}
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Intentar de Nuevo
          </Button>
        </div>
      )}
    </div>
  );
}
