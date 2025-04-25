
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
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {audioSettings.enabled ? (
          <Volume2 className="h-5 w-5 text-gray-300" />
        ) : (
          <VolumeX className="h-5 w-5 text-gray-300" />
        )}
        <span className="text-gray-300">Áudio</span>
      </div>

      <div className="bg-app-blue/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="audio-toggle" className="text-white">Som de digitação</Label>
          <Switch 
            id="audio-toggle" 
            checked={audioSettings.enabled}
            onCheckedChange={(enabled) => onAudioSettingsChange({ ...audioSettings, enabled })}
            className="data-[state=checked]:bg-app-purple"
          />
        </div>
        
        {audioSettings.enabled && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="volume-slider" className="text-white">Volume</Label>
              <span className="text-gray-300">{Math.round(audioSettings.volume * 100)}%</span>
            </div>
            <Slider
              id="volume-slider"
              defaultValue={[audioSettings.volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="py-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioSettings;
