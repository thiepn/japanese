import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rating, State, type Grade } from 'ts-fsrs';
import type { UserSettings, SessionStats, KanaItem, ReviewFilterOptions } from '../types/kana';
import { buildReviewQueue, gradeCard, getSchedulingPreviews, type ScheduledQueueItem } from '../services/srs';
import { checkAnswer } from '../utils/romaji';
import { playKanaAudio, isJapaneseSpeechSupported } from '../services/speech';
import { generateKanaDistractors } from '../utils/distractors';
import { confusablePairs } from '../data/kanaData';
import { ArrowLeft, Check, X, Volume2, RotateCcw, ArrowRight, Eye, Sparkles, Filter } from 'lucide-react';

interface ReviewViewProps {
  settings: UserSettings;
  onExit: () => void;
  onRefreshData: () => Promise<void>;
  enableAudio: boolean;
  initialDirection?: 'kana-to-romaji' | 'romaji-to-kana';
  drillKanaIds?: string[];
  filterOptions?: ReviewFilterOptions;
  onOpenCategoryModal?: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  settings,
  onExit,
  onRefreshData,
  enableAudio,
  initialDirection = 'kana-to-romaji',
  drillKanaIds,
  filterOptions,
  onOpenCategoryModal
}) => {
  const [direction, setDirection] = useState<'kana-to-romaji' | 'romaji-to-kana'>(initialDirection);
  const [queue, setQueue] = useState<ScheduledQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [queueError,setQueueError]=useState<string|null>(null);
  const [gradeError,setGradeError]=useState<string|null>(null);
  const [missedIds,setMissedIds]=useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Card reveal state
  const [isRevealed, setIsRevealed] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    canonical: string;
    userClean: string;
  } | null>(null);

  const [isGrading, setIsGrading] = useState(false);
  const [stats, setStats] = useState<SessionStats>({
    cardsReviewed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    scheduledLater: 0,
    startTime: Date.now()
  });

  const [sessionComplete, setSessionComplete] = useState(false);
  const [hasJaAudio, setHasJaAudio] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Check speech synthesis availability
  useEffect(() => {
    setHasJaAudio(isJapaneseSpeechSupported());
  }, []);

  // Load review queue
  const loadQueue = useCallback(async (dir: 'kana-to-romaji' | 'romaji-to-kana', customDrill?: string[], fOpts?: ReviewFilterOptions) => {
    setLoading(true);
    setQueueError(null);
    setGradeError(null);
    setMissedIds([]);
    setStats({cardsReviewed:0,correctAnswers:0,incorrectAnswers:0,scheduledLater:0,startTime:Date.now()});
    setCurrentIndex(0);
    setIsRevealed(false);
    setTypedInput('');
    setSelectedChoiceId(null);
    setAnswerResult(null);
    setSessionComplete(false);

    try {
      const items = await buildReviewQueue(settings, true, dir, customDrill, fOpts);
      setQueue(items);
    } catch(error) {
      setQueue([]);
      setQueueError(error instanceof Error?error.message:'Could not load Kana cards.');
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    loadQueue(direction, drillKanaIds, filterOptions);
  }, [direction, drillKanaIds, filterOptions, loadQueue]);

  const currentItem: ScheduledQueueItem | undefined = queue[currentIndex];


  // Auto-focus input on card change
  useEffect(() => {
    if (!isRevealed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isRevealed, direction]);

  // Audio pronunciation
  const playSound = useCallback((text: string) => {
    if (enableAudio) {
      playKanaAudio(text);
    }
  }, [enableAudio]);

  // Pre-generate 4 plausible choices for Romaji -> Kana mode
  const [distractorSet, setDistractorSet] = useState<{ options: KanaItem[]; targetIndex: number } | null>(null);

  useEffect(() => {
    if (currentItem && direction === 'romaji-to-kana') {
      setDistractorSet(generateKanaDistractors(currentItem.kana));
    } else {
      setDistractorSet(null);
    }
  }, [currentItem, direction]);

  // Handle Kana -> Romaji typed submit
  const handleSubmitAnswer = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentItem || isRevealed) return;

    if (!typedInput.trim()) {
      // Space or Enter without typing: Reveal card for honest self-recall
      setIsRevealed(true);
      setAnswerResult({
        submitted: false,
        isCorrect: false,
        canonical: currentItem.kana.romaji,
        userClean: ''
      });
      playSound(currentItem.kana.kana);
      return;
    }

    const check = checkAnswer(currentItem.kana.id, typedInput);
    setAnswerResult({
      submitted: true,
      isCorrect: check.isCorrect,
      canonical: check.canonical,
      userClean: check.userClean
    });
    setIsRevealed(true);
    playSound(currentItem.kana.kana);

    setStats(prev => ({
      ...prev,
      correctAnswers: check.isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: !check.isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers
    }));
  }, [currentItem, isRevealed, typedInput, playSound]);

  // Handle Romaji -> Kana choice selection
  const handleSelectChoice = useCallback((chosenItem: KanaItem) => {
    if (!currentItem || isRevealed) return;
    const isCorrect = chosenItem.id === currentItem.kana.id;
    setSelectedChoiceId(chosenItem.id);
    setAnswerResult({
      submitted: true,
      isCorrect,
      canonical: currentItem.kana.kana,
      userClean: chosenItem.kana
    });
    setIsRevealed(true);
    playSound(currentItem.kana.kana);

    setStats(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: !isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers
    }));
  }, [currentItem, isRevealed, playSound]);

  // Apply FSRS rating
  const handleGrade = useCallback(async (rating: Grade) => {
    if (!currentItem || isGrading) return;
    setIsGrading(true);

    try {
      setGradeError(null);
      await gradeCard(currentItem.storedData, rating, new Date(), currentItem.isCram);
      if((answerResult?.submitted&&!answerResult.isCorrect)||rating===Rating.Again){
        setMissedIds(prev=>prev.includes(currentItem.kana.id)?prev:[...prev,currentItem.kana.id]);
      }
      setStats(prev => ({
        ...prev,
        cardsReviewed: prev.cardsReviewed + 1,
        scheduledLater: prev.scheduledLater + (currentItem.isCram?0:1)
      }));

      // Advance to next card or complete session
      if (currentIndex + 1 >= queue.length) {
        setSessionComplete(true);
        await onRefreshData();
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsRevealed(false);
        setTypedInput('');
        setSelectedChoiceId(null);
        setAnswerResult(null);
      }
    } catch (err) {
      setGradeError(err instanceof Error?err.message:'Review could not be saved.');
    } finally {
      setIsGrading(false);
    }
  }, [currentItem, currentIndex, queue.length, isGrading, onRefreshData, answerResult]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }

      // Replay audio with 'r' key
      if ((e.key === 'r' || e.key === 'R') && currentItem && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
        if (!isInput) {
          e.preventDefault();
          playSound(currentItem.kana.kana);
          return;
        }
      }

      // Before reveal
      if (!isRevealed) {
        if (direction === 'romaji-to-kana' && distractorSet) {
          // Keys 1, 2, 3, 4 select choices
          if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            if (distractorSet.options[idx]) {
              e.preventDefault();
              handleSelectChoice(distractorSet.options[idx]);
              return;
            }
          }
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmitAnswer();
        } else if (e.key === ' ' && (!typedInput || typedInput.trim() === '')) {
          e.preventDefault();
          handleSubmitAnswer();
        }
        return;
      }

      // After reveal: rating hotkeys (1, 2, 3, 4)
      if (isRevealed && !isGrading) {
        const isWrong = answerResult?.submitted && !answerResult.isCorrect;

        if (e.key === '1') {
          e.preventDefault();
          handleGrade(Rating.Again as Grade);
        } else if (e.key === '2' && !isWrong) {
          e.preventDefault();
          handleGrade(Rating.Hard as Grade);
        } else if (e.key === '3' && !isWrong) {
          e.preventDefault();
          handleGrade(Rating.Good as Grade);
        } else if (e.key === '4' && !isWrong) {
          e.preventDefault();
          handleGrade(Rating.Easy as Grade);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (isWrong) {
            handleGrade(Rating.Again as Grade);
          } else {
            handleGrade(Rating.Good as Grade);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRevealed,
    isGrading,
    typedInput,
    answerResult,
    direction,
    distractorSet,
    currentItem,
    handleSubmitAnswer,
    handleSelectChoice,
    handleGrade,
    onExit,
    playSound
  ]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-sm font-mono text-[#737373]">Preparing spaced repetition queue...</p>
      </div>
    );
  }

  if (queueError) {
    return <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <p role="alert" className="text-sm text-rose-700 dark:text-rose-400">{queueError}</p>
      <button type="button" onClick={()=>void loadQueue(direction,drillKanaIds,filterOptions)}
        className="px-5 py-2.5 bg-[#C94B3C] text-white text-sm font-semibold rounded">Retry</button>
    </div>;
  }

  // Empty queue state
  if (!currentItem || queue.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-serif text-[#202020] dark:text-[#F0EFEB]">
            No Cards Due for Review
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#888]">
            Your spaced repetition deck is clear right now. You can start a custom drill session below or return to the dashboard.
          </p>
        </div>

        {/* Custom drill options */}
        <div className="p-4 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] space-y-3 text-left">
          <div className="text-xs font-mono uppercase text-[#737373] font-bold">
            Start Immediate Practice Drill
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const sampleH = ['h-a', 'h-i', 'h-u', 'h-e', 'h-o', 'h-ka', 'h-ki', 'h-ku', 'h-ke', 'h-ko'];
                loadQueue('kana-to-romaji', sampleH, {cramMode:true});
              }}
              className="p-2.5 rounded border border-[#DDD] dark:border-[#333] hover:border-[#C94B3C] text-xs font-medium text-center cursor-pointer transition-colors"
            >
              Drill Hiragana (10)
            </button>
            <button
              onClick={() => {
                const sampleK = ['k-a', 'k-i', 'k-u', 'k-e', 'k-o', 'k-shi', 'k-tsu', 'k-so', 'k-n', 'k-ku'];
                loadQueue('kana-to-romaji', sampleK, {cramMode:true});
              }}
              className="p-2.5 rounded border border-[#DDD] dark:border-[#333] hover:border-[#C94B3C] text-xs font-medium text-center cursor-pointer transition-colors"
            >
              Drill Katakana (10)
            </button>
            <button
              onClick={() => {
                const confusableIds = ['k-shi', 'k-tsu', 'k-so', 'k-n', 'h-nu', 'h-me', 'h-re', 'h-ne', 'h-ru', 'h-ro', 'k-ku', 'k-ke'];
                loadQueue('kana-to-romaji', confusableIds, {cramMode:true});
              }}
              className="p-2.5 rounded border border-[#DDD] dark:border-[#333] hover:border-[#C94B3C] text-xs font-medium text-center cursor-pointer transition-colors"
            >
              Drill Confusables (12)
            </button>
            <button
              onClick={async () => {
                const { getAllStoredCards } = await import('../services/storage');
                const stored = await getAllStoredCards();
                const ids = Array.from(stored.keys()).filter(id => !id.endsWith(':rev'));
                if (ids.length > 0) {
                  loadQueue('kana-to-romaji', ids, {cramMode:true});
                } else {
                  // Fallback sample
                  loadQueue('kana-to-romaji', ['h-a', 'h-i', 'h-u', 'h-e', 'h-o'], {cramMode:true});
                }
              }}
              className="p-2.5 rounded border border-[#DDD] dark:border-[#333] hover:border-[#C94B3C] text-xs font-medium text-center cursor-pointer transition-colors"
            >
              Drill All Introduced
            </button>
          </div>

          {onOpenCategoryModal && (
            <button
              onClick={onOpenCategoryModal}
              className="w-full py-2 px-3 border border-dashed border-[#C94B3C]/50 hover:border-[#C94B3C] hover:bg-[#C94B3C]/5 text-xs font-semibold text-[#C94B3C] dark:text-[#E06A5B] rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Configure Custom Category / Row Drill</span>
            </button>
          )}
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onExit}
            className="px-5 py-2.5 bg-[#202020] dark:bg-[#333] hover:bg-black text-white text-xs font-semibold rounded cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Session Summary Screen
  if (sessionComplete) {
    const accuracy = stats.cardsReviewed > 0
      ? Math.round((stats.correctAnswers / Math.max(1, stats.correctAnswers + stats.incorrectAnswers)) * 100)
      : 100;

    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-[#C94B3C] font-semibold tracking-wider">
            Session Complete
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#202020] dark:text-[#F0EFEB]">
            Review Summary
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 p-5 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E]">
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase">Reviewed</div>
            <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
              {stats.cardsReviewed}
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase">Accuracy</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {accuracy}%
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase">Rescheduled</div>
            <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
              {stats.scheduledLater}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {missedIds.length>0 && (
            <button type="button"
              onClick={()=>void loadQueue(direction,missedIds,{cramMode:true})}
              className="px-6 py-2.5 border border-[#C94B3C] text-[#C94B3C] dark:text-[#E06A5B] text-xs font-semibold rounded">
              Retry {missedIds.length} missed (practice only)
            </button>
          )}
          <button
            onClick={onExit}
            className="px-6 py-2.5 bg-[#C94B3C] hover:bg-[#B23F31] text-white text-xs font-bold rounded shadow-xs cursor-pointer"
          >
            Finish & Return Home
          </button>
        </div>
      </div>
    );
  }

  const isWrongAnswer = answerResult?.submitted && !answerResult.isCorrect;
  const previews = getSchedulingPreviews(currentItem.storedData.card);

  // Check if current kana has confusable pairs
  const activeConfusables = confusablePairs.filter(
    p => p.char1 === currentItem.kana.kana || p.char2 === currentItem.kana.kana
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fade-in" ref={cardContainerRef}>
      {/* Top Session Status Bar */}
      <div className="flex items-center justify-between border-b border-[#E5E4DE] dark:border-[#262626] pb-3 text-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-[#737373] hover:text-[#202020] dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit (Esc)</span>
        </button>

        {/* Direction Switcher */}
        <div className="inline-flex rounded border border-[#E5E4DE] dark:border-[#333] p-0.5 bg-white dark:bg-[#1E1E1E]">
          <button
            onClick={() => setDirection('kana-to-romaji')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              direction === 'kana-to-romaji'
                ? 'bg-[#C94B3C] text-white font-bold'
                : 'text-[#666] dark:text-[#AAA]'
            }`}
          >
            Kana → Romaji
          </button>
          <button
            onClick={() => setDirection('romaji-to-kana')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              direction === 'romaji-to-kana'
                ? 'bg-[#C94B3C] text-white font-bold'
                : 'text-[#666] dark:text-[#AAA]'
            }`}
          >
            Romaji → Kana
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentItem.isCram && (
            <span className="font-mono uppercase text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
              Cram
            </span>
          )}
          <span className="font-mono uppercase px-2 py-0.5 rounded bg-[#EAE8E1] dark:bg-[#2A2A2A] text-[#555] dark:text-[#AAA]">
            {currentItem.kana.script}
          </span>
          <span className="text-[#888]">·</span>
          <span className="font-mono text-[#737373]">
            {currentIndex + 1} / {queue.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EAE8E1] dark:bg-[#2A2A2A] h-1 rounded-full overflow-hidden">
        <div
          className="bg-[#C94B3C] h-full transition-all duration-200"
          style={{ width: `${Math.round(((currentIndex + 1) / queue.length) * 100)}%` }}
        />
      </div>

      {/* Large Flashcard */}
      <div className="p-8 sm:p-14 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-sm text-center relative flex flex-col items-center justify-center min-h-[360px]">
        {/* Category Pill */}
        <span className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-wider text-[#888] dark:text-[#666]">
          {currentItem.kana.category} · {direction === 'kana-to-romaji' ? 'Recognition' : 'Production'}
        </span>

        {/* Audio Replay Button */}
        {enableAudio && (
          <button
            onClick={() => playSound(currentItem.kana.kana)}
            title="Listen to Japanese pronunciation (Key: R)"
            aria-label="Play pronunciation"
            className="absolute top-4 right-4 p-2 text-[#737373] hover:text-[#C94B3C] rounded hover:bg-[#F7F6F2] dark:hover:bg-[#282828] transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}

        {/* Centerpiece Japanese Kana (in Kana->Romaji mode) OR Romaji Prompt (in Romaji->Kana mode) */}
        <div className="my-6">
          {direction === 'kana-to-romaji' ? (
            <span className="text-8xl sm:text-9xl font-kana font-normal tracking-wide text-[#202020] dark:text-[#F0EFEB] select-none block">
              {currentItem.kana.kana}
            </span>
          ) : (
            <div className="space-y-1">
              <span className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-[#C94B3C] dark:text-[#E06A5B] select-none block">
                {currentItem.kana.romaji}
              </span>
              <span className="text-xs font-mono uppercase text-[#737373] tracking-widest block">
                Identify the correct {currentItem.kana.script} glyph
              </span>
            </div>
          )}
        </div>

        {/* Answer Input or Choices */}
        {!isRevealed ? (
          direction === 'kana-to-romaji' ? (
            <form onSubmit={handleSubmitAnswer} className="w-full max-w-sm space-y-3 mt-4">
              <input
                ref={inputRef}
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Type romaji... (or Space to reveal)"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full px-4 py-3 text-center text-lg font-mono border border-[#DDD] dark:border-[#333] rounded bg-white dark:bg-[#161616] text-[#202020] dark:text-[#FFF] focus:outline-none focus:ring-2 focus:ring-[#C94B3C] transition-shadow"
              />
              <div className="flex items-center justify-between text-[11px] text-[#888] font-mono px-1">
                <span>Press Enter to Submit</span>
                <span>Space to Reveal</span>
              </div>
            </form>
          ) : (
            /* Romaji -> Kana Choice Grid (Keys 1, 2, 3, 4) */
            <div className="w-full max-w-md space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-2.5">
                {distractorSet?.options.map((opt, idx) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectChoice(opt)}
                    className="p-4 rounded border border-[#DDD] dark:border-[#333] hover:border-[#C94B3C] bg-[#FAFAF8] dark:bg-[#181818] hover:bg-white dark:hover:bg-[#222] text-center transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <span className="text-3xl font-kana text-[#202020] dark:text-[#F0EFEB] group-hover:scale-105 transition-transform">
                      {opt.kana}
                    </span>
                    <span className="text-[10px] font-mono text-[#888] mt-1">
                      Key: {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-[#888] font-mono">
                Press 1-4 on keyboard to select
              </div>
            </div>
          )
        ) : (
          /* Revealed Card State */
          <div className="space-y-4 w-full max-w-md animate-fade-in mt-2">
            {/* Feedback Pill */}
            {answerResult?.submitted && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  answerResult.isCorrect
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                }`}
              >
                {answerResult.isCorrect ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Correct</span>
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Incorrect (You selected: "{answerResult.userClean}")</span>
                  </>
                )}
              </div>
            )}

            {/* Kana + Romaji Confirmation */}
            <div className="space-y-1">
              <div className="text-4xl font-kana font-medium text-[#202020] dark:text-[#F0EFEB]">
                {currentItem.kana.kana}
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#C94B3C] dark:text-[#E06A5B]">
                {currentItem.kana.romaji}
              </div>
              {currentItem.kana.aliases && currentItem.kana.aliases.length > 0 && (
                <div className="text-xs text-[#737373] dark:text-[#888] font-mono">
                  Accepted aliases: {currentItem.kana.aliases.join(', ')}
                </div>
              )}
            </div>

            {/* Construction formula */}
            {currentItem.kana.construction && (
              <div className="text-xs font-medium text-[#555] dark:text-[#BBB] bg-[#F7F6F2] dark:bg-[#161616] p-2 rounded border border-[#E5E4DE] dark:border-[#282828]">
                {currentItem.kana.construction.explanation}
              </div>
            )}

            {/* Phonetic Note */}
            {currentItem.kana.explanation && (
              <p className="text-xs text-[#737373] dark:text-[#999] leading-relaxed">
                {currentItem.kana.explanation}
              </p>
            )}

            {/* Confusable Distinction Callout on Reveal */}
            {activeConfusables.length > 0 && (
              <div className="p-3 bg-[#FAF9F5] dark:bg-[#161616] rounded border border-[#E5E4DE] dark:border-[#282828] text-left space-y-1.5 mt-3">
                <div className="flex items-center gap-1 text-[11px] font-mono uppercase font-bold text-[#C94B3C]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visual Stroke Distinction</span>
                </div>
                {activeConfusables.slice(0, 1).map(pair => (
                  <div key={pair.id} className="text-xs text-[#555] dark:text-[#BBB] space-y-1">
                    <div className="font-kana font-bold text-sm text-[#202020] dark:text-[#F0EFEB]">
                      {pair.char1} ({pair.romaji1}) vs {pair.char2} ({pair.romaji2})
                    </div>
                    <p className="text-[11px] text-[#737373] dark:text-[#999] leading-normal">
                      {pair.tip}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SRS Grading Controls (Only visible after reveal) */}
      {isRevealed && (
        <div className="space-y-2 animate-fade-in">
          <div className="text-center text-[11px] font-mono uppercase text-[#737373]">
            {isWrongAnswer ? 'Answer was incorrect — rating locked to Again' : 'Select honest recall grade'}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {gradeError && <p role="alert" className="col-span-full text-sm text-rose-600 dark:text-rose-400">{gradeError}</p>}
            {/* 1. Again */}
            <button
              onClick={() => handleGrade(Rating.Again as Grade)}
              disabled={isGrading}
              className={`p-3 rounded border text-center transition-all cursor-pointer ${
                isWrongAnswer
                  ? 'bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400'
                  : 'bg-white dark:bg-[#1E1E1E] border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-[#202020] dark:text-[#FFF]'
              }`}
            >
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                1. Again
              </div>
              <div className="text-[10px] font-mono text-[#737373] dark:text-[#999] mt-0.5">
                {previews[Rating.Again].intervalDesc}
              </div>
            </button>

            {/* 2. Hard */}
            <button
              onClick={() => handleGrade(Rating.Hard as Grade)}
              disabled={isGrading || isWrongAnswer}
              className={`p-3 rounded border text-center transition-all ${
                isWrongAnswer
                  ? 'opacity-30 cursor-not-allowed bg-transparent border-[#DDD] dark:border-[#333]'
                  : 'bg-white dark:bg-[#1E1E1E] border-amber-200 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-[#202020] dark:text-[#FFF] cursor-pointer'
              }`}
            >
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                2. Hard
              </div>
              <div className="text-[10px] font-mono text-[#737373] dark:text-[#999] mt-0.5">
                {previews[Rating.Hard].intervalDesc}
              </div>
            </button>

            {/* 3. Good */}
            <button
              onClick={() => handleGrade(Rating.Good as Grade)}
              disabled={isGrading || isWrongAnswer}
              className={`p-3 rounded border text-center transition-all ${
                isWrongAnswer
                  ? 'opacity-30 cursor-not-allowed bg-transparent border-[#DDD] dark:border-[#333]'
                  : 'bg-white dark:bg-[#1E1E1E] border-blue-200 dark:border-blue-900/40 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[#202020] dark:text-[#FFF] cursor-pointer ring-1 ring-blue-400/30'
              }`}
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                3. Good
              </div>
              <div className="text-[10px] font-mono text-[#737373] dark:text-[#999] mt-0.5">
                {previews[Rating.Good].intervalDesc}
              </div>
            </button>

            {/* 4. Easy */}
            <button
              onClick={() => handleGrade(Rating.Easy as Grade)}
              disabled={isGrading || isWrongAnswer}
              className={`p-3 rounded border text-center transition-all ${
                isWrongAnswer
                  ? 'opacity-30 cursor-not-allowed bg-transparent border-[#DDD] dark:border-[#333]'
                  : 'bg-white dark:bg-[#1E1E1E] border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-[#202020] dark:text-[#FFF] cursor-pointer'
              }`}
            >
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                4. Easy
              </div>
              <div className="text-[10px] font-mono text-[#737373] dark:text-[#999] mt-0.5">
                {previews[Rating.Easy].intervalDesc}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
