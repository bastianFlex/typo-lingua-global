
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LanguagePair, Phrase, TypingStatus, Difficulty, TimeOption, AudioFeedback } from '@/types';
import { RotateCcw, Play, Pause, Clock, Award, Volume2, VolumeX } from 'lucide-react';
import { playKeyClick, playError, playSuccess } from '@/services/audioService';
import { Progress } from '@/components/ui/progress';
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
    const words = targetText.trim().split(/\s+/).length;
    const wpm = Math.round((words / timeInSeconds) * 60);

    let correct = 0;
    let errors = 0;

    // Compara caractere por caractere
    for (let i = 0; i < userInput.length; i++) {
      if (i >= targetText.length || userInput[i] !== targetText[i]) {
        errors++;
      } else {
        correct++;
      }
    }

    // Considera não-digitados como erros
    if (userInput.length < targetText.length) {
      errors += (targetText.length - userInput.length);
    }

    const totalChars = Math.max(targetText.length, userInput.length);
    const accuracy = Math.max(0, Math.round((correct / totalChars) * 100));

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
      toast({
        title: "Ótimo trabalho!",
        description: "Você completou a digitação com sucesso.",
      });
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

      // Check if the last character is correct or not for audio feedback
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
        <div className="text-xl p-4 rounded-md cursor-pointer 
                        bg-gradient-to-r from-app-blue to-app-blue/80 
                        hover:from-app-blue/90 hover:to-app-blue/70 
                        border border-gray-600 shadow-lg transition-all 
                        hover:shadow-app-purple/20 hover:scale-[1.02]"
             onClick={() => startTyping()}>
          Clique aqui e comece a digitar...
        </div>
      );
    }

    return (
      <div className="text-xl p-4 rounded-md 
                      bg-gradient-to-r from-app-blue to-app-blue/80 
                      border border-gray-600 shadow-lg">
        {targetText.split('').map((char, index) => {
          let charClass = '';
          
          if (index < userInput.length) {
            charClass = userInput[index] === char 
              ? 'text-green-500' 
              : 'text-red-500 bg-red-900/30';
          }
          
          return (
            <span key={index} className={cn('transition-colors', charClass)}>
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
      case 'easy': return 'text-app-light-blue';
      case 'medium': return 'text-app-purple';
      case 'hard': return 'text-yellow-500';
      case 'expert': return 'text-red-500';
      default: return 'text-app-light-blue';
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
    <div className="w-full flex flex-col space-y-4 animate-fade-in">
      <div className="w-full rounded-lg bg-gradient-to-br from-app-blue to-app-blue/90 border border-gray-700 p-6 text-white shadow-lg">
        <div className="mb-4 text-2xl font-semibold">
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
            className="bg-app-purple hover:bg-app-purple/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-app-purple/30 transform transition-all hover:scale-105"
          >
            <Play className="mr-2 h-5 w-5" /> Iniciar Digitação
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-300" />
              <span className="text-xl font-mono">{formatTime(remainingTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className={`h-5 w-5 ${getDifficultyColor()}`} />
              <span className={`${getDifficultyColor()}`}>{getDifficultyLabel()}</span>
            </div>
            {audioSettings.enabled ? (
              <Volume2 className="h-5 w-5 text-gray-300" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-300" />
            )}
          </div>
          
          {timeOption !== 'infinite' && (
            <Progress 
              value={progressPercent} 
              className="h-2 mb-4 bg-gray-700" 
            />
          )}

          <div className="w-full mb-4">
            {renderTargetText()}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={status === 'finished' || isPaused}
            className="w-full p-3 bg-white/10 border border-gray-600 rounded-md text-white 
                     focus:outline-none focus:ring-2 focus:ring-app-purple shadow-inner"
            placeholder="Digite o texto acima..."
            autoFocus
          />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div className="bg-app-blue/50 p-4 rounded-md text-center shadow-md border border-gray-800/50 hover:border-gray-700 transition-colors">
              <div className="text-gray-400 text-sm">Tempo</div>
              <div className="text-xl font-mono">{formatTime(stats.time)}</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center shadow-md border border-gray-800/50 hover:border-gray-700 transition-colors">
              <div className="text-gray-400 text-sm">PPM</div>
              <div className="text-xl font-mono">{status === 'finished' ? stats.wpm : 0}</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center shadow-md border border-gray-800/50 hover:border-gray-700 transition-colors">
              <div className="text-gray-400 text-sm">Precisão %</div>
              <div className="text-xl font-mono text-green-400">{stats.accuracy}%</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center shadow-md border border-gray-800/50 hover:border-gray-700 transition-colors">
              <div className="text-gray-400 text-sm">Acertos ✓</div>
              <div className="text-xl font-mono text-green-400">{stats.correctChars}</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center shadow-md border border-gray-800/50 hover:border-gray-700 transition-colors">
              <div className="text-gray-400 text-sm">Erros ✗</div>
              <div className="text-xl font-mono text-red-400">{stats.errors}</div>
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            {status === 'started' && (
              <Button
                onClick={pauseResumeTyping}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
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
              className="bg-app-purple hover:bg-app-purple/90 text-white"
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
