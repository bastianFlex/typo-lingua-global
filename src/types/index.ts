
export type LanguageCode = 'pt' | 'en' | 'fr';

export interface LanguagePair {
  source: LanguageCode;
  target: LanguageCode;
}

export interface Translation {
  [key: string]: string;
}

export interface Phrase {
  text: string;
  difficulty?: Difficulty;
  translation: {
    [key in LanguageCode]?: string;
  };
  mapping?: Array<{
    original: string;
    translated: string;
  }>;
  originalText?: string; // Added this property to fix the error
}

export interface PhraseCollection {
  [key: string]: Phrase[];
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'very_hard';

export type TimeOption = '1' | '2' | '3' | '4' | '5' | 'infinite';

export interface TypingResult {
  id: string;
  date: string;
  language: LanguageCode;
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalChars: number;
  duration: number;
  difficulty: Difficulty;
}

export type TypingStatus = 'idle' | 'started' | 'finished';

export interface AudioFeedback {
  enabled: boolean;
  volume: number;
}
