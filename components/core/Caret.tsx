"use client";

import { CaretProps } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Componente que renderiza el cursor/caret del test de mecanografía
 */
export function Caret({ position, isVisible }: CaretProps) {
  return (
    <span
      className={cn(
        "absolute inline-block w-0.5 h-6 bg-primary transition-opacity duration-150",
        {
          "animate-pulse": isVisible,
          "opacity-0": !isVisible,
          "opacity-100": isVisible,
        }
      )}
      style={
        {
          // El posicionamiento se manejará desde el componente padre
          // basado en la posición del carácter actual
        }
      }
      data-position={position}
      aria-hidden="true"
    />
  );
}
