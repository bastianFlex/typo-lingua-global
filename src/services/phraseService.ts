
import { LanguageCode, Phrase, PhraseCollection, Difficulty } from '@/types';
import phrasesData from '@/data/phrases.json';

export const getPhrasesByLanguage = (language: LanguageCode): Phrase[] => {
  const phrases = (phrasesData as PhraseCollection)[language] || [];
  return phrases;
};

export const getRandomPhrase = (language: LanguageCode, difficulty: Difficulty = 'easy'): Phrase => {
  const allPhrases = getPhrasesByLanguage(language);
  
  // Filtrar frases pela dificuldade
  let filteredPhrases: Phrase[] = [];
  
  console.log(`Getting phrase with difficulty: ${difficulty}`);
  
  switch (difficulty) {
    case 'easy':
      // Frases fáceis: curtas (menos de 30 caracteres)
      filteredPhrases = allPhrases.filter(phrase => phrase.text.length < 50);
      break;
    case 'medium':
      // Frases médias: entre 50 e 100 caracteres
      filteredPhrases = allPhrases.filter(phrase => 
        phrase.text.length >= 50 && phrase.text.length < 100
      );
      break;
    case 'hard':
      // Frases difíceis: entre 100 e 150 caracteres
      filteredPhrases = allPhrases.filter(phrase => 
        phrase.text.length >= 100 && phrase.text.length < 150
      );
      break;
    case 'expert':
      // Frases expert: mais de 150 caracteres
      filteredPhrases = allPhrases.filter(phrase => phrase.text.length >= 150);
      break;
    default:
      filteredPhrases = allPhrases;
  }
  
  console.log(`Found ${filteredPhrases.length} phrases matching difficulty ${difficulty}`);
  
  // Se nenhuma frase corresponder à dificuldade, use todas as frases
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
