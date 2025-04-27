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
  
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [timeOption, setTimeOption] = useState<TimeOption>('1');
  const [audioSettings, setAudioSettings] = useState<AudioFeedback>({
    enabled: true,
    volume: 0.5
  });

  useEffect(() => {
    const savedResults = getResults();
    setResults(savedResults);
  }, []);

  useEffect(() => {
    const phrase = getRandomPhrase(languagePair.source, difficulty);
    setCurrentPhrase(phrase);
  }, [languagePair, difficulty]);

  const handleLanguageChange = (pair: LanguagePair) => {
    setLanguagePair(pair);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
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
        difficulty
      );
      
      setResults((prev) => [result, ...prev]);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass-card mb-8 p-6 gradient-border">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimeSelector
              selectedTime={timeOption}
              onTimeChange={handleTimeChange}
            />
            <AudioSettings
              audioSettings={audioSettings}
              onAudioSettingsChange={handleAudioSettingsChange}
            />
          </div>
        </div>

        <div className="glass-card p-6 mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-[400px] max-w-full grid-cols-2 mx-auto mb-8 glass-card p-1 rounded-xl">
              <TabsTrigger 
                value="typing" 
                className="text-lg py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white transition-all duration-300"
              >
                Digitação
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="text-lg py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600/90 data-[state=active]:to-blue-600/90 data-[state=active]:text-white transition-all duration-300"
              >
                Histórico
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="typing" className="mt-0 animate-[fadeInUp_0.4s_ease-out]">
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
            
            <TabsContent value="history" className="mt-0 animate-[fadeInUp_0.4s_ease-out]">
              <div className="glass-card gradient-border p-6">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Seu Histórico de Resultados</h2>
                <HistoryResults results={results} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
