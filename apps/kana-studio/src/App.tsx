import React, { useState, useEffect, useCallback } from 'react';
import type { DeckStatistics, StoredCardData, UserSettings, ReviewFilterOptions } from './types/kana';
import { defaultSettings, getAllStoredCards, getSettings, saveSettings } from './services/storage';
import { calculateDeckStatistics } from './services/srs';
import { initSpeech } from './services/speech';
import { kanaMap } from './data/kanaData';
import { currentKanaView } from './services/japaneseBridge';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { ReviewView } from './components/ReviewView';
import { WordStudyView } from './components/WordStudyView';
import { KanaChartView } from './components/KanaChartView';
import { SettingsModal } from './components/SettingsModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ConfusablesModal } from './components/ConfusablesModal';
import { CategoryReviewModal } from './components/CategoryReviewModal';
import { SrsScheduleModal } from './components/SrsScheduleModal';
import { KanaDetailModal } from './components/KanaDetailModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'learn' | 'review' | 'words' | 'chart'>(currentKanaView);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [storedCards, setStoredCards] = useState<Map<string, StoredCardData>>(new Map());
  const [stats, setStats] = useState<DeckStatistics>({
    dueNowCount: 0,
    newAvailableCount: 0,
    inLearningCount: 0,
    inReviewCount: 0,
    totalIntroduced: 0,
    hiraganaIntroduced: 0,
    hiraganaTotal: 107,
    katakanaIntroduced: 0,
    katakanaTotal: 107,
    nextDueTime: null
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isConfusablesOpen, setIsConfusablesOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeModalKanaId, setActiveModalKanaId] = useState<string | null>(null);

  const [drillKanaIds, setDrillKanaIds] = useState<string[] | undefined>(undefined);
  const [customFilterOptions, setCustomFilterOptions] = useState<ReviewFilterOptions | undefined>(undefined);
  const [reviewDirection, setReviewDirection] = useState<'kana-to-romaji' | 'romaji-to-kana'>('kana-to-romaji');

  const [isDark, setIsDark] = useState(false);

  // Load app data
  const refreshData = useCallback(async () => {
    try {
      const userSettings = await getSettings();
      setSettings(userSettings);

      const cards = await getAllStoredCards();
      setStoredCards(cards);

      const computedStats = await calculateDeckStatistics(userSettings);
      setStats(computedStats);
    } catch (err) {
      console.error('Error refreshing app data:', err);
    }
  }, []);

  // Initial load & speech synthesis
  useEffect(() => {
    initSpeech();
    refreshData();

    // Check for autostart query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setCurrentView('review');
    }
  }, [refreshData]);

  // Sync theme
  useEffect(() => {
    const applyTheme = () => {
      let dark = false;
      if (settings.theme === 'dark') {
        dark = true;
      } else if (settings.theme === 'light') {
        dark = false;
      } else {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (settings.theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [settings.theme]);

  // Handle settings update
  const handleUpdateSettings = async (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await saveSettings(updated);
    await refreshData();
  };

  const toggleTheme = async () => {
    const nextTheme = isDark ? 'light' : 'dark';
    await handleUpdateSettings({ theme: nextTheme });
  };

  // Launch category or row drill
  const handleStartCategoryReview = (filter: ReviewFilterOptions, dir: 'kana-to-romaji' | 'romaji-to-kana') => {
    setDrillKanaIds(undefined);
    setCustomFilterOptions(filter);
    setReviewDirection(dir);
    setCurrentView('review');
  };

  const handleDrillKana = (ids: string[]) => {
    setDrillKanaIds(ids);
    setCustomFilterOptions(undefined);
    setReviewDirection('kana-to-romaji');
    setCurrentView('review');
  };

  const handleStartCram = () => {
    setDrillKanaIds(undefined);
    setCustomFilterOptions({ cramMode: true });
    setReviewDirection('kana-to-romaji');
    setCurrentView('review');
  };

  const handleStandardReview = () => {
    setDrillKanaIds(undefined);
    setCustomFilterOptions(undefined);
    setReviewDirection('kana-to-romaji');
    setCurrentView('review');
  };

  // Global shortcut listeners: '?' for shortcuts, 'Escape' to close open modals
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsSettingsOpen(false);
        setIsConfusablesOpen(false);
        setIsCategoryModalOpen(false);
        setIsScheduleModalOpen(false);
        setActiveModalKanaId(null);
        return;
      }

      // Don't trigger '?' if typing in an input
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const activeKanaItem = activeModalKanaId ? kanaMap.get(activeModalKanaId) || null : null;

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#151515] text-[#202020] dark:text-[#F0EFEB] flex flex-col font-sans selection:bg-[#C94B3C]/20 selection:text-[#C94B3C] transition-colors duration-200">
      {/* Navigation */}
      <Navigation
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'review') {
            handleStandardReview();
          } else {
            setCurrentView(view);
          }
        }}
        dueCount={stats.dueNowCount}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenConfusables={() => setIsConfusablesOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto pb-16">
        {currentView === 'home' && (
          <HomeView
            stats={stats}
            settings={settings}
            onNavigate={(view) => {
              if (view === 'review') {
                handleStandardReview();
              } else {
                setCurrentView(view);
              }
            }}
            onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
            onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          />
        )}

        {currentView === 'learn' && (
          <LearnView
            storedCards={storedCards}
            onRefreshData={refreshData}
            enableAudio={settings.enableAudio}
            onStartReview={() => handleStandardReview()}
          />
        )}

        {currentView === 'review' && (
          <ReviewView
            settings={settings}
            onExit={() => setCurrentView('home')}
            onRefreshData={refreshData}
            enableAudio={settings.enableAudio}
            initialDirection={reviewDirection}
            drillKanaIds={drillKanaIds}
            filterOptions={customFilterOptions}
            onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          />
        )}

        {currentView === 'words' && (
          <WordStudyView
            storedCards={storedCards}
            enableAudio={settings.enableAudio}
            onOpenKanaDetail={(id) => setActiveModalKanaId(id)}
          />
        )}

        {currentView === 'chart' && (
          <KanaChartView
            storedCards={storedCards}
            enableAudio={settings.enableAudio}
            onDrillKana={handleDrillKana}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleUpdateSettings}
        onRefreshData={refreshData}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ConfusablesModal
        isOpen={isConfusablesOpen}
        onClose={() => setIsConfusablesOpen(false)}
        enableAudio={settings.enableAudio}
      />

      <CategoryReviewModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onStartSession={handleStartCategoryReview}
      />

      <SrsScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        settings={settings}
        onStartReview={() => handleStandardReview()}
        onStartCram={() => handleStartCram()}
      />

      {activeKanaItem && (
        <KanaDetailModal
          kana={activeKanaItem}
          storedData={storedCards.get(activeKanaItem.id)}
          onClose={() => setActiveModalKanaId(null)}
          enableAudio={settings.enableAudio}
          onSelectKana={(id) => setActiveModalKanaId(id)}
          onRefreshData={refreshData}
        />
      )}
    </div>
  );
}

