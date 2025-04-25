
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
}

export type TypingStatus = 'idle' | 'started' | 'finished';
