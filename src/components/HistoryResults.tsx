
import React from 'react';
import { TypingResult } from '@/types';

interface HistoryResultsProps {
  results: TypingResult[];
}

const HistoryResults: React.FC<HistoryResultsProps> = ({ results }) => {
  const getLanguageName = (code: string) => {
    switch (code) {
      case 'pt': return 'Português';
      case 'en': return 'Inglês';
      case 'fr': return 'Francês';
      default: return code;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-app-light-blue text-5xl mb-4">
          🏆
        </div>
        <p className="text-gray-300 text-lg">
          Ainda não há resultados. Complete uma sessão de digitação para ver seu histórico.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-white">
        <thead>
          <tr className="bg-app-blue/50 border-b border-gray-700">
            <th className="px-4 py-3 text-left">Data</th>
            <th className="px-4 py-3 text-left">Idioma</th>
            <th className="px-4 py-3 text-right">PPM</th>
            <th className="px-4 py-3 text-right">Precisão</th>
            <th className="px-4 py-3 text-right">Erros</th>
            <th className="px-4 py-3 text-right">Duração</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="border-b border-gray-800 hover:bg-app-blue/30">
              <td className="px-4 py-3">{formatDate(result.date)}</td>
              <td className="px-4 py-3">{getLanguageName(result.language)}</td>
              <td className="px-4 py-3 text-right font-mono">{result.wpm}</td>
              <td className="px-4 py-3 text-right font-mono text-green-400">{result.accuracy}%</td>
              <td className="px-4 py-3 text-right font-mono text-red-400">{result.errors}</td>
              <td className="px-4 py-3 text-right font-mono">{result.duration.toFixed(1)}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryResults;
