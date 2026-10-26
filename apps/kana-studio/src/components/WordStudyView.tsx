import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { KanaWord, StoredCardData, KanaScript } from '../types/kana';
import { vocabularyList, filterWordsByLearnedKana } from '../data/vocabulary';
import { kanaMap } from '../data/kanaData';
import { playKanaAudio } from '../services/speech';
import { Volume2, ArrowLeft, ArrowRight, RotateCw, Check, X, Sparkles, Filter, BookOpen } from 'lucide-react';

interface WordStudyViewProps {
  storedCards: Map<string, StoredCardData>;
  enableAudio: boolean;
  onOpenKanaDetail?: (kanaId: string) => void;
}

export const WordStudyView: React.FC<WordStudyViewProps> = ({
  storedCards,
  enableAudio,
  onOpenKanaDetail
}) => {
  const [selectedScript, setSelectedScript] = useState<'all' | 'hiragana' | 'katakana'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyLearnedKana, setOnlyLearnedKana] = useState(false);
  const [studyMode, setStudyMode] = useState<'flashcard' | 'type'>('flashcard');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const [typeResult, setTypeResult] = useState<{ submitted: boolean; isCorrect: boolean } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Set of introduced kana IDs from stored cards
  const learnedKanaIds = useMemo(() => {
    const set = new Set<string>();
    for (const [id, data] of storedCards.entries()) {
      if (id.endsWith(':rev')) continue;
      if (data.totalReviews > 0 || (data.card && data.card.state !== 0) || !!data.introducedAt) {
        set.add(id);
      }
    }
    return set;
  }, [storedCards]);

  // Filter words
  const filteredWords = useMemo(() => {
    let list = vocabularyList;

    if (onlyLearnedKana) {
      list = filterWordsByLearnedKana(list, learnedKanaIds);
    }

    if (selectedScript !== 'all') {
      list = list.filter(w => w.script === selectedScript);
    }

    if (selectedCategory !== 'all') {
      list = list.filter(w => w.category === selectedCategory);
    }

    return list;
  }, [onlyLearnedKana, selectedScript, selectedCategory, learnedKanaIds]);

  const currentWord: KanaWord | undefined = filteredWords[currentIndex];

  // Reset card state on word change
  useEffect(() => {
    setIsFlipped(false);
    setTypedInput('');
    setTypeResult(null);
    if (studyMode === 'type' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, studyMode, filteredWords]);

  const playAudio = useCallback((text: string) => {
    if (enableAudio) {
      playKanaAudio(text);
    }
  }, [enableAudio]);

  const handleNext = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % filteredWords.length);
  };

  const handlePrev = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || !typedInput.trim()) return;

    const cleanUser = typedInput.trim().toLowerCase().replace(/[-_\s]/g, '');
    const cleanCanonical = currentWord.romaji.toLowerCase().replace(/[-_\sōū]/g, (match) => {
      if (match === 'ō') return 'o';
      if (match === 'ū') return 'u';
      return '';
    });

    // Check against canonical and common variations (e.g. koohii vs kohi)
    const isMatch = cleanUser === cleanCanonical ||
                    cleanUser === currentWord.romaji.toLowerCase() ||
                    cleanUser === currentWord.kana;

    setTypeResult({
      submitted: true,
      isCorrect: isMatch
    });
    setIsFlipped(true);
    playAudio(currentWord.kana);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if ((e.key === 'r' || e.key === 'R') && currentWord && !isInput) {
        e.preventDefault();
        playAudio(currentWord.kana);
        return;
      }

      if (e.key === 'ArrowRight' && !isInput) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isInput) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' && !isInput && studyMode === 'flashcard') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
        if (!isFlipped && currentWord) {
          playAudio(currentWord.kana);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, isFlipped, studyMode, playAudio]);

  const categories = [
    { id: 'all', label: 'All Themes' },
    { id: 'greetings', label: 'Greetings' },
    { id: 'daily', label: 'Daily Life' },
    { id: 'nature', label: 'Nature' },
    { id: 'animals', label: 'Animals' },
    { id: 'food', label: 'Food & Drink' },
    { id: 'loanwords', label: 'Loanwords (Katakana)' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E5E4DE] dark:border-[#262626] pb-4 gap-2">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#202020] dark:text-[#F0EFEB]">
            Vocabulary Study · 単語
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#737373] dark:text-[#9E9E9E]">
            Reinforce kana recognition in authentic Japanese words. Contextual recall cements long-term memory.
          </p>
        </div>
        <div className="text-xs font-mono text-[#737373]">
          {filteredWords.length} Words Available
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="p-4 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Script Segmented Control */}
          <div className="inline-flex rounded border border-[#E5E4DE] dark:border-[#333] p-0.5 bg-[#F7F6F2] dark:bg-[#151515]">
            <button
              onClick={() => { setSelectedScript('all'); setCurrentIndex(0); }}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                selectedScript === 'all'
                  ? 'bg-white dark:bg-[#282828] text-[#202020] dark:text-white font-bold shadow-xs'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              All Scripts
            </button>
            <button
              onClick={() => { setSelectedScript('hiragana'); setCurrentIndex(0); }}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                selectedScript === 'hiragana'
                  ? 'bg-white dark:bg-[#282828] text-[#C94B3C] font-bold shadow-xs'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              Hiragana Only
            </button>
            <button
              onClick={() => { setSelectedScript('katakana'); setCurrentIndex(0); }}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                selectedScript === 'katakana'
                  ? 'bg-white dark:bg-[#282828] text-[#C94B3C] font-bold shadow-xs'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              Katakana Only
            </button>
          </div>

          {/* Learned Kana Filter Toggle */}
          <button
            onClick={() => { setOnlyLearnedKana(prev => !prev); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 cursor-pointer font-medium ${
              onlyLearnedKana
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'border-[#DDD] dark:border-[#333] text-[#666] dark:text-[#AAA] hover:bg-[#F7F6F2] dark:hover:bg-[#252525]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Only Words with My Learned Kana</span>
            {onlyLearnedKana && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Mode Switcher */}
          <div className="inline-flex rounded border border-[#E5E4DE] dark:border-[#333] p-0.5 bg-[#F7F6F2] dark:bg-[#151515]">
            <button
              onClick={() => setStudyMode('flashcard')}
              className={`px-2.5 py-1 font-medium rounded transition-colors ${
                studyMode === 'flashcard'
                  ? 'bg-white dark:bg-[#282828] text-[#202020] dark:text-white font-bold shadow-xs'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              Flashcard
            </button>
            <button
              onClick={() => setStudyMode('type')}
              className={`px-2.5 py-1 font-medium rounded transition-colors ${
                studyMode === 'type'
                  ? 'bg-white dark:bg-[#282828] text-[#202020] dark:text-white font-bold shadow-xs'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              Type Reading
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#EAE8E1] dark:border-[#282828]">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#202020] dark:bg-white text-white dark:text-[#151515] font-semibold'
                  : 'bg-[#F2F0E8] dark:bg-[#151515] text-[#555] dark:text-[#999] hover:bg-[#EAE8E1] dark:hover:bg-[#252525]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Display */}
      {filteredWords.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] space-y-4">
          <BookOpen className="w-10 h-10 text-[#737373] mx-auto" />
          <h3 className="text-lg font-bold text-[#202020] dark:text-[#F0EFEB]">
            No words match the selected filters
          </h3>
          <p className="text-xs text-[#737373] dark:text-[#9E9E9E] max-w-sm mx-auto">
            {onlyLearnedKana
              ? 'You have not learned enough kana characters yet to form words in this category. Continue lessons in the Learn tab or uncheck "Only Words with My Learned Kana".'
              : 'Try selecting a different theme or script.'}
          </p>
          <button
            onClick={() => { setOnlyLearnedKana(false); setSelectedCategory('all'); setSelectedScript('all'); }}
            className="px-4 py-2 bg-[#C94B3C] text-white text-xs font-semibold rounded cursor-pointer"
          >
            Show All Words
          </button>
        </div>
      ) : currentWord ? (
        <div className="space-y-4">
          <div className="p-8 sm:p-12 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-sm text-center relative flex flex-col items-center justify-center min-h-[360px]">
            {/* Word Category & Script Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#737373]">
              <span className="font-semibold text-[#C94B3C]">{currentWord.script}</span>
              <span>·</span>
              <span>{currentWord.category}</span>
            </div>

            {/* Audio Button */}
            {enableAudio && (
              <button
                onClick={() => playAudio(currentWord.kana)}
                title="Play pronunciation (R)"
                className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#C94B3C] rounded-full hover:bg-[#F7F6F2] dark:hover:bg-[#252525] transition-colors cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}

            {/* Big Japanese Word Characters */}
            <div className="my-6 space-y-2">
              <div className="text-6xl sm:text-7xl font-kana font-medium tracking-wide text-[#202020] dark:text-[#F0EFEB] select-none">
                {currentWord.kana}
              </div>

              {currentWord.kanji && (
                <div className="text-sm font-kana text-[#888] dark:text-[#777]">
                  Kanji: {currentWord.kanji}
                </div>
              )}
            </div>

            {/* Interactive Kana Breakdown: Click individual kana to inspect */}
            <div className="space-y-1.5 my-2">
              <div className="text-[10px] font-mono uppercase text-[#737373] tracking-wider">
                Component Kana Breakdown (Click to inspect)
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {currentWord.kanaIds.map((kId) => {
                  const item = kanaMap.get(kId);
                  if (!item) return null;
                  const isLearned = learnedKanaIds.has(kId);
                  return (
                    <button
                      key={kId}
                      onClick={() => onOpenKanaDetail?.(kId)}
                      title={`Inspect ${item.kana} (${item.romaji})`}
                      className={`px-3 py-1 rounded border text-center transition-all cursor-pointer flex items-center gap-1.5 ${
                        isLearned
                          ? 'bg-[#FAF9F5] dark:bg-[#171717] border-[#DDD] dark:border-[#333] hover:border-[#C94B3C]'
                          : 'bg-neutral-100/60 dark:bg-neutral-900/40 border-dashed border-[#DDD] dark:border-[#333] text-[#737373]'
                      }`}
                    >
                      <span className="font-kana text-lg font-medium text-[#202020] dark:text-[#F0EFEB]">
                        {item.kana}
                      </span>
                      <span className="text-[11px] font-mono text-[#C94B3C] dark:text-[#E06A5B]">
                        {item.romaji}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode-Specific Interaction */}
            {studyMode === 'type' ? (
              <div className="w-full max-w-sm mt-4 space-y-3">
                {!typeResult?.submitted ? (
                  <form onSubmit={handleTypeSubmit} className="space-y-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      placeholder="Type romaji reading..."
                      autoComplete="off"
                      autoCorrect="off"
                      className="w-full px-4 py-2.5 text-center text-lg font-mono border border-[#DDD] dark:border-[#333] rounded bg-white dark:bg-[#161616] text-[#202020] dark:text-[#FFF] focus:outline-none focus:ring-2 focus:ring-[#C94B3C]"
                    />
                    <div className="text-[11px] text-[#888] font-mono">
                      Press Enter to check reading
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        typeResult.isCorrect
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {typeResult.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{typeResult.isCorrect ? 'Correct!' : `Incorrect (Reading: ${currentWord.romaji})`}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xl font-bold font-mono text-[#C94B3C]">
                        {currentWord.romaji}
                      </div>
                      <div className="text-base font-semibold text-[#202020] dark:text-[#F0EFEB]">
                        {currentWord.meaning}
                      </div>
                      {currentWord.notes && (
                        <p className="text-xs text-[#737373] dark:text-[#888]">
                          {currentWord.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Flashcard Flip Mode */
              <div className="w-full max-w-sm mt-4 space-y-3">
                {!isFlipped ? (
                  <button
                    onClick={() => {
                      setIsFlipped(true);
                      playAudio(currentWord.kana);
                    }}
                    className="w-full py-2.5 px-4 bg-[#F2F0E8] dark:bg-[#252525] hover:bg-[#EAE8E1] text-xs font-semibold rounded text-[#555] dark:text-[#CCC] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Click or Press Space to Reveal Meaning</span>
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="space-y-2 animate-fade-in">
                    <div className="text-2xl font-bold font-mono text-[#C94B3C]">
                      {currentWord.romaji}
                    </div>
                    <div className="text-lg font-bold text-[#202020] dark:text-[#F0EFEB]">
                      {currentWord.meaning}
                    </div>
                    {currentWord.notes && (
                      <p className="text-xs text-[#737373] dark:text-[#888]">
                        {currentWord.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between text-xs text-[#737373]">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded border border-[#DDD] dark:border-[#333] hover:bg-[#F2F0E8] dark:hover:bg-[#252525] flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous (←)</span>
            </button>

            <span className="font-mono">
              Word {currentIndex + 1} of {filteredWords.length}
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded border border-[#DDD] dark:border-[#333] hover:bg-[#F2F0E8] dark:hover:bg-[#252525] flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Next (→)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
