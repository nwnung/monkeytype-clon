import { db } from "./db";

export interface WordData {
  id: string;
  text: string;
}

/**
 * Obtiene aproximadamente 200 palabras aleatorias de una lista específica
 * @param wordListName - Nombre de la lista de palabras (ej: "english_200")
 * @returns Array de palabras con id y texto
 */
export async function getWords(
  wordListName: string = "english_200"
): Promise<WordData[]> {
  try {
    // Primero obtenemos la lista de palabras
    const wordList = await db.wordList.findUnique({
      where: {
        name: wordListName,
      },
      include: {
        words: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });

    if (!wordList || wordList.words.length === 0) {
      // Si no encontramos la lista, intentamos obtener cualquier lista disponible
      const fallbackWordList = await db.wordList.findFirst({
        include: {
          words: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      });

      if (!fallbackWordList || fallbackWordList.words.length === 0) {
        throw new Error(
          "No hay listas de palabras disponibles en la base de datos"
        );
      }

      return shuffleArray(fallbackWordList.words).slice(0, 200);
    }

    // Mezclamos las palabras y tomamos hasta 200
    const shuffledWords = shuffleArray(wordList.words);
    return shuffledWords.slice(0, Math.min(200, shuffledWords.length));
  } catch (error) {
    console.error("Error obteniendo palabras:", error);
    // Fallback con palabras por defecto si hay error
    return getDefaultWords();
  }
}

/**
 * Función utilitaria para mezclar un array (algoritmo Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Palabras de fallback en caso de error con la base de datos
 */
function getDefaultWords(): WordData[] {
  const defaultWordTexts = [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "i",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "this",
    "but",
    "his",
    "by",
    "from",
    "they",
    "we",
    "say",
    "her",
    "she",
    "or",
    "an",
    "will",
    "my",
    "one",
    "all",
    "would",
    "there",
    "their",
    "what",
    "so",
    "up",
    "out",
    "if",
    "about",
    "who",
    "get",
    "which",
    "go",
    "me",
    "when",
    "make",
    "can",
    "like",
    "time",
    "no",
    "just",
    "him",
    "know",
    "take",
    "people",
    "into",
    "year",
    "your",
    "good",
    "some",
    "could",
    "them",
    "see",
    "other",
    "than",
    "then",
    "now",
    "look",
    "only",
    "come",
    "its",
    "over",
    "think",
    "also",
    "back",
    "after",
    "use",
    "two",
    "how",
    "our",
    "work",
    "first",
    "well",
    "way",
    "even",
    "new",
    "want",
    "because",
    "any",
    "these",
    "give",
    "day",
    "most",
    "us",
  ];

  return defaultWordTexts.map((text, index) => ({
    id: `default-${index}`,
    text,
  }));
}
