
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AudioFeedback } from '@/types';

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
        {audioSettings.enabled ? (
          <Volume2 className="h-5 w-5 text-emerald-300" />
        ) : (
          <VolumeX className="h-5 w-5 text-gray-400" />
        )}
        <span className="text-white">Áudio</span>
      </div>

      <div className="glass-dark-card bg-slate-900/80 p-4 shadow-lg border border-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="audio-toggle" className="text-emerald-100">Som de digitação</Label>
          <Switch 
            id="audio-toggle" 
            checked={audioSettings.enabled}
            onCheckedChange={(enabled) => onAudioSettingsChange({ ...audioSettings, enabled })}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-600 data-[state=checked]:to-blue-600"
          />
        </div>
        
        {audioSettings.enabled && (
          <div className="space-y-3 animate-[fadeInUp_0.3s_ease-out]">
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
        )}
      </div>
    </div>
  );
};

export default AudioSettings;
