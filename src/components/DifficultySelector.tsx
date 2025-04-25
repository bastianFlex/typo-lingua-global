
import React from 'react';
import { BadgeCheck, Clock, BarChart3 } from 'lucide-react';
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
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-5 w-5 text-gray-300" />
        <span className="text-gray-300">Dificuldade</span>
      </div>
      <div className="bg-app-blue/50 rounded-lg p-4 border border-gray-700">
        <RadioGroup 
          value={selectedDifficulty} 
          onValueChange={(value) => onDifficultyChange(value as Difficulty)}
          className="flex flex-col sm:flex-row justify-between gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="easy" id="easy" className="text-app-light-blue" />
            <Label htmlFor="easy" className="text-white hover:text-app-light-blue transition-colors cursor-pointer">
              Fácil
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" className="text-app-purple" />
            <Label htmlFor="medium" className="text-white hover:text-app-purple transition-colors cursor-pointer">
              Intermediário
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hard" id="hard" className="text-yellow-500" />
            <Label htmlFor="hard" className="text-white hover:text-yellow-500 transition-colors cursor-pointer">
              Difícil
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expert" id="expert" className="text-red-500" />
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
