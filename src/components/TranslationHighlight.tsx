
import React from 'react';
import { LanguageCode } from '@/types';
import { Volume2 } from 'lucide-react';
import TextToSpeech from './TextToSpeech';

interface TranslationHighlightProps {
  originalText: string;
  translatedText: string;
  mapping: Array<{ original: string; translated: string }>;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
}

const TranslationHighlight: React.FC<TranslationHighlightProps> = ({
  originalText,
  translatedText,
  mapping,
  sourceLang,
  targetLang,
}) => {
  return (
    <div className="glass-dark-card p-6 space-y-4 shadow-xl shadow-indigo-900/20">
      <h3 className="text-xl font-bold text-indigo-200 mb-4 tracking-wide">
        Tradução com Destaques
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Text with Highlights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-indigo-300 mb-1 font-medium">
              {sourceLang === 'pt' ? 'Português' : sourceLang === 'en' ? 'English' : 'Français'}:
            </div>
            <TextToSpeech 
              text={originalText}
              language={sourceLang}
              enabled={true}
              volume={0.5}
            />
          </div>
          <div className="text-white text-lg leading-relaxed">
            {mapping.map((item, index) => (
              <span
                key={index}
                className="inline-block px-1.5 py-1 m-0.5 rounded bg-opacity-20 hover:bg-opacity-40 transition-all duration-300 cursor-help shadow-inner"
                style={{ backgroundColor: `hsl(${(index * 37) % 360}, 70%, 40%, 0.25)` }}
                title={item.translated}
              >
                {item.original}
              </span>
            ))}
          </div>
        </div>

        {/* Translated Text with Highlights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-indigo-300 mb-1 font-medium">
              {targetLang === 'pt' ? 'Português' : targetLang === 'en' ? 'English' : 'Français'}:
            </div>
            <TextToSpeech 
              text={translatedText}
              language={targetLang}
              enabled={true}
              volume={0.5}
            />
          </div>
          <div className="text-white text-lg leading-relaxed">
            {mapping.map((item, index) => (
              <span
                key={index}
                className="inline-block px-1.5 py-1 m-0.5 rounded bg-opacity-20 hover:bg-opacity-40 transition-all duration-300 cursor-help shadow-inner"
                style={{ backgroundColor: `hsl(${(index * 37) % 360}, 70%, 40%, 0.25)` }}
                title={item.original}
              >
                {item.translated}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationHighlight;
