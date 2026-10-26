import React, { useState } from 'react';
import { confusablePairs } from '../data/kanaData';
import { X, Volume2 } from 'lucide-react';
import { playKanaAudio } from '../services/speech';

interface ConfusablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  enableAudio: boolean;
}

export const ConfusablesModal: React.FC<ConfusablesModalProps> = ({
  isOpen,
  onClose,
  enableAudio
}) => {
  const [filter, setFilter] = useState<'all' | 'katakana' | 'hiragana' | 'contrast'>('all');

  if (!isOpen) return null;

  const filtered = confusablePairs.filter(p => {
    if (filter === 'all') return true;
    return p.script === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E4DE] dark:border-[#262626]">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#202020] dark:text-[#F0EFEB]">
              Confusable Character Visual Guide
            </h2>
            <p className="text-xs text-[#737373] dark:text-[#888]">
              Critical visual stroke differences & morae contrasts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#F2F0E8] dark:hover:bg-[#282828] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2 border-b border-[#E5E4DE] dark:border-[#262626] bg-[#FBFBFA] dark:bg-[#181818] flex gap-2">
          {(
            [
              { id: 'all', label: 'All Pairs' },
              { id: 'katakana', label: 'Katakana' },
              { id: 'hiragana', label: 'Hiragana' },
              { id: 'contrast', label: 'Small Kana vs Normal' }
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-[#C94B3C] text-white font-bold'
                  : 'text-[#666] dark:text-[#AAA] hover:text-[#202020]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pairs List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {filtered.map(pair => (
            <div
              key={pair.id}
              className="p-4 bg-[#F7F6F2] dark:bg-[#161616] rounded-md border border-[#E5E4DE] dark:border-[#2A2A2A] space-y-3"
            >
              {/* Characters Side-by-Side */}
              <div className="flex items-center justify-around py-3 bg-white dark:bg-[#1E1E1E] rounded border border-[#E5E4DE] dark:border-[#282828]">
                {/* Char 1 */}
                <div className="text-center space-y-1">
                  <div className="text-5xl font-kana text-[#202020] dark:text-[#F0EFEB]">
                    {pair.char1}
                  </div>
                  <div className="text-sm font-mono font-bold text-[#C94B3C]">
                    {pair.romaji1}
                  </div>
                  {enableAudio && (
                    <button
                      onClick={() => playKanaAudio(pair.char1)}
                      className="text-[#888] hover:text-[#C94B3C] p-1 cursor-pointer"
                      title="Pronounce"
                    >
                      <Volume2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  )}
                </div>

                <div className="text-xs font-mono font-bold text-[#AAA] uppercase">
                  VS
                </div>

                {/* Char 2 */}
                <div className="text-center space-y-1">
                  <div className="text-5xl font-kana text-[#202020] dark:text-[#F0EFEB]">
                    {pair.char2}
                  </div>
                  <div className="text-sm font-mono font-bold text-[#C94B3C]">
                    {pair.romaji2}
                  </div>
                  {enableAudio && (
                    <button
                      onClick={() => playKanaAudio(pair.char2)}
                      className="text-[#888] hover:text-[#C94B3C] p-1 cursor-pointer"
                      title="Pronounce"
                    >
                      <Volume2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  )}
                </div>
              </div>

              {/* Distinction & Stroke Tip */}
              <div className="space-y-1">
                <div className="text-xs font-mono font-semibold text-[#202020] dark:text-[#F0EFEB]">
                  Key Difference: <span className="text-[#C94B3C]">{pair.distinction}</span>
                </div>
                <p className="text-xs text-[#666] dark:text-[#AAA] leading-relaxed">
                  {pair.tip}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F7F6F2] dark:bg-[#161616] border-t border-[#E5E4DE] dark:border-[#262626] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#202020] dark:bg-[#333] hover:bg-black text-white text-xs font-semibold rounded cursor-pointer"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
