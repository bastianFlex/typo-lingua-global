
import React from 'react';
import { LanguageCode } from '@/types';

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
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-2">
        Tradução com Destaques
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Text with Highlights */}
        <div className="space-y-2">
          <div className="text-sm text-gray-400 mb-1">
            {sourceLang === 'pt' ? 'Português' : sourceLang === 'en' ? 'English' : 'Français'}:
          </div>
          <div className="text-white">
            {mapping.map((item, index) => (
              <span
                key={index}
                className="inline-block px-1 py-0.5 m-0.5 rounded bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-help"
                style={{ backgroundColor: `hsl(${(index * 37) % 360}, 70%, 50%, 0.2)` }}
                title={item.translated}
              >
                {item.original}
              </span>
            ))}
          </div>
        </div>

        {/* Translated Text with Highlights */}
        <div className="space-y-2">
          <div className="text-sm text-gray-400 mb-1">
            {targetLang === 'pt' ? 'Português' : targetLang === 'en' ? 'English' : 'Français'}:
          </div>
          <div className="text-white">
            {mapping.map((item, index) => (
              <span
                key={index}
                className="inline-block px-1 py-0.5 m-0.5 rounded bg-opacity-20 hover:bg-opacity-30 transition-colors cursor-help"
                style={{ backgroundColor: `hsl(${(index * 37) % 360}, 70%, 50%, 0.2)` }}
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
