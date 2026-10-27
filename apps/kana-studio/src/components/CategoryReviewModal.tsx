import React, { useState } from 'react';
import { X, Play, RotateCw, Check, Sparkles, Filter } from 'lucide-react';
import type { ReviewFilterOptions } from '../types/kana';
import { confusablePairs } from '../data/kanaData';

interface CategoryReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (filterOptions: ReviewFilterOptions, direction: 'kana-to-romaji' | 'romaji-to-kana') => void;
}

export const CategoryReviewModal: React.FC<CategoryReviewModalProps> = ({
  isOpen,
  onClose,
  onStartSession
}) => {
  const [script, setScript] = useState<'both' | 'hiragana' | 'katakana'>('both');
  const [category, setCategory] = useState<'all' | 'basic' | 'voiced' | 'semi-voiced' | 'contracted' | 'confusables'>('all');
  const [selectedRow, setSelectedRow] = useState<string>('all');
  const [cramMode, setCramMode] = useState(false);
  const [direction, setDirection] = useState<'kana-to-romaji' | 'romaji-to-kana'>('kana-to-romaji');

  if (!isOpen) return null;

  const basicRows = [
    { id: 'all', label: 'All Rows' },
    { id: 'vowel', label: 'Vowels (A, I, U, E, O)' },
    { id: 'K', label: 'K-Row (Ka, Ki, Ku, Ke, Ko)' },
    { id: 'S', label: 'S-Row (Sa, Shi, Su, Se, So)' },
    { id: 'T', label: 'T-Row (Ta, Chi, Tsu, Te, To)' },
    { id: 'N', label: 'N-Row (Na, Ni, Nu, Ne, No)' },
    { id: 'H', label: 'H-Row (Ha, Hi, Fu, He, Ho)' },
    { id: 'M', label: 'M-Row (Ma, Mi, Mu, Me, Mo)' },
    { id: 'Y', label: 'Y-Row (Ya, Yu, Yo)' },
    { id: 'R', label: 'R-Row (Ra, Ri, Ru, Re, Ro)' },
    { id: 'W', label: 'W-Row (Wa, Wo, N)' }
  ];

  const handleStart = () => {
    const filter: ReviewFilterOptions = {
      script,
      category,
      ...(category === 'basic' && selectedRow !== 'all' ? {row:selectedRow} : {}),
      cramMode
    };
    onStartSession(filter, direction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E4DE] dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#C94B3C]" />
            <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-[#202020] dark:text-[#F0EFEB]">
              Custom Review & Category Drill
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#737373] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#F2F0E8] dark:hover:bg-[#282828] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Script Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-[#737373] font-semibold">
              1. Select Script
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both', label: 'Both Scripts' },
                { id: 'hiragana', label: 'Hiragana (ひらがな)' },
                { id: 'katakana', label: 'Katakana (カタカナ)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setScript(item.id as any)}
                  className={`p-2.5 text-xs rounded border text-center transition-all cursor-pointer font-medium ${
                    script === item.id
                      ? 'bg-[#C94B3C] text-white border-[#C94B3C] font-bold shadow-xs'
                      : 'bg-white dark:bg-[#181818] border-[#DDD] dark:border-[#333] text-[#555] dark:text-[#AAA]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-[#737373] font-semibold">
              2. Target Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'basic', label: 'Basic Gojūon (46)' },
                { id: 'voiced', label: 'Dakuten (20)' },
                { id: 'semi-voiced', label: 'Handakuten (5)' },
                { id: 'contracted', label: 'Yōon / Contracted' },
                { id: 'confusables', label: 'Confusable Pairs (12)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.id as any)}
                  className={`p-2.5 text-xs rounded border text-center transition-all cursor-pointer font-medium ${
                    category === item.id
                      ? 'bg-[#202020] dark:bg-white text-white dark:text-[#151515] font-bold border-transparent shadow-xs'
                      : 'bg-white dark:bg-[#181818] border-[#DDD] dark:border-[#333] text-[#555] dark:text-[#AAA]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row Sub-selection (if Basic selected) */}
          {category === 'basic' && (
            <div className="space-y-2 p-3 bg-[#FAF9F5] dark:bg-[#161616] rounded border border-[#EAE8E1] dark:border-[#282828] animate-fade-in">
              <label className="text-xs font-mono uppercase text-[#737373] font-semibold">
                Filter by Consonant Row
              </label>
              <select
                value={selectedRow}
                onChange={(e) => setSelectedRow(e.target.value)}
                className="w-full p-2 text-xs border border-[#DDD] dark:border-[#333] rounded bg-white dark:bg-[#1E1E1E] text-[#202020] dark:text-white"
              >
                {basicRows.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Direction */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-[#737373] font-semibold">
              3. Review Direction
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection('kana-to-romaji')}
                className={`p-2.5 text-xs rounded border text-center cursor-pointer font-medium ${
                  direction === 'kana-to-romaji'
                    ? 'bg-[#202020] dark:bg-[#333] text-white font-bold'
                    : 'bg-white dark:bg-[#181818] border-[#DDD] dark:border-[#333] text-[#555]'
                }`}
              >
                Kana → Romaji (Recognition)
              </button>
              <button
                onClick={() => setDirection('romaji-to-kana')}
                className={`p-2.5 text-xs rounded border text-center cursor-pointer font-medium ${
                  direction === 'romaji-to-kana'
                    ? 'bg-[#202020] dark:bg-[#333] text-white font-bold'
                    : 'bg-white dark:bg-[#181818] border-[#DDD] dark:border-[#333] text-[#555]'
                }`}
              >
                Romaji → Kana (Production)
              </button>
            </div>
          </div>

          {/* Cram Mode Toggle */}
          <div className="p-3 bg-[#F2F0E8] dark:bg-[#161616] rounded border border-[#E5E4DE] dark:border-[#282828] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#202020] dark:text-[#F0EFEB]">
                Study Ahead / Cram Mode
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#888]">
                Practice all cards in this category now without altering their scientific FSRS scheduled due dates.
              </p>
            </div>
            <button
              onClick={() => setCramMode(!cramMode)}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                cramMode ? 'bg-[#C94B3C]' : 'bg-[#DDD] dark:bg-[#444]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  cramMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F7F6F2] dark:bg-[#161616] border-t border-[#E5E4DE] dark:border-[#262626] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#737373] hover:text-[#202020] dark:hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-5 py-2.5 bg-[#C94B3C] hover:bg-[#B23F31] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Practice Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
