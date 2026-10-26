import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BarChart3, ShieldCheck, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import type { SrsForecast, UserSettings } from '../types/kana';
import { calculateSrsForecast } from '../services/srs';

interface SrsScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onStartReview: () => void;
  onStartCram: () => void;
}

export const SrsScheduleModal: React.FC<SrsScheduleModalProps> = ({
  isOpen,
  onClose,
  settings,
  onStartReview,
  onStartCram
}) => {
  const [forecast, setForecast] = useState<SrsForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      calculateSrsForecast(settings).then((data) => {
        setForecast(data);
        setLoading(false);
      });
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E4DE] dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C94B3C]" />
            <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-[#202020] dark:text-[#F0EFEB]">
              SRS Schedule & Memory Forecast
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
          {/* Explanation Callout */}
          <div className="p-4 bg-[#FAF9F5] dark:bg-[#161616] rounded border border-[#E5E4DE] dark:border-[#282828] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C94B3C] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>How Free Spaced Repetition (FSRS) Works</span>
            </div>
            <p className="text-xs text-[#555] dark:text-[#BBB] leading-relaxed">
              Unlike arbitrary timers, FSRS mathematically models the human forgetting curve. It schedules each kana at the exact moment your predicted probability of recall drops to <strong className="text-[#202020] dark:text-white">90%</strong>. Every successful review exponentially strengthens memory stability.
            </p>
          </div>

          {/* Forecast Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-[#737373] font-semibold">
              <span>Upcoming Review Forecast</span>
              <span>Script: {settings.preferredScript}</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-[#737373]">
                Calculating intervals...
              </div>
            ) : forecast ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded border border-[#E5E4DE] dark:border-[#2E2E2E]">
                  <div className="text-[10px] font-mono text-[#737373] uppercase">Due Now</div>
                  <div className="text-2xl font-bold text-[#C94B3C]">
                    {forecast.dueNow}
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">Ready for review</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded border border-[#E5E4DE] dark:border-[#2E2E2E]">
                  <div className="text-[10px] font-mono text-[#737373] uppercase">Today Total</div>
                  <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
                    {forecast.dueToday}
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">Next 24 hours</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded border border-[#E5E4DE] dark:border-[#2E2E2E]">
                  <div className="text-[10px] font-mono text-[#737373] uppercase">Tomorrow</div>
                  <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
                    {forecast.dueTomorrow}
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">Cumulative +48h</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded border border-[#E5E4DE] dark:border-[#2E2E2E]">
                  <div className="text-[10px] font-mono text-[#737373] uppercase">In 3 Days</div>
                  <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
                    {forecast.due3Days}
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">Upcoming cycle</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded border border-[#E5E4DE] dark:border-[#2E2E2E]">
                  <div className="text-[10px] font-mono text-[#737373] uppercase">In 1 Week</div>
                  <div className="text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
                    {forecast.dueWeek}
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">7-day queue</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded border border-[#E5E4DE] dark:border-[#2E2E2E]">
                  <div className="text-[10px] font-mono text-[#737373] uppercase">Mastered</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {forecast.matureCount}
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">Stability &gt; 21 days</div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Rating Scale Guide */}
          <div className="space-y-2 border-t border-[#E5E4DE] dark:border-[#262626] pt-4">
            <div className="text-xs font-mono uppercase text-[#737373] font-semibold">
              The 4 Feedback Ratings
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#FAF9F5] dark:bg-[#161616] border border-[#EAE8E1] dark:border-[#282828] space-y-1">
                <span className="font-bold text-rose-600 dark:text-rose-400">1. Again</span>
                <p className="text-[11px] text-[#737373] dark:text-[#888]">
                  Complete blackout or wrong answer. Card resets to short-term learning steps (~1–10m).
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#FAF9F5] dark:bg-[#161616] border border-[#EAE8E1] dark:border-[#282828] space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400">2. Hard</span>
                <p className="text-[11px] text-[#737373] dark:text-[#888]">
                  Recalled with significant hesitation or hesitation. Slightly shorter interval advance.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#FAF9F5] dark:bg-[#161616] border border-[#EAE8E1] dark:border-[#282828] space-y-1">
                <span className="font-bold text-blue-600 dark:text-blue-400">3. Good (Standard)</span>
                <p className="text-[11px] text-[#737373] dark:text-[#888]">
                  Recalled with normal effort. Interval advances along optimal 90% retention trajectory.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#FAF9F5] dark:bg-[#161616] border border-[#EAE8E1] dark:border-[#282828] space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">4. Easy</span>
                <p className="text-[11px] text-[#737373] dark:text-[#888]">
                  Instant, effortless recognition. Extended bonus interval with reduced difficulty.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F7F6F2] dark:bg-[#161616] border-t border-[#E5E4DE] dark:border-[#262626] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onStartCram();
            }}
            className="px-4 py-2 border border-[#DDD] dark:border-[#333] hover:bg-white dark:hover:bg-[#252525] text-xs font-semibold rounded text-[#555] dark:text-[#CCC] cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Study Ahead (Cram)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartReview();
            }}
            className="px-5 py-2.5 bg-[#C94B3C] hover:bg-[#B23F31] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
