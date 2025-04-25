
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Difficulty } from '@/types';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  selectedDifficulty,
  onDifficultyChange 
}) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-5 w-5 text-sky-300" />
        <span className="text-white">Dificuldade</span>
      </div>
      <div className="glass-card p-4">
        <RadioGroup 
          value={selectedDifficulty} 
          onValueChange={(value) => onDifficultyChange(value as Difficulty)}
          className="flex flex-col sm:flex-row justify-between gap-4"
        >
          <div className="flex items-center space-x-3 hover-scale">
            <div className={`w-4 h-4 rounded-full ${selectedDifficulty === 'easy' ? 'bg-sky-400 pulse-effect' : 'bg-white/30'}`} />
            <RadioGroupItem value="easy" id="easy" className="sr-only" />
            <Label htmlFor="easy" className="text-white hover:text-sky-300 transition-colors cursor-pointer">
              Fácil
            </Label>
          </div>
          <div className="flex items-center space-x-3 hover-scale">
            <div className={`w-4 h-4 rounded-full ${selectedDifficulty === 'medium' ? 'bg-app-purple pulse-effect' : 'bg-white/30'}`} />
            <RadioGroupItem value="medium" id="medium" className="sr-only" />
            <Label htmlFor="medium" className="text-white hover:text-app-purple transition-colors cursor-pointer">
              Intermediário
            </Label>
          </div>
          <div className="flex items-center space-x-3 hover-scale">
            <div className={`w-4 h-4 rounded-full ${selectedDifficulty === 'hard' ? 'bg-yellow-500 pulse-effect' : 'bg-white/30'}`} />
            <RadioGroupItem value="hard" id="hard" className="sr-only" />
            <Label htmlFor="hard" className="text-white hover:text-yellow-500 transition-colors cursor-pointer">
              Difícil
            </Label>
          </div>
          <div className="flex items-center space-x-3 hover-scale">
            <div className={`w-4 h-4 rounded-full ${selectedDifficulty === 'expert' ? 'bg-red-500 pulse-effect' : 'bg-white/30'}`} />
            <RadioGroupItem value="expert" id="expert" className="sr-only" />
            <Label htmlFor="expert" className="text-white hover:text-red-500 transition-colors cursor-pointer">
              Muito Difícil
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default DifficultySelector;
