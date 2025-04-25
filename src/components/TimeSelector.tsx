
import React from 'react';
import { Clock, Infinity } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TimeOption } from '@/types';

interface TimeSelectorProps {
  selectedTime: TimeOption;
  onTimeChange: (time: TimeOption) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  selectedTime, 
  onTimeChange 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-gray-300" />
        <span className="text-gray-300">Tempo</span>
      </div>
      <div className="bg-app-blue/50 rounded-lg p-4 border border-gray-700">
        <RadioGroup 
          value={selectedTime} 
          onValueChange={(value) => onTimeChange(value as TimeOption)}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="t1" className="text-app-light-blue" />
            <Label htmlFor="t1" className="text-white hover:text-app-light-blue transition-colors cursor-pointer">
              1 min
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="t2" className="text-app-light-blue" />
            <Label htmlFor="t2" className="text-white hover:text-app-light-blue transition-colors cursor-pointer">
              2 min
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="t3" className="text-app-light-blue" />
            <Label htmlFor="t3" className="text-white hover:text-app-light-blue transition-colors cursor-pointer">
              3 min
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="t4" className="text-app-light-blue" />
            <Label htmlFor="t4" className="text-white hover:text-app-light-blue transition-colors cursor-pointer">
              4 min
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="t5" className="text-app-light-blue" />
            <Label htmlFor="t5" className="text-white hover:text-app-light-blue transition-colors cursor-pointer">
              5 min
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="infinite" id="infinite" className="text-app-purple" />
            <Label htmlFor="infinite" className="text-white hover:text-app-purple transition-colors cursor-pointer flex items-center">
              <Infinity className="w-4 h-4 mr-1" />
              Infinito
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default TimeSelector;
