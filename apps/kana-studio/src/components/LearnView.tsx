import React, { useState } from 'react';
import { learningStages, type LearningStage } from '../data/kanaData';
import { kanaMap } from '../data/kanaData';
import { Volume2, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import type { KanaItem, StoredCardData } from '../types/kana';
import { createNewCardData } from '../services/srs';
import { saveStoredCard } from '../services/storage';
import { playKanaAudio } from '../services/speech';
import { checkAnswer } from '../utils/romaji';

interface LearnViewProps {
  storedCards: Map<string, StoredCardData>;
  onRefreshData: () => Promise<void>;
  enableAudio: boolean;
  onStartReview: () => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  storedCards,
  onRefreshData,
  enableAudio,
  onStartReview
}) => {
  const [activeScriptFilter, setActiveScriptFilter] = useState<'all' | 'hiragana' | 'katakana'>('all');
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [testedInput, setTestedInput] = useState('');
  const [showRecallTest, setShowRecallTest] = useState(false);
  const [recallSuccess, setRecallSuccess] = useState<boolean | null>(null);

  const filteredStages = learningStages.filter(stage => {
    if (activeScriptFilter === 'all') return true;
    if (activeScriptFilter === 'hiragana') return stage.script === 'hiragana';
    if (activeScriptFilter === 'katakana') return stage.script === 'katakana';
    return true;
  });

  const getStageProgress = (stage: LearningStage) => {
    let introduced = 0;
    for (const id of stage.kanaIds) {
      const card = storedCards.get(id);
      if (card && (!!card.introducedAt || card.totalReviews > 0 || card.card.state !== 0)) {
        introduced++;
      }
    }
    return {
      introduced,
      total: stage.kanaIds.length,
      isComplete: introduced === stage.kanaIds.length
    };
  };

  const startStage = (stage: LearningStage) => {
    setSelectedStage(stage);
    setCardIndex(0);
    setShowRecallTest(false);
    setTestedInput('');
    setRecallSuccess(null);
  };

  const exitStage = async () => {
    setSelectedStage(null);
    await onRefreshData();
  };

  // If inside an active learning lesson
  if (selectedStage) {
    const currentKanaId = selectedStage.kanaIds[cardIndex];
    const currentKana: KanaItem | undefined = kanaMap.get(currentKanaId);

    if (!currentKana) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p>Kana character not found.</p>
          <button onClick={exitStage} className="mt-4 px-4 py-2 bg-black text-white rounded">Back</button>
        </div>
      );
    }

    const isLastCard = cardIndex === selectedStage.kanaIds.length - 1;

    const handlePlayAudio = () => {
      if (enableAudio) {
        playKanaAudio(currentKana.kana);
      }
    };

    const handleRecallSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const res = checkAnswer(currentKana.id, testedInput);
      if (res.isCorrect) {
        setRecallSuccess(true);
      } else {
        setRecallSuccess(false);
      }
    };

    const handleAdvance = async () => {
      // Mark as introduced in SRS storage
      if (!storedCards.has(currentKana.id)) {
        const newCard = createNewCardData(currentKana.id);
        await saveStoredCard(newCard);
        await onRefreshData();
      }

      if (isLastCard) {
        exitStage();
      } else {
        setCardIndex(prev => prev + 1);
        setShowRecallTest(false);
        setTestedInput('');
        setRecallSuccess(null);
      }
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6 animate-fade-in">
        {/* Top lesson control */}
        <div className="flex items-center justify-between border-b border-[#E5E4DE] dark:border-[#262626] pb-4">
          <button
            onClick={exitStage}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#737373] hover:text-[#202020] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Stages</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-sans font-medium text-[#737373] dark:text-[#888]">
              {selectedStage.title.split('.')[1] || selectedStage.title}
            </span>
            <div className="text-xs font-bold text-[#202020] dark:text-[#F0EFEB]">
              Character {cardIndex + 1} of {selectedStage.kanaIds.length}
            </div>
          </div>


          <div className="text-xs font-mono text-[#737373]">
            {Math.round(((cardIndex + 1) / selectedStage.kanaIds.length) * 100)}%
          </div>
        </div>

        {/* Big Kana Card Presentation */}
        <div className="p-8 sm:p-12 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-sm text-center space-y-6">
          {/* Large Kana Character */}
          <div className="relative inline-block mx-auto">
            <span className="text-8xl sm:text-9xl font-kana font-normal tracking-wide text-[#202020] dark:text-[#F0EFEB] select-all">
              {currentKana.kana}
            </span>
            {enableAudio && (
              <button
                onClick={handlePlayAudio}
                className="absolute -right-8 top-2 p-2 text-[#737373] hover:text-[#C94B3C] dark:hover:text-[#E06A5B] transition-colors cursor-pointer"
                title="Play pronunciation"
                aria-label="Play pronunciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Canonical Romaji */}
          <div className="space-y-1">
            <div className="text-3xl font-bold tracking-tight text-[#C94B3C] dark:text-[#E06A5B] font-mono">
              {currentKana.romaji}
            </div>
            {currentKana.aliases && currentKana.aliases.length > 0 && (
              <div className="text-xs text-[#737373] dark:text-[#888] font-mono">
                Also accepted: {currentKana.aliases.join(', ')}
              </div>
            )}
          </div>

          {/* Construction Breakdown (e.g. ぴ + ゅ → ぴゅ) */}
          {currentKana.construction && (
            <div className="p-3 bg-[#F7F6F2] dark:bg-[#151515] rounded border border-[#E5E4DE] dark:border-[#262626] max-w-md mx-auto text-sm">
              <span className="font-mono text-xs text-[#737373] uppercase tracking-wider block mb-1">
                Construction Formula
              </span>
              <div className="font-medium text-base text-[#202020] dark:text-[#F0EFEB]">
                {currentKana.construction.explanation}
              </div>
            </div>
          )}

          {/* Linguistic note */}
          {currentKana.explanation && (
            <p className="text-xs sm:text-sm text-[#666] dark:text-[#AAA] max-w-md mx-auto leading-relaxed">
              {currentKana.explanation}
            </p>
          )}

          {/* Active Recall Practice Step */}
          {!showRecallTest ? (
            <div className="pt-4">
              <button
                onClick={() => setShowRecallTest(true)}
                className="px-6 py-2.5 bg-[#202020] dark:bg-[#2F2F2F] hover:bg-[#333] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Test Active Recall →
              </button>
            </div>
          ) : (
            <form onSubmit={handleRecallSubmit} className="pt-4 max-w-xs mx-auto space-y-3">
              <label className="block text-xs font-mono uppercase text-[#737373]">
                Type the Romaji reading
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={testedInput}
                  onChange={(e) => {
                    setTestedInput(e.target.value);
                    setRecallSuccess(null);
                  }}
                  placeholder="e.g. ka, kya..."
                  className="w-full px-3 py-2 text-center text-sm font-mono border border-[#DDD] dark:border-[#333] rounded bg-white dark:bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#C94B3C]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C94B3C] text-white text-xs font-bold rounded cursor-pointer"
                >
                  Verify
                </button>
              </div>

              {recallSuccess === true && (
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>Correct! Added to review queue.</span>
                </div>
              )}
              {recallSuccess === false && (
                <div className="text-xs text-[#C94B3C] dark:text-[#E06A5B]">
                  Incorrect reading. Canonical is <span className="font-mono font-bold">{currentKana.romaji}</span>.
                </div>
              )}
            </form>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-[#E5E4DE] dark:border-[#262626] flex items-center justify-between">
            <button
              onClick={() => {
                if (cardIndex > 0) {
                  setCardIndex(prev => prev - 1);
                  setShowRecallTest(false);
                  setTestedInput('');
                  setRecallSuccess(null);
                }
              }}
              disabled={cardIndex === 0}
              className={`text-xs font-semibold px-4 py-2 rounded flex items-center gap-1 ${
                cardIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#EAE8E1] dark:hover:bg-[#282828] cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleAdvance}
              className="px-5 py-2.5 bg-[#C94B3C] hover:bg-[#B23F31] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>{isLastCard ? 'Complete Stage' : 'Next Character'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stage list overview
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E5E4DE] dark:border-[#262626] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#202020] dark:text-[#F0EFEB]">
            Guided Learning Stages
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#888] mt-1">
            Systematic progression introducing vowels, consonants, voiced dakuten, and yōon contractions.
          </p>
        </div>

        {/* Script Filter Tabs */}
        <div className="inline-flex rounded-md border border-[#E5E4DE] dark:border-[#333] p-1 bg-white dark:bg-[#1E1E1E]">
          <button
            onClick={() => setActiveScriptFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeScriptFilter === 'all'
                ? 'bg-[#C94B3C] text-white font-bold'
                : 'text-[#666] dark:text-[#AAA] hover:text-[#202020]'
            }`}
          >
            All Stages
          </button>
          <button
            onClick={() => setActiveScriptFilter('hiragana')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeScriptFilter === 'hiragana'
                ? 'bg-[#C94B3C] text-white font-bold'
                : 'text-[#666] dark:text-[#AAA] hover:text-[#202020]'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setActiveScriptFilter('katakana')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeScriptFilter === 'katakana'
                ? 'bg-[#C94B3C] text-white font-bold'
                : 'text-[#666] dark:text-[#AAA] hover:text-[#202020]'
            }`}
          >
            Katakana
          </button>
        </div>
      </div>

      {/* Stage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredStages.map((stage) => {
          const { introduced, total, isComplete } = getStageProgress(stage);
          const pct = Math.round((introduced / total) * 100);

          return (
            <div
              key={stage.id}
              className="p-5 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] flex flex-col justify-between hover:border-[#C94B3C]/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#888]">
                    {stage.script}
                  </span>
                  {isComplete ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Completed
                    </span>
                  ) : introduced > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      In Progress ({pct}%)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#888]">
                      Ready
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#202020] dark:text-[#F0EFEB]">
                  {stage.title}
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#999] line-clamp-2">
                  {stage.description}
                </p>

                {/* Character preview row */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {stage.kanaIds.map((id) => {
                    const k = kanaMap.get(id);
                    if (!k) return null;
                    const isLearned = storedCards.has(id);
                    return (
                      <span
                        key={id}
                        className={`inline-block px-1.5 py-0.5 text-xs font-kana rounded border ${
                          isLearned
                            ? 'bg-[#EAE8E1] dark:bg-[#282828] border-[#DDD] dark:border-[#383838] text-[#202020] dark:text-[#F0EFEB]'
                            : 'bg-transparent border-[#EEE] dark:border-[#222] text-[#888] dark:text-[#666]'
                        }`}
                      >
                        {k.kana}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#F0EFEB] dark:border-[#262626] flex items-center justify-between">
                <span className="text-xs font-mono text-[#737373]">
                  {introduced} / {total} introduced
                </span>

                <button
                  onClick={() => startStage(stage)}
                  className="px-4 py-1.5 bg-[#202020] dark:bg-[#2C2C2C] hover:bg-[#C94B3C] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                >
                  {isComplete ? 'Review Stage' : introduced > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
