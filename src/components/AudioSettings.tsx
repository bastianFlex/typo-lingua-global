
import React from 'react';
import { Volume2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AudioFeedback } from '@/types';
import { Button } from './ui/button';

interface AudioSettingsProps {
  audioSettings: AudioFeedback;
  onAudioSettingsChange: (settings: AudioFeedback) => void;
}

const AudioSettings: React.FC<AudioSettingsProps> = ({ audioSettings, onAudioSettingsChange }) => {
  const handleVolumeChange = (value: number[]) => {
    onAudioSettingsChange({ ...audioSettings, volume: value[0] });
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <Volume2 className="h-5 w-5 text-emerald-300" />
        <span className="text-white">Volume do Áudio</span>
      </div>

      <div className="glass-dark-card bg-slate-900/80 p-4 shadow-lg border border-emerald-500/20">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="volume-slider" className="text-emerald-100">Volume</Label>
            <span className="text-white/90 bg-slate-800/80 px-2 py-1 rounded text-sm">
              {Math.round(audioSettings.volume * 100)}%
            </span>
          </div>
          <Slider
            id="volume-slider"
            defaultValue={[audioSettings.volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioSettings;
