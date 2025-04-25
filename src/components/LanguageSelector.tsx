
import React, { useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageCode, LanguagePair } from '@/types';

const languagePairs: { id: string; label: string; pair: LanguagePair }[] = [
  {
    id: 'pt',
    label: 'Português',
    pair: { source: 'pt', target: 'pt' }
  },
  {
    id: 'en-pt',
    label: 'Inglês → Português',
    pair: { source: 'en', target: 'pt' }
  },
  {
    id: 'fr-pt',
    label: 'Francês → Português',
    pair: { source: 'fr', target: 'pt' }
  }
];

const flags: Record<LanguageCode, string> = {
  pt: 'br',
  en: 'us',
  fr: 'fr'
};

interface LanguageSelectorProps {
  selectedPair: LanguagePair;
  onLanguageChange: (pair: LanguagePair) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedPair, onLanguageChange }) => {
  const getLanguageLabel = (pair: LanguagePair) => {
    const foundPair = languagePairs.find(
      lp => lp.pair.source === pair.source && lp.pair.target === pair.target
    );
    return foundPair?.label || 'Selecionar idioma';
  };

  const currentPairLabel = getLanguageLabel(selectedPair);
  const sourceFlag = flags[selectedPair.source];

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Languages className="h-5 w-5 text-gray-300" />
        <span className="text-gray-300">Idioma</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start bg-app-blue border-gray-600 text-white hover:bg-app-blue/80">
            {sourceFlag && (
              <span className={`fi fi-${sourceFlag} mr-2`}></span>
            )}
            {currentPairLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-app-blue border-gray-600">
          {languagePairs.map((langPair) => (
            <DropdownMenuItem
              key={langPair.id}
              className="text-white hover:bg-white/10 cursor-pointer flex items-center"
              onClick={() => onLanguageChange(langPair.pair)}
            >
              {langPair.id === 'pt' ? (
                <span className="fi fi-br mr-2"></span>
              ) : langPair.id === 'en-pt' ? (
                <span className="fi fi-us mr-2"></span>
              ) : (
                <span className="fi fi-fr mr-2"></span>
              )}
              {langPair.label}
              {selectedPair.source === langPair.pair.source && 
               selectedPair.target === langPair.pair.target && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
