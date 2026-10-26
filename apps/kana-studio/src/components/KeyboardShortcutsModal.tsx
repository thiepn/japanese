import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E4DE] dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#C94B3C]" />
            <h2 className="text-base font-serif font-bold text-[#202020] dark:text-[#F0EFEB]">
              Keyboard Navigation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#F2F0E8] dark:hover:bg-[#282828] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-5 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Review Before Reveal */}
          <div className="space-y-2">
            <h3 className="font-mono uppercase font-bold text-[#737373] text-[10px] tracking-wider">
              Flashcard: Before Answer Revealed
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Type answer (Kana → Romaji)</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  a-z
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Select choice (Romaji → Kana)</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  1 - 4
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Submit answer</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Reveal without typing</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Replay pronunciation audio</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  R
                </kbd>
              </div>
            </div>
          </div>

          {/* Review After Reveal */}
          <div className="space-y-2">
            <h3 className="font-mono uppercase font-bold text-[#737373] text-[10px] tracking-wider">
              Flashcard: Grading (After Reveal)
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">1. Again (Forgotten / Incorrect)</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded font-bold">
                  1
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">2. Hard (Recalled with difficulty)</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded font-bold">
                  2
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">3. Good (Standard recall)</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded font-bold">
                  3
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">4. Easy (Immediate effortless recall)</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded font-bold">
                  4
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Default Grade (Good if correct, Again if wrong)</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  Enter
                </kbd>
              </div>
            </div>
          </div>

          {/* Kana Chart Navigation */}
          <div className="space-y-2">
            <h3 className="font-mono uppercase font-bold text-[#737373] text-[10px] tracking-wider">
              Kana Chart Grid Controls
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Navigate rows & columns</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  ↑ ↓ ← →
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Open character details</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Close details modal</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  Escape
                </kbd>
              </div>
            </div>
          </div>

          {/* General navigation */}
          <div className="space-y-2">
            <h3 className="font-mono uppercase font-bold text-[#737373] text-[10px] tracking-wider">
              General
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-1 border-b border-[#F2F0E8] dark:border-[#282828]">
                <span className="text-[#555] dark:text-[#CCC]">Exit / Back / Close modal</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  Escape
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#555] dark:text-[#CCC]">Toggle keyboard shortcuts</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-[#F7F6F2] dark:bg-[#262626] border border-[#DDD] dark:border-[#383838] rounded">
                  ?
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F7F6F2] dark:bg-[#161616] border-t border-[#E5E4DE] dark:border-[#262626] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#202020] dark:bg-[#333] hover:bg-black text-white text-xs font-semibold rounded cursor-pointer"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
