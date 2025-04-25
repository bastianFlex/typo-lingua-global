
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LanguagePair, Phrase, TypingStatus, Difficulty, TimeOption, AudioFeedback } from '@/types';
import { RotateCcw, Play, Pause, Clock, Award, Volume2, VolumeX, Check, X, ExternalLink } from 'lucide-react';
import { playKeyClick, playError, playSuccess } from '@/services/audioService';
import { cn } from '@/lib/utils';

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
    
    // Accurately count words - either by spaces or standardized word length
    const words = targetText.trim().split(/\s+/).length;
    const wpm = Math.round((words / timeInSeconds) * 60);

    let correct = 0;
    let errors = 0;

    // Compare character by character
    for (let i = 0; i < Math.max(userInput.length, targetText.length); i++) {
      if (i >= targetText.length) {
        // Extra typed characters
        errors++;
      } else if (i >= userInput.length) {
        // Missing characters
        errors++;
      } else if (userInput[i] !== targetText[i]) {
        // Wrong characters
        errors++;
      } else {
        // Correct characters
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
      // Resuming
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
      // Pausing
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
    // Check for completion
    if (status === 'started' && userInput === targetText) {
      finishTyping();
    }
  }, [userInput, targetText, status, toast]);

  // Reset when difficulty or time changes
  useEffect(() => {
    resetTyping();
  }, [difficulty, timeOption]);

  // Cleanup on unmount
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

      // Update character stats in real time
      let correct = 0;
      let error = 0;

      // Check each character typed
      for (let i = 0; i < newValue.length; i++) {
        if (i < targetText.length) {
          if (newValue[i] === targetText[i]) {
            correct++;
          } else {
            error++;
          }
        } else {
          // Extra characters typed beyond the target text
          error++;
        }
      }

      setCharStats({ correct, error });

      // Play sound feedback for the last character typed
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
          className="glass-card cursor-pointer p-6 hover:bg-white/15 transition-all duration-300 text-xl"
          onClick={() => startTyping()}>
          <span className="text-white/70">Clique aqui e comece a digitar...</span>
        </div>
      );
    }

    return (
      <div className="glass-card p-6 text-xl">
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
      case 'medium': return 'text-app-purple';
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

  // Progress calculation (only for finite time)
  const progressPercent = timeOption !== 'infinite' && remainingTime !== Infinity
    ? 100 - (remainingTime / (parseInt(timeOption) * 60)) * 100
    : 0;

  return (
    <div className="w-full flex flex-col space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div className="typing-card glass-card">
        <div className="mb-6 text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {phrase.text}
        </div>
        {translation && (
          <div className="text-gray-400 italic text-sm">
            {translation}
          </div>
        )}
      </div>

      {status === 'idle' ? (
        <div className="w-full flex justify-center">
          <Button
            onClick={startTyping}
            className="bg-gradient-to-r from-app-purple to-app-purple/80 hover:bg-app-purple/90 text-white px-10 py-6 text-lg shadow-lg hover:shadow-app-purple/30 transform transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <Play className="mr-2 h-5 w-5" /> Iniciar Digitação
          </Button>
        </div>
      ) : (
        <div className="w-full animate-[fadeInUp_0.6s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <Clock className="h-5 w-5 text-sky-300" />
              <span className="text-xl font-mono text-white">{formatTime(remainingTime)}</span>
            </div>
            <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <Award className={`h-5 w-5 ${getDifficultyColor()}`} />
              <span className={`${getDifficultyColor()}`}>{getDifficultyLabel()}</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-full">
              {audioSettings.enabled ? (
                <Volume2 className="h-5 w-5 text-sky-300" />
              ) : (
                <VolumeX className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          
          {timeOption !== 'infinite' && (
            <div className="animated-progress mb-6">
              <div className="h-full bg-gradient-to-r from-app-light-blue to-app-purple" 
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
            className="w-full p-4 glass-card border-2 border-white/20 focus:border-app-purple/50 rounded-xl text-white 
                     focus:outline-none focus:ring-0 shadow-inner placeholder:text-white/50 text-lg"
            placeholder="Digite o texto acima..."
            autoFocus
          />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="stats-card text-center">
              <div className="text-gray-400 text-sm mb-1">Tempo</div>
              <div className="text-xl font-mono text-white">{formatTime(stats.time)}</div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-gray-400 text-sm mb-1">PPM</div>
              <div className="text-xl font-mono text-sky-400">{status === 'finished' ? stats.wpm : (status === 'started' ? '...' : 0)}</div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-gray-400 text-sm mb-1">Precisão</div>
              <div className="text-xl font-mono text-green-400">
                {status === 'finished' ? `${stats.accuracy}%` : 
                 (status === 'started' && (charStats.correct + charStats.error > 0) ? 
                  `${Math.round((charStats.correct / (charStats.correct + charStats.error)) * 100)}%` : '100%')}
              </div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-gray-400 text-sm mb-1 flex justify-center items-center gap-1">
                Acertos <Check className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-xl font-mono text-green-400">
                {status === 'finished' ? stats.correctChars : charStats.correct}
              </div>
            </div>
            
            <div className="stats-card text-center">
              <div className="text-gray-400 text-sm mb-1 flex justify-center items-center gap-1">
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
                  'bg-gradient-to-r from-amber-500 to-amber-600' : 
                  'bg-gradient-to-r from-amber-600 to-amber-700'} 
                  hover:brightness-110 text-white px-6 py-2 rounded-xl`}
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
              className="bg-gradient-to-r from-app-purple to-violet-600 hover:brightness-110 text-white px-6 py-2 rounded-xl"
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
