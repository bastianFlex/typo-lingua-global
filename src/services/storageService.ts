
import { v4 as uuidv4 } from 'uuid';
import { LanguageCode, TypingResult, Difficulty } from '@/types';

const STORAGE_KEY = 'typing_results';

export const saveResult = (
  language: LanguageCode, 
  wpm: number, 
  accuracy: number, 
  errors: number, 
  totalChars: number, 
  correctChars: number, 
  duration: number,
  difficulty: Difficulty = 'easy' // Default to easy if not provided
): TypingResult => {
  const result: TypingResult = {
    id: uuidv4(),
    date: new Date().toISOString(),
    language,
    wpm,
    accuracy,
    errors,
    totalChars,
    correctChars,
    duration,
    difficulty
  };

  const existingResults = getResults();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([
    result,
    ...existingResults
  ]));

  return result;
};

export const getResults = (): TypingResult[] => {
  const resultsJson = localStorage.getItem(STORAGE_KEY);
  if (!resultsJson) return [];

  try {
    const results = JSON.parse(resultsJson);
    return Array.isArray(results) ? results : [];
  } catch (error) {
    console.error("Error parsing results:", error);
    return [];
  }
};

export const clearResults = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
