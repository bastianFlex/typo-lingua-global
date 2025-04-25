
import { LanguageCode, Phrase, PhraseCollection, Difficulty } from '@/types';
import phrasesData from '@/data/phrases.json';

export const getPhrasesByLanguage = (language: LanguageCode): Phrase[] => {
  const phrases = (phrasesData as PhraseCollection)[language] || [];
  return phrases;
};

export const getRandomPhrase = (language: LanguageCode, difficulty: Difficulty = 'easy'): Phrase => {
  const allPhrases = getPhrasesByLanguage(language);
  
  // Filter phrases by difficulty
  let filteredPhrases: Phrase[] = [];
  
  switch (difficulty) {
    case 'easy':
      // Easy phrases: Short phrases (less than 30 characters)
      filteredPhrases = allPhrases.filter(phrase => phrase.text.length < 30);
      break;
    case 'medium':
      // Medium phrases: Between 30 and 60 characters
      filteredPhrases = allPhrases.filter(phrase => 
        phrase.text.length >= 30 && phrase.text.length < 60
      );
      break;
    case 'hard':
      // Hard phrases: Between 60 and 100 characters
      filteredPhrases = allPhrases.filter(phrase => 
        phrase.text.length >= 60 && phrase.text.length < 100
      );
      break;
    case 'expert':
      // Expert phrases: More than 100 characters
      filteredPhrases = allPhrases.filter(phrase => phrase.text.length >= 100);
      break;
    default:
      filteredPhrases = allPhrases;
  }
  
  // If no phrases match the difficulty, fall back to all phrases
  if (filteredPhrases.length === 0) {
    filteredPhrases = allPhrases;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredPhrases.length);
  return filteredPhrases[randomIndex];
};

export const addCustomPhrase = (
  language: LanguageCode, 
  text: string, 
  translations: { [key in LanguageCode]?: string }
): boolean => {
  try {
    const phrases = getPhrasesByLanguage(language);
    const newPhrase: Phrase = {
      text,
      translation: translations
    };
    
    // Em uma implementação real, salvaríamos isso em um backend ou localStorage
    // Aqui simulamos apenas o retorno bem-sucedido
    console.log("Nova frase adicionada:", newPhrase);
    return true;
  } catch (error) {
    console.error("Erro ao adicionar frase:", error);
    return false;
  }
};
