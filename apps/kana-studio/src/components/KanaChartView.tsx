import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { KanaItem, KanaScript, StoredCardData } from '../types/kana';
import { allKanaItems, kanaMap } from '../data/kanaData';
import { KanaDetailModal } from './KanaDetailModal';

import { Play } from 'lucide-react';

interface KanaChartViewProps {
  storedCards: Map<string, StoredCardData>;
  enableAudio: boolean;
  onDrillKana?: (kanaIds: string[]) => void;
  onRefreshData?: () => Promise<void>;
}

type ChartCategoryTab = 'basic' | 'dakuten' | 'handakuten' | 'combinations' | 'extended';

export const KanaChartView: React.FC<KanaChartViewProps> = ({
  storedCards,
  enableAudio,
  onDrillKana,
  onRefreshData
}) => {
  const [selectedScript, setSelectedScript] = useState<'hiragana' | 'katakana' | 'both'>('hiragana');
  const [categoryTab, setCategoryTab] = useState<ChartCategoryTab>('basic');
  const [activeModalKana, setActiveModalKana] = useState<KanaItem | null>(null);
  const [focusedCellId, setFocusedCellId] = useState<string | null>(null);

  // Gojūon standard structure definition
  const basicRowDefs = useMemo(() => [
    { rowKey: 'vowel', label: '—', ids: ['a', 'i', 'u', 'e', 'o'] },
    { rowKey: 'K', label: 'K', ids: ['ka', 'ki', 'ku', 'ke', 'ko'] },
    { rowKey: 'S', label: 'S', ids: ['sa', 'shi', 'su', 'se', 'so'] },
    { rowKey: 'T', label: 'T', ids: ['ta', 'chi', 'tsu', 'te', 'to'] },
    { rowKey: 'N', label: 'N', ids: ['na', 'ni', 'nu', 'ne', 'no'] },
    { rowKey: 'H', label: 'H', ids: ['ha', 'hi', 'fu', 'he', 'ho'] },
    { rowKey: 'M', label: 'M', ids: ['ma', 'mi', 'mu', 'me', 'mo'] },
    { rowKey: 'Y', label: 'Y', ids: ['ya', null, 'yu', null, 'yo'] },
    { rowKey: 'R', label: 'R', ids: ['ra', 'ri', 'ru', 're', 'ro'] },
    { rowKey: 'W', label: 'W', ids: ['wa', null, null, null, 'wo'] },
    { rowKey: 'N_SOLO', label: 'ん/ン', ids: ['n', null, null, null, null] }
  ], []);

  const dakutenRowDefs = useMemo(() => [
    { rowKey: 'G', label: 'G', ids: ['ga', 'gi', 'gu', 'ge', 'go'] },
    { rowKey: 'Z', label: 'Z/J', ids: ['za', 'ji', 'zu', 'ze', 'zo'] },
    { rowKey: 'D', label: 'D', ids: ['da', 'dji', 'dzu', 'de', 'do'] },
    { rowKey: 'B', label: 'B', ids: ['ba', 'bi', 'bu', 'be', 'bo'] }
  ], []);

  const handakutenRowDefs = useMemo(() => [
    { rowKey: 'P', label: 'P', ids: ['pa', 'pi', 'pu', 'pe', 'po'] }
  ], []);

  const combinationRowDefs = useMemo(() => [
    { rowKey: 'KY', label: 'KY', ids: ['kya', 'kyu', 'kyo'] },
    { rowKey: 'GY', label: 'GY', ids: ['gya', 'gyu', 'gyo'] },
    { rowKey: 'SH', label: 'SH', ids: ['sha', 'shu', 'sho'] },
    { rowKey: 'J', label: 'J', ids: ['ja', 'ju', 'jo'] },
    { rowKey: 'CH', label: 'CH', ids: ['cha', 'chu', 'cho'] },
    { rowKey: 'NY', label: 'NY', ids: ['nya', 'nyu', 'nyo'] },
    { rowKey: 'HY', label: 'HY', ids: ['hya', 'hyu', 'hyo'] },
    { rowKey: 'BY', label: 'BY', ids: ['bya', 'byu', 'byo'] },
    { rowKey: 'PY', label: 'PY', ids: ['pya', 'pyu', 'pyo'] },
    { rowKey: 'MY', label: 'MY', ids: ['mya', 'myu', 'myo'] },
    { rowKey: 'RY', label: 'RY', ids: ['rya', 'ryu', 'ryo'] },
    { rowKey: 'DJ', label: 'DJ (Rare)', ids: ['dja', 'dju', 'djo'] }
  ], []);

  const extendedGroups = useMemo(() => [
    {
      title: 'F-Series',
      items: ['k-fa', 'k-fi', 'k-fe', 'k-fo', 'k-fyu']
    },
    {
      title: 'T & D Series',
      items: ['k-ti', 'k-di', 'k-tu', 'k-du']
    },
    {
      title: 'SH, J, CH Series',
      items: ['k-she', 'k-je', 'k-che']
    },
    {
      title: 'W Series',
      items: ['k-wi', 'k-we', 'k-wo-ext']
    },
    {
      title: 'TS Series',
      items: ['k-tsa', 'k-tsi', 'k-tse', 'k-tso']
    },
    {
      title: 'V Series (ヴ)',
      items: ['k-vu', 'k-va', 'k-vi', 'k-ve', 'k-vo']
    }
  ], []);

  // Compute 2D navigation grid of full IDs for current active view
  const currentNavGrid = useMemo(() => {
    const scripts: ('h' | 'k')[] = selectedScript === 'both' ? ['h', 'k'] : [selectedScript === 'katakana' ? 'k' : 'h'];
    const allRows: (string | null)[][] = [];

    for (const prefix of scripts) {
      if (categoryTab === 'basic') {
        allRows.push(...basicRowDefs.map(r => r.ids.map(id => id ? `${prefix}-${id}` : null)));
      } else if (categoryTab === 'dakuten') {
        allRows.push(...dakutenRowDefs.map(r => r.ids.map(id => id ? `${prefix}-${id}` : null)));
      } else if (categoryTab === 'handakuten') {
        allRows.push(...handakutenRowDefs.map(r => r.ids.map(id => id ? `${prefix}-${id}` : null)));
      } else if (categoryTab === 'combinations') {
        allRows.push(...combinationRowDefs.map(r => r.ids.map(id => id ? `${prefix}-${id}` : null)));
      } else if (categoryTab === 'extended' && prefix === 'k') {
        allRows.push(...extendedGroups.map(g => g.items));
      }
    }
    return allRows;
  }, [selectedScript, categoryTab, basicRowDefs, dakutenRowDefs, handakutenRowDefs, combinationRowDefs, extendedGroups]);

  // Arrow key 2D grid navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalKana) {
        if (e.key === 'Escape') {
          setActiveModalKana(null);
        }
        return;
      }

      if (e.key === 'Enter') {
        if (focusedCellId) {
          const item = kanaMap.get(focusedCellId);
          if (item) {
            e.preventDefault();
            setActiveModalKana(item);
          }
        }
        return;
      }

      const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
      if (!isArrow) return;

      // Find current row and column
      let curR = 0;
      let curC = 0;
      let found = false;

      if (focusedCellId) {
        for (let r = 0; r < currentNavGrid.length; r++) {
          for (let c = 0; c < (currentNavGrid[r]?.length ?? 0); c++) {
            if (currentNavGrid[r]?.[c] === focusedCellId) {
              curR = r;
              curC = c;
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }

      if (!found) {
        // Default to first valid cell
        for (let r = 0; r < currentNavGrid.length; r++) {
          for (let c = 0; c < currentNavGrid[r].length; c++) {
            if (currentNavGrid[r][c]) {
              setFocusedCellId(currentNavGrid[r][c]);
              return;
            }
          }
        }
        return;
      }

      e.preventDefault();
      let nextR = curR;
      let nextC = curC;

      if (e.key === 'ArrowRight') {
        nextC = (curC + 1) % (currentNavGrid[curR]?.length ?? 1);
      } else if (e.key === 'ArrowLeft') {
        nextC = (curC - 1 + currentNavGrid[curR].length) % currentNavGrid[curR].length;
      } else if (e.key === 'ArrowDown') {
        nextR = (curR + 1) % currentNavGrid.length;
      } else if (e.key === 'ArrowUp') {
        nextR = (curR - 1 + currentNavGrid.length) % currentNavGrid.length;
      }

      const targetId = currentNavGrid[nextR]?.[nextC];
      if (targetId) {
        setFocusedCellId(targetId);
      } else {
        // If blank, search along direction for next non-null
        let step = 1;
        let candidate: string | null = null;
        while (step < 6) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const checkC = (nextC + (e.key === 'ArrowRight' ? step : 0)) % (currentNavGrid[nextR]?.length || 1);
            candidate = currentNavGrid[nextR]?.[checkC] || null;
          } else {
            const checkC = (nextC - (e.key === 'ArrowLeft' ? step : 0) + (currentNavGrid[nextR]?.length || 1)) % (currentNavGrid[nextR]?.length || 1);
            candidate = currentNavGrid[nextR]?.[checkC] || null;
          }
          if (candidate) break;
          step++;
        }
        if (candidate) setFocusedCellId(candidate);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalKana, focusedCellId, currentNavGrid]);

  const renderCell = (kanaId: string | null, script: KanaScript) => {
    if (!kanaId) {
      return (
        <div className="h-16 sm:h-20 bg-neutral-50/50 dark:bg-neutral-900/20 border border-dashed border-[#EAE8E1] dark:border-[#262626] rounded flex items-center justify-center text-xs text-[#AAA] dark:text-[#666] select-none">
          —
        </div>
      );
    }

    const fullId = `${script === 'hiragana' ? 'h' : 'k'}-${kanaId}`;
    const item = kanaMap.get(fullId);
    if (!item) return <div className="h-16 sm:h-20" />;

    const stored = storedCards.get(item.id);
    const isLearned = stored && (stored.totalReviews > 0 || stored.card.state !== 0);
    const isReview = stored && stored.card.state === 2;
    const isFocused = focusedCellId === item.id;

    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveModalKana(item);
          setFocusedCellId(item.id);
        }}
        onFocus={() => setFocusedCellId(item.id)}
        className={`h-16 sm:h-20 p-1.5 rounded border transition-all flex flex-col items-center justify-between group relative cursor-pointer ${
          isFocused ? 'ring-2 ring-[#C94B3C] border-[#C94B3C] z-10' : ''
        } ${
          isLearned
            ? 'bg-white dark:bg-[#1E1E1E] border-[#D6D4CC] dark:border-[#383838] hover:border-[#C94B3C]'
            : 'bg-white/70 dark:bg-[#1A1A1A]/70 border-[#E8E6E0] dark:border-[#2A2A2A] hover:border-[#999]'
        }`}
        title={`${item.kana} (${item.romaji}) — Press Enter to inspect`}
      >
        {/* Subtle indicator dot */}
        {isLearned && (
          <span
            className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
              isReview ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        )}

        <span className="text-xl sm:text-2xl font-kana text-[#202020] dark:text-[#F0EFEB] group-hover:scale-105 transition-transform">
          {item.kana}
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-[#737373] dark:text-[#999]">
          {item.romaji}
        </span>
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Top Controls: Script + Category */}
      <div className="space-y-4 border-b border-[#E5E4DE] dark:border-[#262626] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#202020] dark:text-[#F0EFEB]">
              Interactive Kana Chart
            </h1>
            <p className="text-xs text-[#737373] dark:text-[#888] mt-0.5">
              Traditional 5-vowel column gojūon reference. Navigate cells with Arrow keys & Enter.
            </p>
          </div>

          {/* Script Filter */}
          <div className="inline-flex rounded border border-[#E5E4DE] dark:border-[#333] p-1 bg-white dark:bg-[#1E1E1E] self-start sm:self-auto">
            <button
              onClick={() => setSelectedScript('hiragana')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                selectedScript === 'hiragana'
                  ? 'bg-[#C94B3C] text-white'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              Hiragana
            </button>
            <button
              onClick={() => setSelectedScript('katakana')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                selectedScript === 'katakana'
                  ? 'bg-[#C94B3C] text-white'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              Katakana
            </button>
            <button
              onClick={() => setSelectedScript('both')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                selectedScript === 'both'
                  ? 'bg-[#C94B3C] text-white'
                  : 'text-[#666] dark:text-[#AAA]'
              }`}
            >
              Both
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {(
            [
              { id: 'basic', label: 'Basic (46)' },
              { id: 'dakuten', label: 'Dakuten (20)' },
              { id: 'handakuten', label: 'Handakuten (5)' },
              { id: 'combinations', label: 'Combinations (36)' },
              { id: 'extended', label: 'Extended Katakana (24)' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCategoryTab(tab.id);
                setFocusedCellId(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                categoryTab === tab.id
                  ? 'bg-[#202020] dark:bg-[#EAE8E1] text-white dark:text-[#151515] border-transparent font-bold'
                  : 'bg-white dark:bg-[#1E1E1E] text-[#666] dark:text-[#AAA] border-[#E5E4DE] dark:border-[#333] hover:text-[#202020]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-8">
        {(selectedScript === 'both' ? ['hiragana', 'katakana'] : [selectedScript]).map((script) => {
          if (categoryTab === 'extended' && script === 'hiragana') {
            return null; // Extended is Katakana only
          }

          return (
            <div key={script} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold capitalize font-serif text-[#202020] dark:text-[#F0EFEB]">
                  {script} {categoryTab === 'basic' ? 'Basic Gojūon' : categoryTab}
                </h2>
                <span className="text-xs font-kana text-[#737373]">
                  {script === 'hiragana' ? 'ひらがな' : 'カタカナ'}
                </span>
              </div>

              {categoryTab === 'extended' ? (
                /* Extended Katakana View */
                <div className="space-y-6">
                  {extendedGroups.map((group) => (
                    <div key={group.title} className="space-y-2">
                      <div className="text-xs font-mono font-semibold uppercase text-[#737373]">
                        {group.title}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {group.items.map((fullId) => {
                          const item = kanaMap.get(fullId);
                          if (!item) return null;
                          return renderCell(fullId.replace('k-', ''), 'katakana');
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : categoryTab === 'combinations' ? (
                /* Yōon Combinations Grid (YA, YU, YO) */
                <div className="overflow-x-auto">
                  <div className="min-w-[420px] space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans font-semibold text-[#737373] pb-1 border-b border-[#E5E4DE] dark:border-[#262626]">
                      <div className="text-left pl-2 font-mono">Row</div>
                      <div>YA <span className="font-kana text-[11px]">(ゃ/ャ)</span></div>
                      <div>YU <span className="font-kana text-[11px]">(ゅ/ュ)</span></div>
                      <div>YO <span className="font-kana text-[11px]">(ょ/ョ)</span></div>
                    </div>

                    {combinationRowDefs.map((row) => (
                      <div key={row.rowKey} className="grid grid-cols-4 gap-2 items-center">
                        <div className="text-xs font-mono font-bold text-[#737373] pl-2">
                          {row.label}
                        </div>
                        {row.ids.map((id, idx) => (
                          <div key={idx}>
                            {renderCell(id, script as KanaScript)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Standard 5-column Gojūon Grid (A, I, U, E, O) */
                <div className="overflow-x-auto">
                  <div className="min-w-[480px] space-y-2">
                    {/* Header Columns */}
                    <div className="grid grid-cols-6 gap-2 text-center text-xs font-sans font-semibold text-[#737373] pb-1 border-b border-[#E5E4DE] dark:border-[#262626]">
                      <div className="text-left pl-2 font-mono">Row</div>
                      <div>A <span className="font-kana text-[11px]">(あ/ア)</span></div>
                      <div>I <span className="font-kana text-[11px]">(い/イ)</span></div>
                      <div>U <span className="font-kana text-[11px]">(う/ウ)</span></div>
                      <div>E <span className="font-kana text-[11px]">(え/エ)</span></div>
                      <div>O <span className="font-kana text-[11px]">(お/オ)</span></div>
                    </div>

                    {(categoryTab === 'basic'
                      ? basicRowDefs
                      : categoryTab === 'dakuten'
                      ? dakutenRowDefs
                      : handakutenRowDefs
                    ).map((row) => {
                      const validIds = row.ids
                        .filter((id): id is string => id !== null)
                        .map(id => `${script === 'hiragana' ? 'h' : 'k'}-${id}`);

                      return (
                        <div key={row.rowKey} className="grid grid-cols-6 gap-2 items-center">
                          <div className="flex items-center gap-1 pl-2">
                            <span className="text-xs font-mono font-bold text-[#737373]">
                              {row.label}
                            </span>
                            {onDrillKana && validIds.length > 0 && (
                              <button
                                onClick={() => onDrillKana(validIds)}
                                title={`Drill ${row.label} row (${validIds.length} cards)`}
                                className="p-1 text-[#888] hover:text-[#C94B3C] rounded hover:bg-[#F2F0E8] dark:hover:bg-[#282828] cursor-pointer"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                              </button>
                            )}
                          </div>
                          {row.ids.map((id, idx) => (
                            <div key={idx}>
                              {renderCell(id, script as KanaScript)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Character Details Modal */}
      {activeModalKana && (
        <KanaDetailModal
          kana={activeModalKana}
          storedData={storedCards.get(activeModalKana.id)}
          onClose={() => setActiveModalKana(null)}
          enableAudio={enableAudio}
          onSelectKana={(id) => {
            const item = kanaMap.get(id);
            if (item) setActiveModalKana(item);
          }}
          onRefreshData={onRefreshData}
        />
      )}
    </div>
  );
};
