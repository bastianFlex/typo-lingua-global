
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
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-sky-300" />
        <span className="text-white">Tempo</span>
      </div>
      <div className="glass-card p-4">
        <RadioGroup 
          value={selectedTime} 
          onValueChange={(value) => onTimeChange(value as TimeOption)}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
        >
          {["1", "2", "3", "4", "5"].map((time) => (
            <div key={time} className="hover-scale">
              <RadioGroupItem value={time} id={`t${time}`} className="sr-only" />
              <Label 
                htmlFor={`t${time}`} 
                className={`flex justify-center items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-300
                  ${selectedTime === time 
                    ? 'bg-gradient-to-r from-sky-500/60 to-sky-400/60 text-white shadow-lg shadow-sky-500/20'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                {time} min
              </Label>
            </div>
          ))}
          <div className="hover-scale">
            <RadioGroupItem value="infinite" id="infinite" className="sr-only" />
            <Label 
              htmlFor="infinite" 
              className={`flex justify-center items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-300
                ${selectedTime === 'infinite' 
                  ? 'bg-gradient-to-r from-app-purple/60 to-violet-500/60 text-white shadow-lg shadow-app-purple/20'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
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
