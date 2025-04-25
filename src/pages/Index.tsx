
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import LanguageSelector from '@/components/LanguageSelector';
import TypingArea from '@/components/TypingArea';
import HistoryResults from '@/components/HistoryResults';
import { LanguagePair, Phrase, TypingResult } from '@/types';
import { getRandomPhrase } from '@/services/phraseService';
import { saveResult, getResults } from '@/services/storageService';
import "flag-icons/css/flag-icons.min.css";

const Index: React.FC = () => {
  const [languagePair, setLanguagePair] = useState<LanguagePair>({ source: 'pt', target: 'pt' });
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [results, setResults] = useState<TypingResult[]>([]);
  const [activeTab, setActiveTab] = useState('typing');

  useEffect(() => {
    // Carrega os resultados salvos
    const savedResults = getResults();
    setResults(savedResults);
  }, []);

  useEffect(() => {
    // Carrega uma nova frase quando o idioma muda
    const phrase = getRandomPhrase(languagePair.source);
    setCurrentPhrase(phrase);
  }, [languagePair]);

  const handleLanguageChange = (pair: LanguagePair) => {
    setLanguagePair(pair);
  };

  const handleNextPhrase = () => {
    const phrase = getRandomPhrase(languagePair.source);
    setCurrentPhrase(phrase);
  };

  const handleTypingComplete = (wpm: number, accuracy: number, errors: number, duration: number) => {
    if (currentPhrase) {
      const totalChars = currentPhrase.text.length;
      const correctChars = totalChars - errors;
      
      const result = saveResult(
        languagePair.source,
        wpm,
        accuracy,
        errors,
        totalChars,
        correctChars,
        duration
      );
      
      setResults((prev) => [result, ...prev]);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <LanguageSelector
            selectedPair={languagePair}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="typing" className="text-lg py-3 data-[state=active]:bg-app-purple">
              Digitação
            </TabsTrigger>
            <TabsTrigger value="history" className="text-lg py-3 data-[state=active]:bg-app-purple">
              Histórico
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="typing" className="mt-0">
            {currentPhrase && (
              <TypingArea
                phrase={currentPhrase}
                languagePair={languagePair}
                onComplete={handleTypingComplete}
              />
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="bg-app-blue/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-white">Seu Histórico de Resultados</h2>
              <HistoryResults results={results} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
