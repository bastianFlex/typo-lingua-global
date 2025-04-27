
import React from 'react';
import { Button } from '@/components/ui/button';
import { VolumeX, Volume2 } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { LanguageCode } from '@/types';

interface TextToSpeechProps {
  text: string;
  language: LanguageCode;
  enabled: boolean;
  volume: number;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  language,
  enabled,
  volume
}) => {
  const conversation = useConversation({
    overrides: {
      tts: {
        voiceId: language === 'fr' ? 'CwhRBWXzGAHq8TQ4Fs17' : 'bIHbv24MWmeRgasZH58o' // Roger for French, Will for English
      },
    },
  });

  const handleSpeak = async () => {
    if (!enabled || !text) return;
    
    try {
      await conversation.setVolume({ volume });
      // Use appropriate voice based on language
      const voiceId = language === 'fr' ? 'CwhRBWXzGAHq8TQ4Fs17' : 'bIHbv24MWmeRgasZH58o';
      await conversation.startSession({
        agentId: voiceId,
        // The API expects firstMessage instead of text
        firstMessage: text
      });
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  return (
    <Button
      onClick={handleSpeak}
      disabled={!enabled}
      className={`glass-card ${enabled ? 'hover:bg-white/10' : 'opacity-50'}`}
      variant="ghost"
    >
      {enabled ? (
        <Volume2 className="h-5 w-5 text-sky-300" />
      ) : (
        <VolumeX className="h-5 w-5 text-gray-400" />
      )}
    </Button>
  );
};

export default TextToSpeech;
