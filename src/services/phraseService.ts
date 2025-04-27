import { LanguageCode, Phrase, PhraseCollection, Difficulty } from '@/types';
import phrasesData from '@/data/phrases.json';

export const getPhrasesByLanguage = (language: LanguageCode): Phrase[] => {
  const phrases = (phrasesData as PhraseCollection)[language] || [];
  
  // If no phrases found for selected language but it's not Portuguese,
  // try to get Portuguese phrases and use their translations
  if (phrases.length === 0 && language !== 'pt') {
    const ptPhrases = (phrasesData as PhraseCollection)['pt'] || [];
    return ptPhrases.map(phrase => ({
      ...phrase,
      text: phrase.translation[language] || phrase.text,
    }));
  }
  
  return phrases;
};

export const getPhrasesByDifficulty = (language: LanguageCode, difficulty: Difficulty): Phrase[] => {
  const allPhrases = getPhrasesByLanguage(language);
  return allPhrases.filter(phrase => phrase.difficulty === difficulty);
};

export const getRandomPhrase = (language: LanguageCode, difficulty: Difficulty = 'easy'): Phrase => {
  let phrases = getPhrasesByLanguage('pt'); // Always get Portuguese phrases as base
  
  // If no phrases at all, return a default phrase
  if (!phrases || phrases.length === 0) {
    return {
      text: "No phrases available for this language.",
      difficulty: "easy",
      translation: {
        en: "No phrases available for this language.",
        fr: "Aucune phrase disponible pour cette langue.",
        pt: "Nenhuma frase disponível para este idioma."
      },
      mapping: [
        {
          original: "No phrases available for this language.",
          translated: "No phrases available for this language."
        }
      ]
    };
  }
  
  // Filter by difficulty
  const filteredPhrases = phrases.filter(phrase => phrase.difficulty === difficulty);
  
  // If no phrases match difficulty, use all phrases
  if (filteredPhrases.length === 0) {
    console.log(`No phrases match difficulty ${difficulty}, using all phrases`);
    phrases = phrases.filter(p => p.mapping && p.translation[language]);
  } else {
    phrases = filteredPhrases;
  }
  
  const randomIndex = Math.floor(Math.random() * phrases.length);
  const selectedPhrase = phrases[randomIndex];
  
  // If language is not Portuguese, transform the phrase
  if (language !== 'pt' && selectedPhrase.translation[language]) {
    return {
      ...selectedPhrase,
      text: selectedPhrase.translation[language] || selectedPhrase.text,
      originalText: selectedPhrase.text, // Keep original for reference
    };
  }
  
  return selectedPhrase;
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
