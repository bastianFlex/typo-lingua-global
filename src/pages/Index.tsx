
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import LanguageSelector from '@/components/LanguageSelector';
import DifficultySelector from '@/components/DifficultySelector';
import TimeSelector from '@/components/TimeSelector';
import AudioSettings from '@/components/AudioSettings';
import TypingArea from '@/components/TypingArea';
import HistoryResults from '@/components/HistoryResults';
import { 
  LanguagePair, 
  Phrase, 
  TypingResult, 
  Difficulty, 
  TimeOption,
  AudioFeedback
} from '@/types';
import { getRandomPhrase } from '@/services/phraseService';
import { saveResult, getResults } from '@/services/storageService';
import "flag-icons/css/flag-icons.min.css";

const Index: React.FC = () => {
  const [languagePair, setLanguagePair] = useState<LanguagePair>({ source: 'pt', target: 'pt' });
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [results, setResults] = useState<TypingResult[]>([]);
  const [activeTab, setActiveTab] = useState('typing');
  
  // New state variables for the new features
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [timeOption, setTimeOption] = useState<TimeOption>('1');
  const [audioSettings, setAudioSettings] = useState<AudioFeedback>({
    enabled: true,
    volume: 0.5
  });

  useEffect(() => {
    // Load saved results
    const savedResults = getResults();
    setResults(savedResults);
  }, []);

  useEffect(() => {
    // Load a new phrase when language or difficulty changes
    const phrase = getRandomPhrase(languagePair.source, difficulty);
    setCurrentPhrase(phrase);
  }, [languagePair, difficulty]);

  const handleLanguageChange = (pair: LanguagePair) => {
    setLanguagePair(pair);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    // This will trigger the useEffect to load a new phrase with the proper difficulty
  };

  const handleTimeChange = (newTime: TimeOption) => {
    setTimeOption(newTime);
  };

  const handleAudioSettingsChange = (settings: AudioFeedback) => {
    setAudioSettings(settings);
  };

  const handleNextPhrase = () => {
    const phrase = getRandomPhrase(languagePair.source, difficulty);
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
        duration,
        difficulty  // Pass the difficulty to save it with the result
      );
      
      setResults((prev) => [result, ...prev]);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LanguageSelector
            selectedPair={languagePair}
            onLanguageChange={handleLanguageChange}
          />
          <DifficultySelector 
            selectedDifficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TimeSelector
            selectedTime={timeOption}
            onTimeChange={handleTimeChange}
          />
          <AudioSettings
            audioSettings={audioSettings}
            onAudioSettingsChange={handleAudioSettingsChange}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger 
              value="typing" 
              className="text-lg py-3 data-[state=active]:bg-app-purple data-[state=active]:text-white transition-all"
            >
              Digitação
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-lg py-3 data-[state=active]:bg-app-purple data-[state=active]:text-white transition-all"
            >
              Histórico
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="typing" className="mt-0 animate-fade-in">
            {currentPhrase && (
              <TypingArea
                phrase={currentPhrase}
                languagePair={languagePair}
                difficulty={difficulty}
                timeOption={timeOption}
                audioSettings={audioSettings}
                onComplete={handleTypingComplete}
              />
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 animate-fade-in">
            <div className="bg-gradient-to-br from-app-blue/50 to-app-blue/60 p-6 rounded-lg border border-gray-700 shadow-lg">
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
