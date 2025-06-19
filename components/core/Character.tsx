"use client";

import { memo } from "react";
import { CharacterProps } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Componente memoizado que renderiza un carácter individual con estilos
 * basados en su estado (pending, correct, incorrect)
 */
export const Character = memo<CharacterProps>(function Character({
  character,
  isActive,
}) {
  const { char, status, isSpace } = character;

  // Clases CSS basadas en el estado del carácter
  const characterClasses = cn(
    "relative inline-block transition-colors duration-150",
    {
      // Estados del carácter
      "text-muted-foreground": status === "pending",
      "text-green-600 dark:text-green-400": status === "correct",
      "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20":
        status === "incorrect",

      // Si es el carácter activo (donde está el cursor)
      "bg-blue-100 dark:bg-blue-900/30": isActive && status === "pending",

      // Espacios tienen un ancho mínimo para ser visibles
      "min-w-[0.5rem]": isSpace,
    }
  );

  return (
    <span
      className={characterClasses}
      data-char={char}
      data-status={status}
      data-active={isActive}
    >
      {/* Para espacios, mostramos un carácter visible si es incorrecto */}
      {isSpace && status === "incorrect" ? "␣" : char}
    </span>
  );
});

Character.displayName = "Character";
