import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Settings as SettingsIcon, HelpCircle, Eye, ArrowLeft } from 'lucide-react';
import type { UserSettings } from '../types/kana';
import { returnToJapanese } from '../services/japaneseBridge';

interface NavigationProps {
  currentView: 'home' | 'learn' | 'review' | 'words' | 'chart';
  onNavigate: (view: 'home' | 'learn' | 'review' | 'words' | 'chart') => void;
  dueCount: number;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenConfusables: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  dueCount,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenShortcuts,
  onOpenConfusables,
  isDark,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E4DE] dark:border-[#262626] bg-[#F7F6F2]/90 dark:bg-[#151515]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Return to the parent Japanese app without altering local review history. */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <button type="button" onClick={returnToJapanese} aria-label="Back to Japanese app"
            className="inline-flex shrink-0 items-center gap-1.5 py-2 pr-1 text-sm text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C94B3C]">
            <ArrowLeft className="w-4 h-4"/><span className="hidden lg:inline">Japanese</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C94B3C]"
            aria-label="KANA home"
          >
            <span className="font-serif tracking-widest text-xl sm:text-2xl font-bold text-[#202020] dark:text-[#F0EFEB]">
              KANA
            </span>
            <span className="text-[11px] sm:text-xs px-1.5 py-0.5 rounded border border-[#E5E4DE] dark:border-[#333] text-[#737373] dark:text-[#999] tracking-wider font-kana">
              仮名
            </span>
          </button>


          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                currentView === 'home'
                  ? 'text-[#C94B3C] dark:text-[#E06A5B] bg-[#C94B3C]/10 font-semibold'
                  : 'text-[#555] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-[#FFF]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                currentView === 'learn'
                  ? 'text-[#C94B3C] dark:text-[#E06A5B] bg-[#C94B3C]/10 font-semibold'
                  : 'text-[#555] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-[#FFF]'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => onNavigate('review')}
              className={`relative px-3 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1.5 ${
                currentView === 'review'
                  ? 'text-[#C94B3C] dark:text-[#E06A5B] bg-[#C94B3C]/10 font-semibold'
                  : 'text-[#555] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-[#FFF]'
              }`}
            >
              Review
              {dueCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold leading-none text-white bg-[#C94B3C] rounded-full">
                  {dueCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('words')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                currentView === 'words'
                  ? 'text-[#C94B3C] dark:text-[#E06A5B] bg-[#C94B3C]/10 font-semibold'
                  : 'text-[#555] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-[#FFF]'
              }`}
            >
              Words
            </button>
            <button
              onClick={() => onNavigate('chart')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                currentView === 'chart'
                  ? 'text-[#C94B3C] dark:text-[#E06A5B] bg-[#C94B3C]/10 font-semibold'
                  : 'text-[#555] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-[#FFF]'
              }`}
            >
              Kana Chart
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Confusables guide */}
          <button
            onClick={onOpenConfusables}
            title="Confusable Kana Guide"
            aria-label="Confusable Kana Guide"
            className="p-2 text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#EAE8E1] dark:hover:bg-[#222] transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => onUpdateSettings({ enableAudio: !settings.enableAudio })}
            title={settings.enableAudio ? 'Audio Enabled (Pronunciation on)' : 'Audio Muted'}
            aria-label={settings.enableAudio ? 'Disable audio' : 'Enable audio'}
            className="p-2 text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#EAE8E1] dark:hover:bg-[#222] transition-colors"
          >
            {settings.enableAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#999]" />}
          </button>

          {/* Theme switch */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
            className="p-2 text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#EAE8E1] dark:hover:bg-[#222] transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Shortcuts help */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
            className="p-2 text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#EAE8E1] dark:hover:bg-[#222] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Settings"
            aria-label="Open Settings"
            className="p-2 text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#EAE8E1] dark:hover:bg-[#222] transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="sm:hidden flex border-t border-[#E5E4DE] dark:border-[#262626] bg-[#F7F6F2] dark:bg-[#151515]">
        <button
          onClick={() => onNavigate('home')}
          className={`flex-1 py-2 text-center text-xs font-medium ${
            currentView === 'home' ? 'text-[#C94B3C] font-bold border-b-2 border-[#C94B3C]' : 'text-[#666] dark:text-[#AAA]'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('learn')}
          className={`flex-1 py-2 text-center text-xs font-medium ${
            currentView === 'learn' ? 'text-[#C94B3C] font-bold border-b-2 border-[#C94B3C]' : 'text-[#666] dark:text-[#AAA]'
          }`}
        >
          Learn
        </button>
        <button
          onClick={() => onNavigate('review')}
          className={`flex-1 py-2 text-center text-xs font-medium flex items-center justify-center gap-1 ${
            currentView === 'review' ? 'text-[#C94B3C] font-bold border-b-2 border-[#C94B3C]' : 'text-[#666] dark:text-[#AAA]'
          }`}
        >
          Review
          {dueCount > 0 && (
            <span className="min-w-4 h-4 px-1 text-[10px] font-bold leading-none text-white bg-[#C94B3C] rounded-full inline-flex items-center justify-center">
              {dueCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onNavigate('words')}
          className={`flex-1 py-2 text-center text-xs font-medium ${
            currentView === 'words' ? 'text-[#C94B3C] font-bold border-b-2 border-[#C94B3C]' : 'text-[#666] dark:text-[#AAA]'
          }`}
        >
          Words
        </button>
        <button
          onClick={() => onNavigate('chart')}
          className={`flex-1 py-2 text-center text-xs font-medium ${
            currentView === 'chart' ? 'text-[#C94B3C] font-bold border-b-2 border-[#C94B3C]' : 'text-[#666] dark:text-[#AAA]'
          }`}
        >
          Chart
        </button>
      </div>
    </header>
  );
};
