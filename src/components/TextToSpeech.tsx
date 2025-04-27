
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { VolumeX, Volume2 } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { LanguageCode } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const voiceId = language === 'fr' ? 'CwhRBWXzGAHq8TQ4Fs17' : 'bIHbv24MWmeRgasZH58o'; // Roger for French, Will for English
  
  const conversation = useConversation({
    overrides: {
      tts: {
        voiceId
      },
      agent: {
        firstMessage: text
      }
    },
  });

  const handleSpeak = useCallback(async () => {
    if (!enabled || !text) return;
    
    try {
      await conversation.setVolume({ volume });
      // Start the session with the agent
      await conversation.startSession({
        agentId: voiceId
      });
      
      toast({
        title: "Reproduzindo áudio",
        description: "O texto está sendo narrado",
        variant: "default",
      });
    } catch (error) {
      console.error('TTS error:', error);
      toast({
        title: "Erro de áudio",
        description: "Não foi possível reproduzir o áudio",
        variant: "destructive",
      });
    }
  }, [text, enabled, volume, conversation, voiceId, toast]);

  return (
    <Button
      onClick={handleSpeak}
      disabled={!enabled}
      className={`glass-dark-card ${enabled ? 'hover:bg-indigo-900/30' : 'opacity-50'} transition-all duration-300 transform hover:scale-105`}
      variant="ghost"
      size="icon"
    >
      {enabled ? (
        <Volume2 className="h-5 w-5 text-indigo-300" />
      ) : (
        <VolumeX className="h-5 w-5 text-gray-400" />
      )}
    </Button>
  );
};

export default TextToSpeech;
