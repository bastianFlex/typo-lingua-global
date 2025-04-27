import { LanguageCode, Phrase, PhraseCollection, Difficulty } from '@/types';
import phrasesData from '@/data/phrases.json';

export const getPhrasesByLanguage = (language: LanguageCode): Phrase[] => {
  const phrases = (phrasesData as PhraseCollection)[language] || [];
  return phrases;
};

export const getPhrasesByDifficulty = (language: LanguageCode, difficulty: Difficulty): Phrase[] => {
  const allPhrases = getPhrasesByLanguage(language);
  return allPhrases.filter(phrase => phrase.difficulty === difficulty);
};

export const getRandomPhrase = (language: LanguageCode, difficulty: Difficulty = 'easy'): Phrase => {
  const allPhrases = getPhrasesByLanguage(language);
  let filteredPhrases: Phrase[] = [];
  
  console.log(`Getting phrase with difficulty: ${difficulty}`);
  
  // Filter phrases by difficulty based on length
  switch (difficulty) {
    case 'easy':
      // Frases fáceis: curtas (menos de 50 caracteres)
      filteredPhrases = allPhrases.filter(phrase => phrase.text.length < 50);
      break;
    case 'medium':
      // Concatenate 2 phrases for medium difficulty
      const mediumPhrases = allPhrases.filter(phrase => 
        phrase.text.length >= 50 && phrase.text.length < 100
      );
      
      if (mediumPhrases.length >= 2) {
        const phrase1 = mediumPhrases[Math.floor(Math.random() * mediumPhrases.length)];
        const phrase2 = mediumPhrases[Math.floor(Math.random() * mediumPhrases.length)];
        return {
          text: `${phrase1.text} ${phrase2.text}`,
          translation: phrase1.translation
        };
      }
      filteredPhrases = mediumPhrases;
      break;
    case 'hard':
      // Concatenate 3 phrases for hard difficulty
      const hardPhrases = allPhrases.filter(phrase => 
        phrase.text.length >= 100 && phrase.text.length < 150
      );
      
      if (hardPhrases.length >= 3) {
        const phrases = [];
        for (let i = 0; i < 3; i++) {
          phrases.push(hardPhrases[Math.floor(Math.random() * hardPhrases.length)]);
        }
        return {
          text: phrases.map(p => p.text).join(' '),
          translation: phrases[0].translation
        };
      }
      filteredPhrases = hardPhrases;
      break;
    case 'expert':
      // Concatenate 4 phrases for expert difficulty
      const expertPhrases = allPhrases.filter(phrase => phrase.text.length >= 150);
      
      if (expertPhrases.length >= 4) {
        const phrases = [];
        for (let i = 0; i < 4; i++) {
          phrases.push(expertPhrases[Math.floor(Math.random() * expertPhrases.length)]);
        }
        return {
          text: phrases.map(p => p.text).join(' '),
          translation: phrases[0].translation
        };
      }
      filteredPhrases = expertPhrases;
      break;
    default:
      filteredPhrases = allPhrases;
  }
  
  // If no phrases match difficulty or not enough phrases for concatenation, use all phrases
  if (filteredPhrases.length === 0) {
    console.log(`No phrases match difficulty ${difficulty}, using all phrases`);
    filteredPhrases = allPhrases;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredPhrases.length);
  const selectedPhrase = filteredPhrases[randomIndex];
  
  console.log(`Selected phrase (${selectedPhrase.text.length} chars): ${selectedPhrase.text.substring(0, 30)}...`);
  
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
