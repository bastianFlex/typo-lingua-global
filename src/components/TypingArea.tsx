
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LanguagePair, Phrase, TypingStatus } from '@/types';
import { RotateCcw } from 'lucide-react';

interface TypingAreaProps {
  phrase: Phrase;
  languagePair: LanguagePair;
  onComplete: (wpm: number, accuracy: number, errors: number, duration: number) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ phrase, languagePair, onComplete }) => {
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
  const [remainingTime, setRemainingTime] = useState(60); // 1 minuto
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const targetText = phrase.text;
  const translation = phrase.translation[languagePair.target];

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
    setRemainingTime(60);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          finishTyping();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
    setRemainingTime(60);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'started') {
      setUserInput(e.target.value);
    }
  };

  const renderTargetText = () => {
    if (status === 'idle') {
      return (
        <div 
          className="text-xl p-4 rounded-md cursor-pointer bg-app-blue border border-gray-600"
          onClick={() => startTyping()}
        >
          Clique aqui e comece a digitar...
        </div>
      );
    }

    return (
      <div className="text-xl p-4 rounded-md bg-app-blue border border-gray-600">
        {targetText.split('').map((char, index) => {
          let charClass = '';
          
          if (index < userInput.length) {
            charClass = userInput[index] === char 
              ? 'text-green-500' 
              : 'text-red-500 bg-red-900/30';
          }
          
          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full rounded-lg bg-app-blue border border-gray-700 p-6 text-white">
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
            className="bg-app-purple hover:bg-app-purple/90 text-white px-8 py-6 text-lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Iniciar Digitação
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full mb-4">
            {renderTargetText()}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={status === 'finished'}
            className="w-full p-3 bg-white/10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-app-purple"
            placeholder="Digite o texto acima..."
            autoFocus
          />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div className="bg-app-blue/50 p-4 rounded-md text-center">
              <div className="text-gray-400 text-sm">Tempo</div>
              <div className="text-xl font-mono">{formatTime(remainingTime)}</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center">
              <div className="text-gray-400 text-sm">PPM</div>
              <div className="text-xl font-mono">{status === 'finished' ? stats.wpm : 0}</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center">
              <div className="text-gray-400 text-sm">Precisão %</div>
              <div className="text-xl font-mono text-green-400">{stats.accuracy}%</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center">
              <div className="text-gray-400 text-sm">Acertos ✓</div>
              <div className="text-xl font-mono text-green-400">{stats.correctChars}</div>
            </div>
            
            <div className="bg-app-blue/50 p-4 rounded-md text-center">
              <div className="text-gray-400 text-sm">Erros ✗</div>
              <div className="text-xl font-mono text-red-400">{stats.errors}</div>
            </div>
          </div>

          {status === 'finished' && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={resetTyping}
                className="bg-app-purple hover:bg-app-purple/90 text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TypingArea;
