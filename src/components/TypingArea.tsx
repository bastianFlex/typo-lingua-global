import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LanguagePair, Phrase, TypingStatus, Difficulty, TimeOption, AudioFeedback } from '@/types';
import { RotateCcw, Play, Pause, Clock, Award, Volume2, VolumeX, Check, X } from 'lucide-react';
import { playKeyClick, playError, playSuccess } from '@/services/audioService';
import { cn } from '@/lib/utils';
import TranslationHighlight from '@/components/TranslationHighlight';
import TextToSpeech from '@/components/TextToSpeech';

interface TypingAreaProps {
  phrase: Phrase;
  languagePair: LanguagePair;
  difficulty: Difficulty;
  timeOption: TimeOption;
  audioSettings: AudioFeedback;
  onComplete: (wpm: number, accuracy: number, errors: number, duration: number) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  phrase,
  languagePair,
  difficulty,
  timeOption,
  audioSettings,
  onComplete
}) => {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [status, setStatus] = useState<TypingStatus>('idle');
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    errors: 0,
    time: 0,
  });
  const [remainingTime, setRemainingTime] = useState(getTimeInSeconds());
  const [isPaused, setIsPaused] = useState(false);
  const [charStats, setCharStats] = useState<{correct: number, error: number}>({ correct: 0, error: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const targetText = phrase.text;
  const translation = phrase.translation[languagePair.target];

  function getTimeInSeconds(): number {
    if (timeOption === 'infinite') return Infinity;
    return parseInt(timeOption) * 60;
  }

  const calculateStats = useCallback(() => {
    if (!startTime || !endTime) return;

    const timeInSeconds = (endTime - startTime) / 1000;
    if (timeInSeconds <= 0) return;
    
    const words = targetText.trim().split(/\s+/).length;
    const wpm = Math.round((words / timeInSeconds) * 60);

    let correct = 0;
    let errors = 0;

    for (let i = 0; i < Math.max(userInput.length, targetText.length); i++) {
      if (i >= targetText.length) {
        errors++;
      } else if (i >= userInput.length) {
        errors++;
      } else if (userInput[i] !== targetText[i]) {
        errors++;
      } else {
        correct++;
      }
    }

    const totalChars = Math.max(targetText.length, userInput.length);
    const accuracy = Math.max(0, Math.round((correct / totalChars) * 100));

    console.log(`Stats calculated - WPM: ${wpm}, Accuracy: ${accuracy}%, Errors: ${errors}, Correct: ${correct}, Total: ${totalChars}, Time: ${timeInSeconds}s`);

    setStats({
      wpm,
      accuracy,
      correctChars: correct,
      errors,
      time: timeInSeconds,
    });

    onComplete(wpm, accuracy, errors, timeInSeconds);
  }, [startTime, endTime, targetText, userInput, onComplete]);

  const startTyping = () => {
    setUserInput('');
    setStartTime(Date.now());
    setEndTime(null);
    setStatus('started');
    setRemainingTime(getTimeInSeconds());
    setIsPaused(false);
    setCharStats({ correct: 0, error: 0 });
    
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (timeOption !== 'infinite') {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            finishTyping();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseResumeTyping = () => {
    if (status !== 'started') return;

    if (isPaused) {
      setIsPaused(false);
      if (timeOption !== 'infinite') {
        timerRef.current = setInterval(() => {
          setRemainingTime(prev => {
            if (prev <= 1) {
              finishTyping();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetTyping = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setStatus('idle');
    setStats({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      errors: 0,
      time: 0,
    });
    setRemainingTime(getTimeInSeconds());
    setIsPaused(false);
    setCharStats({ correct: 0, error: 0 });

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const finishTyping = () => {
    if (status === 'started') {
      setEndTime(Date.now());
      setStatus('finished');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (audioSettings.enabled) {
        playSuccess(audioSettings.volume);
      }
      
      toast({
        title: "Ótimo trabalho!",
        description: "Você completou a digitação com sucesso.",
        variant: "default",
      });
    }
  };

  useEffect(() => {
    if (endTime) {
      calculateStats();
    }
  }, [endTime, calculateStats]);

  useEffect(() => {
    if (status === 'started' && userInput === targetText) {
      finishTyping();
    }
  }, [userInput, targetText, status, toast]);

  useEffect(() => {
    resetTyping();
  }, [difficulty, timeOption]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'started' && !isPaused) {
      const newValue = e.target.value;
      setUserInput(newValue);

      let correct = 0;
      let error = 0;

      for (let i = 0; i < newValue.length; i++) {
        if (i < targetText.length) {
          if (newValue[i] === targetText[i]) {
            correct++;
          } else {
            error++;
          }
        } else {
          error++;
        }
      }

      setCharStats({ correct, error });

      if (newValue.length > 0) {
        const lastIndex = newValue.length - 1;
        if (audioSettings.enabled) {
          if (lastIndex < targetText.length && newValue[lastIndex] === targetText[lastIndex]) {
            playKeyClick(audioSettings.volume);
          } else {
            playError(audioSettings.volume);
          }
        }
      }
    }
  };

  const renderTargetText = () => {
    if (status === 'idle') {
      return (
        <div 
          className="glass-dark-card cursor-pointer p-6 hover:bg-indigo-900/30 transition-all duration-300 text-xl"
          onClick={() => startTyping()}>
          <span className="text-indigo-200/70">Clique aqui e comece a digitar...</span>
        </div>
      );
    }

    return (
      <div className="glass-dark-card p-6 text-xl shadow-lg">
        {targetText.split('').map((char, index) => {
          let charClass = '';
          
          if (index < userInput.length) {
            charClass = userInput[index] === char 
              ? 'text-green-400 font-medium' 
              : 'text-red-400 bg-red-900/30 font-medium';
          }
          
          return (
            <span key={index} className={cn('transition-all duration-200', charClass)}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '∞';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-sky-400';
      case 'medium': return 'text-indigo-400';
      case 'hard': return 'text-yellow-500';
      case 'expert': return 'text-red-500';
      default: return 'text-sky-400';
    }
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Intermediário';
      case 'hard': return 'Difícil';
      case 'expert': return 'Muito Difícil';
      default: return 'Fácil';
    }
  };

  const progressPercent = timeOption !== 'infinite' && remainingTime !== Infinity
    ? 100 - (remainingTime / (parseInt(timeOption) * 60)) * 100
    : 0;

  return (
    <div className="w-full flex flex-col space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div className="typing-card glass-dark-card shadow-xl shadow-indigo-900/20">
        <div className="mb-6 text-2xl font-semibold bg-gradient-to-r from-indigo-100 to-indigo-400 bg-clip-text text-transparent">
          {phrase.text}
        </div>
        
        {phrase.mapping && (
          <TranslationHighlight
            originalText={phrase.text}
            translatedText={phrase.translation[languagePair.target] || ''}
            mapping={phrase.mapping}
            sourceLang={languagePair.source}
            targetLang={languagePair.target}
          />
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <TextToSpeech
            text={phrase.text}
            language={languagePair.source}
            enabled={audioSettings.enabled}
            volume={audioSettings.volume}
          />
          {phrase.translation[languagePair.target] && (
            <TextToSpeech
              text={phrase.translation[languagePair.target] || ''}
              language={languagePair.target}
              enabled={audioSettings.enabled}
              volume={audioSettings.volume}
            />
          )}
        </div>
      </div>

      {status === 'idle' ? (
        <div className="w-full flex justify-center">
          <Button
            onClick={startTyping}
            className="bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white px-10 py-6 text-lg shadow-lg hover:shadow-indigo-700/30 transform transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <Play className="mr-2 h-5 w-5" /> Iniciar Digitação
          </Button>
        </div>
      ) : (
        <div className="w-full animate-[fadeInUp_0.6s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 glass-dark-card px-4 py-2 rounded-full">
              <Clock className="h-5 w-5 text-indigo-300" />
              <span className="text-xl font-mono text-white">{formatTime(remainingTime)}</span>
            </div>
            <div className="flex items-center space-x-2 glass-dark-card px-4 py-2 rounded-full">
              <Award className={`h-5 w-5 ${getDifficultyColor()}`} />
              <span className={`${getDifficultyColor()}`}>{getDifficultyLabel()}</span>
            </div>
            <div className="glass-dark-card px-4 py-2 rounded-full">
              {audioSettings.enabled ? (
                <Volume2 className="h-5 w-5 text-indigo-300" />
              ) : (
                <VolumeX className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          
          {timeOption !== 'infinite' && (
            <div className="animated-progress mb-6 glow-effect">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600" 
                style={{ width: `${progressPercent}%`, transition: 'width 1s linear' }} />
            </div>
          )}

          <div className="w-full mb-6">
            {renderTargetText()}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={status === 'finished' || isPaused}
            className="w-full p-4 glass-dark-card border-2 border-indigo-700/20 focus:border-indigo-500/50 rounded-xl text-white 
                     focus:outline-none focus:ring-0 shadow-inner placeholder:text-white/50 text-lg"
            placeholder="Digite o texto acima..."
            autoFocus
          />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="stats-card text-center">
              <div className="text-indigo-300 text-sm mb-1">Tempo</div>
              <div className="text-xl font-mono text-white">{formatTime(stats.time)}</div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-indigo-300 text-sm mb-1">PPM</div>
              <div className="text-xl font-mono text-indigo-400">{status === 'finished' ? stats.wpm : (status === 'started' ? '...' : 0)}</div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-indigo-300 text-sm mb-1">Precisão</div>
              <div className="text-xl font-mono text-green-400">
                {status === 'finished' ? `${stats.accuracy}%` : 
                 (status === 'started' && (charStats.correct + charStats.error > 0) ? 
                  `${Math.round((charStats.correct / (charStats.correct + charStats.error)) * 100)}%` : '100%')}
              </div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-indigo-300 text-sm mb-1 flex justify-center items-center gap-1">
                Acertos <Check className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-xl font-mono text-green-400">
                {status === 'finished' ? stats.correctChars : charStats.correct}
              </div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-indigo-300 text-sm mb-1 flex justify-center items-center gap-1">
                Erros <X className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-xl font-mono text-red-400">
                {status === 'finished' ? stats.errors : charStats.error}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            {status === 'started' && (
              <Button
                onClick={pauseResumeTyping}
                className={`${isPaused ? 
                  'bg-gradient-to-r from-amber-600 to-amber-700' : 
                  'bg-gradient-to-r from-amber-700 to-amber-800'} 
                  hover:brightness-110 text-white px-6 py-2 rounded-xl shadow-lg`}
              >
                {isPaused ? (
                  <><Play className="mr-2 h-4 w-4" /> Continuar</>
                ) : (
                  <><Pause className="mr-2 h-4 w-4" /> Pausar</>
                )}
              </Button>
            )}
            
            <Button
              onClick={resetTyping}
              className="bg-gradient-to-r from-indigo-700 to-purple-700 hover:brightness-110 text-white px-6 py-2 rounded-xl shadow-lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> {status === 'finished' ? 'Tentar Novamente' : 'Reiniciar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingArea;
