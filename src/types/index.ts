
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
  translation: {
    [key in LanguageCode]?: string;
  };
}

export interface PhraseCollection {
  [key: string]: Phrase[];
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

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
