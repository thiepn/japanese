import React from 'react';
import { ArrowRight, BookOpen, Clock, RotateCw, CheckCircle2, Sparkles, Filter, Layers } from 'lucide-react';
import type { DeckStatistics, UserSettings } from '../types/kana';

interface HomeViewProps {
  stats: DeckStatistics;
  settings: UserSettings;
  embedded?:boolean;
  onNavigate: (view: 'home' | 'learn' | 'review' | 'words' | 'chart') => void;
  onOpenScheduleModal?: () => void;
  onOpenCategoryModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  settings,
  embedded=false,
  onNavigate,
  onOpenScheduleModal,
  onOpenCategoryModal
}) => {
  const hasReviews = stats.dueNowCount > 0;
  const hasNewCards = stats.newAvailableCount > 0;
  const isCompleteBeginner = stats.totalIntroduced === 0;

  const formatNextDue = (date: Date | null) => {
    if (!date) return 'None pending';
    const now = new Date();

    const diffMs = date.getTime() - now.getTime();
    if (diffMs <= 0) return 'Due now';
    const diffMin = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffDays >= 1) {
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    if (diffHours >= 1) {
      return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    }
    return `in ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  };

  const hiraganaPct = Math.round((stats.hiraganaIntroduced / Math.max(1, stats.hiraganaTotal)) * 100);
  const katakanaPct = Math.round((stats.katakanaIntroduced / Math.max(1, stats.katakanaTotal)) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 sm:py-14 space-y-8 sm:space-y-10 animate-fade-in">
      {/* Title & Editorial Header */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E5E4DE] dark:border-[#262626] pb-4 gap-2">
          <div>
            {embedded
              ?<h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#202020] dark:text-[#F0EFEB]">
                Your learning progress
              </h2>
              :<h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#202020] dark:text-[#F0EFEB]">
                KANA
              </h1>}
            <p className="mt-1 text-xs sm:text-base text-[#737373] dark:text-[#9E9E9E] font-sans">
              Japanese Kana Mastery with Spaced Repetition
            </p>
          </div>
          {onOpenScheduleModal ? (
            <button
              onClick={onOpenScheduleModal}
              title="Click to view SRS forecast and memory schedule"
              className="text-left sm:text-right text-[10px] sm:text-xs text-[#C94B3C] dark:text-[#E06A5B] hover:underline font-mono tracking-wider cursor-pointer flex items-center sm:justify-end gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>FSRS 90% TARGET RETENTION (VIEW SCHEDULE)</span>
            </button>
          ) : (
            <div className="text-left sm:text-right text-[10px] sm:text-xs text-[#737373] dark:text-[#888] font-mono tracking-wider">
              FSRS 90% TARGET RETENTION
            </div>
          )}
        </div>
      </section>

      {/* Primary Action Hero */}
      <section className="p-6 sm:p-8 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C94B3C] dark:text-[#E06A5B] font-semibold">
              {hasReviews ? 'Action Required' : hasNewCards ? 'Ready to Learn' : 'Deck Clear'}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#202020] dark:text-[#F0EFEB]">
              {hasReviews
                ? `${stats.dueNowCount} Review${stats.dueNowCount > 1 ? 's' : ''} Due Now`
                : isCompleteBeginner
                ? 'Begin Your Kana Journey'
                : hasNewCards
                ? 'Ready for New Characters'
                : 'All Scheduled Reviews Complete'}
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#9E9E9E]">
              {hasReviews
                ? 'Reinforce memory traces at the optimal scientifically calculated interval.'
                : hasNewCards
                ? 'Introduce new kana characters into your spaced repetition deck.'
                : `Next card review is scheduled ${formatNextDue(stats.nextDueTime)}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {hasReviews ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('review')}
                  className="w-full sm:w-auto px-6 py-3 bg-[#C94B3C] hover:bg-[#B23F31] text-white text-sm font-semibold rounded shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Review Due Cards</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onOpenCategoryModal && (
                  <button
                    onClick={onOpenCategoryModal}
                    title="Select specific rows or categories to review"
                    className="w-full sm:w-auto px-4 py-3 border border-[#E5E4DE] dark:border-[#333] hover:bg-[#EAE8E1] dark:hover:bg-[#282828] text-xs font-semibold text-[#555] dark:text-[#CCC] rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter</span>
                  </button>
                )}
              </div>
            ) : hasNewCards ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('learn')}
                  className="w-full sm:w-auto px-6 py-3 bg-[#C94B3C] hover:bg-[#B23F31] text-white text-sm font-semibold rounded shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{isCompleteBeginner ? 'Start Learning Hiragana' : 'Continue Learning'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onOpenCategoryModal ? (
                  <button
                    onClick={onOpenCategoryModal}
                    className="w-full sm:w-auto px-4 py-3 border border-[#E5E4DE] dark:border-[#333] hover:bg-[#EAE8E1] dark:hover:bg-[#282828] text-xs font-semibold text-[#555] dark:text-[#CCC] rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Category Drill</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('review')}
                    className="w-full sm:w-auto px-4 py-3 border border-[#E5E4DE] dark:border-[#333] hover:bg-[#EAE8E1] dark:hover:bg-[#282828] text-xs font-semibold text-[#555] dark:text-[#CCC] rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Custom Practice</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {onOpenCategoryModal ? (
                  <button
                    onClick={onOpenCategoryModal}
                    className="w-full sm:w-auto px-5 py-3 bg-[#202020] dark:bg-[#2A2A2A] hover:bg-[#333] dark:hover:bg-[#383838] text-white text-xs font-semibold rounded shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Practice Ahead (Cram)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('review')}
                    className="w-full sm:w-auto px-5 py-3 bg-[#202020] dark:bg-[#2A2A2A] hover:bg-[#333] dark:hover:bg-[#383838] text-white text-xs font-semibold rounded shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Practice Ahead</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate('words')}
                  className="w-full sm:w-auto px-5 py-3 border border-[#E5E4DE] dark:border-[#333] hover:bg-[#EAE8E1] dark:hover:bg-[#282828] text-xs font-semibold text-[#555] dark:text-[#CCC] rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Study Words</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Grid of Key SRS Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E]">
          <div className="flex items-center justify-between text-[#737373] dark:text-[#888] mb-1">
            <span className="text-xs font-mono uppercase">Due Now</span>
            <RotateCw className="w-3.5 h-3.5 text-[#C94B3C]" />
          </div>
          <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
            {stats.dueNowCount}
          </div>
          <div className="text-[11px] text-[#737373] dark:text-[#888] mt-0.5">
            Cards waiting
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E]">
          <div className="flex items-center justify-between text-[#737373] dark:text-[#888] mb-1">
            <span className="text-xs font-mono uppercase">In Learning</span>
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
            {stats.inLearningCount}
          </div>
          <div className="text-[11px] text-[#737373] dark:text-[#888] mt-0.5">
            Short-term steps
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E]">
          <div className="flex items-center justify-between text-[#737373] dark:text-[#888] mb-1">
            <span className="text-xs font-mono uppercase">In Review</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
            {stats.inReviewCount}
          </div>
          <div className="text-[11px] text-[#737373] dark:text-[#888] mt-0.5">
            Long-term retention
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E]">
          <div className="flex items-center justify-between text-[#737373] dark:text-[#888] mb-1">
            <span className="text-xs font-mono uppercase">Next Due</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-base sm:text-lg font-bold text-[#202020] dark:text-[#F0EFEB] truncate">
            {formatNextDue(stats.nextDueTime)}
          </div>
          <div className="text-[11px] text-[#737373] dark:text-[#888] mt-0.5">
            Upcoming interval
          </div>
        </div>
      </section>

      {/* Script Progress Breakdown */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#737373] dark:text-[#888]">
          Script Mastery Progress
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hiragana Bar */}
          <div className="p-5 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-[#202020] dark:text-[#F0EFEB]">
                  Hiragana
                </span>
                <span className="ml-2 font-serif text-sm text-[#737373]">
                  ひらがな
                </span>
              </div>
              <span className="text-sm font-mono font-medium text-[#202020] dark:text-[#F0EFEB]">
                {stats.hiraganaIntroduced} / {stats.hiraganaTotal}
              </span>
            </div>

            <div className="w-full bg-[#EAE8E1] dark:bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C94B3C] h-full transition-all duration-300"
                style={{ width: `${hiraganaPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#888]">
              <span>Basic, Voiced, Contracted</span>
              <span>{hiraganaPct}% Introduced</span>
            </div>
          </div>

          {/* Katakana Bar */}
          <div className="p-5 bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-[#202020] dark:text-[#F0EFEB]">
                  Katakana
                </span>
                <span className="ml-2 font-serif text-sm text-[#737373]">
                  カタカナ
                </span>
              </div>
              <span className="text-sm font-mono font-medium text-[#202020] dark:text-[#F0EFEB]">
                {stats.katakanaIntroduced} / {stats.katakanaTotal}
              </span>
            </div>

            <div className="w-full bg-[#EAE8E1] dark:bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#202020] dark:bg-[#888] h-full transition-all duration-300"
                style={{ width: `${katakanaPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#888]">
              <span>Basic, Voiced, Contracted</span>
              <span>{katakanaPct}% Introduced</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards: Vocabulary & Reference Chart */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vocabulary Study Card */}
        <div className="p-5 bg-[#FAF9F5] dark:bg-[#191919] rounded-md border border-[#E5E4DE] dark:border-[#262626] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-[#202020] dark:text-[#F0EFEB]">
                Contextual Vocabulary
              </span>
              <span className="font-kana text-xs text-[#C94B3C]">単語</span>
            </div>
            <p className="text-xs text-[#737373] dark:text-[#888] leading-relaxed">
              Cement kana recognition by studying real Japanese words (food, daily life, Katakana loanwords) with character breakdowns and audio.
            </p>
          </div>
          <button
            onClick={() => onNavigate('words')}
            className="self-start text-xs font-semibold text-[#C94B3C] dark:text-[#E06A5B] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Explore Vocabulary →</span>
          </button>
        </div>

        {/* Master Kana Reference Chart Card */}
        <div className="p-5 bg-[#FAF9F5] dark:bg-[#191919] rounded-md border border-[#E5E4DE] dark:border-[#262626] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-[#202020] dark:text-[#F0EFEB]">
                Master Kana Chart
              </span>
              <span className="font-kana text-xs text-[#737373]">五十音</span>
            </div>
            <p className="text-xs text-[#737373] dark:text-[#888] leading-relaxed">
              Explore the complete 50-sound gojūon grid, stroke distinctions, and launch 1-click drills for any row.
            </p>
          </div>
          <button
            onClick={() => onNavigate('chart')}
            className="self-start text-xs font-semibold text-[#C94B3C] dark:text-[#E06A5B] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Open Chart →</span>
          </button>
        </div>
      </section>
    </div>
  );
};

