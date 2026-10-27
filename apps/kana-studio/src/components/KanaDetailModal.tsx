import React, { useState, useEffect } from 'react';
import type { KanaItem, StoredCardData } from '../types/kana';
import { Volume2, X, Check, Eye } from 'lucide-react';
import { playKanaAudio, isJapaneseSpeechSupported } from '../services/speech';
import { checkAnswer } from '../utils/romaji';
import { confusablePairs } from '../data/kanaData';
import { generateKanaDistractors } from '../utils/distractors';

interface KanaDetailModalProps {
  kana: KanaItem | null;
  storedData?: StoredCardData | undefined;
  onClose: () => void;
  enableAudio: boolean;
  onSelectKana: (kanaId: string) => void;
  onRefreshData?: (() => Promise<void>) | undefined;
}

export const KanaDetailModal: React.FC<KanaDetailModalProps> = ({
  kana,
  storedData,
  onClose,
  enableAudio,
  onSelectKana,
  onRefreshData
}) => {
  const [practiceMode, setPracticeMode] = useState<'type' | 'choice'>('type');
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceResult, setPracticeResult] = useState<boolean | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [hasJaAudio, setHasJaAudio] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setHasJaAudio(isJapaneseSpeechSupported());
  }, []);

  // Reset practice state on kana change
  useEffect(() => {
    setPracticeInput('');
    setPracticeResult(null);
    setSelectedChoiceId(null);
    setShowResetConfirm(false);
  }, [kana]);

  if (!kana) return null;

  const handlePlayAudio = () => {
    if (enableAudio) {
      playKanaAudio(kana.kana);
    }
  };

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkAnswer(kana.id, practiceInput);
    setPracticeResult(res.isCorrect);
  };

  const distractors = generateKanaDistractors(kana);

  const handleChoiceClick = (chosen: KanaItem) => {
    setSelectedChoiceId(chosen.id);
    setPracticeResult(chosen.id === kana.id);
  };

  const handleToggleSuspend = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const { toggleCardSuspension } = await import('../services/srs');
      await toggleCardSuspension(kana.id);
      await onRefreshData?.();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const { resetCardProgress } = await import('../services/srs');
      await resetCardProgress(kana.id);
      setShowResetConfirm(false);
      await onRefreshData?.();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not reset this card.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Find confusable pairs for this kana
  const relatedConfusables = confusablePairs.filter(
    p => p.char1 === kana.kana || p.char2 === kana.kana
  );

  const isSuspended = storedData?.isSuspended;

  const getStatusBadge = () => {
    if (isSuspended) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300">
          Suspended
        </span>
      );
    }
    if (!storedData || (storedData.totalReviews === 0 && storedData.card.state === 0)) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          Not Introduced Yet
        </span>
      );
    }
    const state = storedData.card.state;
    if (state === 1 || state === 3) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          Learning (Reps: {storedData.card.reps})
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        In Review (Stability: {storedData.card.stability.toFixed(1)}d)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E4DE] dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#737373] dark:text-[#888]">
              {kana.script} · {kana.category}
            </span>
            {getStatusBadge()}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#F2F0E8] dark:hover:bg-[#282828] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Visual Display */}
          <div className="text-center relative py-6 bg-[#F7F6F2] dark:bg-[#161616] rounded border border-[#E5E4DE] dark:border-[#282828]">
            <span className="text-8xl sm:text-9xl font-kana font-normal text-[#202020] dark:text-[#F0EFEB] block select-none">
              {kana.kana}
            </span>

            {enableAudio && (
              <button
                onClick={handlePlayAudio}
                className="absolute top-3 right-3 p-2 text-[#737373] hover:text-[#C94B3C] rounded-full hover:bg-white dark:hover:bg-[#222] transition-colors cursor-pointer shadow-xs"
                title="Play pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}

            <div className="mt-2 text-3xl font-bold font-mono text-[#C94B3C] dark:text-[#E06A5B]">
              {kana.romaji}
            </div>
            {kana.aliases && kana.aliases.length > 0 && (
              <div className="text-xs text-[#737373] font-mono mt-0.5">
                Aliases: {kana.aliases.join(', ')}
              </div>
            )}
          </div>

          {/* FSRS Memory Stats & Management Section */}
          {storedData && (storedData.totalReviews > 0 || storedData.introducedAt) && (
            <div className="p-3.5 bg-[#FAF9F5] dark:bg-[#171717] rounded border border-[#E5E4DE] dark:border-[#282828] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#737373] font-bold">
                  FSRS Spaced Repetition Card Profile
                </span>
                <span className="text-[11px] font-mono text-[#C94B3C]">
                  {storedData.totalReviews} Total Reviews
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-white dark:bg-[#202020] rounded border border-[#E5E4DE] dark:border-[#333]">
                  <div className="text-[10px] font-mono text-[#888]">Memory Stability</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {storedData.card.stability.toFixed(1)} days
                  </div>
                </div>
                <div className="p-2 bg-white dark:bg-[#202020] rounded border border-[#E5E4DE] dark:border-[#333]">
                  <div className="text-[10px] font-mono text-[#888]">Difficulty (D)</div>
                  <div className="font-bold text-[#202020] dark:text-[#F0EFEB]">
                    {storedData.card.difficulty.toFixed(1)} / 10
                  </div>
                </div>
                <div className="p-2 bg-white dark:bg-[#202020] rounded border border-[#E5E4DE] dark:border-[#333]">
                  <div className="text-[10px] font-mono text-[#888]">Lapses (Forgot)</div>
                  <div className="font-bold text-rose-600 dark:text-rose-400">
                    {storedData.totalLapses}
                  </div>
                </div>
              </div>

              {/* Card Management Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#EAE8E1] dark:border-[#282828] text-xs">
                <button
                  onClick={handleToggleSuspend}
                  disabled={isUpdating}
                  className="px-2.5 py-1 text-[11px] rounded border border-[#DDD] dark:border-[#333] hover:bg-white dark:hover:bg-[#252525] text-[#666] dark:text-[#BBB] cursor-pointer"
                >
                  {isSuspended ? 'Resume Card' : 'Suspend from Reviews'}
                </button>

                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="text-[11px] text-[#888] hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                  >
                    Reset Card Progress
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-rose-600 font-medium">Reset all intervals?</span>
                    <button
                      onClick={handleReset}
                      disabled={isUpdating}
                      className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="text-[10px] text-[#737373] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Construction Formula */}
          {kana.construction && (
            <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded border border-[#E5E4DE] dark:border-[#2E2E2E] text-xs">
              <span className="font-mono text-[10px] text-[#737373] uppercase tracking-wider block mb-1">
                Construction Formula
              </span>
              <div className="font-medium text-sm text-[#202020] dark:text-[#F0EFEB]">
                {kana.construction.explanation}
              </div>
            </div>
          )}

          {/* Linguistic note */}
          {kana.explanation && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#737373]">
                Phonetic & Usage Note
              </span>
              <p className="text-xs text-[#555] dark:text-[#BBB] leading-relaxed">
                {kana.explanation}
              </p>
            </div>
          )}

          {/* Confusables contrast section if available */}
          {relatedConfusables.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E5E4DE] dark:border-[#262626]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-[#C94B3C]">
                <Eye className="w-3.5 h-3.5" />
                <span>Visual Contrast & Distinctions</span>
              </div>
              {relatedConfusables.map((pair) => (
                <div
                  key={pair.id}
                  className="p-3 bg-[#FAF9F5] dark:bg-[#161616] rounded border border-[#E5E4DE] dark:border-[#282828] space-y-1.5"
                >
                  <div className="flex items-center justify-between font-kana text-lg font-medium text-[#202020] dark:text-[#F0EFEB]">
                    <span>{pair.char1} ({pair.romaji1}) vs {pair.char2} ({pair.romaji2})</span>
                    <span className="text-xs font-mono font-normal text-[#C94B3C]">
                      {pair.distinction}
                    </span>
                  </div>
                  <p className="text-xs text-[#666] dark:text-[#999] leading-normal">
                    {pair.tip}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Practice Character Safely (Does not alter SRS) */}
          <div className="pt-2 border-t border-[#E5E4DE] dark:border-[#262626] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#737373] font-bold">
                Isolated Practice (No SRS impact)
              </span>
              <div className="inline-flex rounded border border-[#E5E4DE] dark:border-[#333] p-0.5 text-[10px]">
                <button
                  onClick={() => { setPracticeMode('type'); setPracticeResult(null); }}
                  className={`px-2 py-0.5 rounded ${practiceMode === 'type' ? 'bg-[#202020] text-white font-bold dark:bg-white dark:text-black' : 'text-[#666]'}`}
                >
                  Type Romaji
                </button>
                <button
                  onClick={() => { setPracticeMode('choice'); setPracticeResult(null); }}
                  className={`px-2 py-0.5 rounded ${practiceMode === 'choice' ? 'bg-[#202020] text-white font-bold dark:bg-white dark:text-black' : 'text-[#666]'}`}
                >
                  Pick Glyph
                </button>
              </div>
            </div>

            {practiceMode === 'type' ? (
              <form onSubmit={handlePracticeSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={practiceInput}
                  onChange={(e) => {
                    setPracticeInput(e.target.value);
                    setPracticeResult(null);
                  }}
                  placeholder="Type reading to test..."
                  className="flex-1 px-3 py-2 text-xs font-mono border border-[#DDD] dark:border-[#333] rounded bg-white dark:bg-[#181818] focus:outline-none focus:ring-1 focus:ring-[#C94B3C]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#202020] dark:bg-[#333] hover:bg-black text-white text-xs font-bold rounded cursor-pointer"
                >
                  Check
                </button>
              </form>
            ) : (
              <div className="space-y-2">
                <div className="text-[11px] text-[#737373] font-mono">
                  Which kana represents <span className="font-bold text-[#C94B3C]">{kana.romaji}</span>?
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {distractors.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleChoiceClick(opt)}
                      className={`p-3 rounded border text-xl font-kana text-center transition-all cursor-pointer ${
                        selectedChoiceId === opt.id
                          ? opt.id === kana.id
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-[#FAFAF8] dark:bg-[#181818] border-[#DDD] dark:border-[#333] hover:border-[#999]'
                      }`}
                    >
                      {opt.kana}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {practiceResult === true && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Correct!</span>
              </div>
            )}
            {practiceResult === false && (
              <div className="text-xs text-[#C94B3C] font-semibold">
                Incorrect. Correct reading is {kana.romaji} ({kana.kana}).
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
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

