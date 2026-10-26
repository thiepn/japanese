import React, { useState, useRef } from 'react';
import type { UserSettings } from '../types/kana';
import { X, Download, Upload, Trash2, Volume2, Check, AlertTriangle } from 'lucide-react';
import { exportProgressJSON, importProgressJSON, resetAllProgress } from '../services/storage';
import { playKanaAudio } from '../services/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onRefreshData
}) => {
  const [current, setCurrent] = useState<UserSettings>(settings);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSettingChange = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...current, [key]: value };
    setCurrent(updated);
    await onSaveSettings(updated);
  };

  const handleExport = async () => {
    try {
      const json = await exportProgressJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `kana-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importProgressJSON(text);
      if (res.success) {
        setImportStatus({ message: res.message, isError: false });
        await onRefreshData();
      } else {
        setImportStatus({ message: res.message, isError: true });
      }
    } catch {
      setImportStatus({ message: 'Failed to read backup file.', isError: true });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmReset = async () => {
    await resetAllProgress();
    await onRefreshData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-md border border-[#E5E4DE] dark:border-[#2E2E2E] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E4DE] dark:border-[#262626]">
          <h2 className="text-base font-serif font-bold text-[#202020] dark:text-[#F0EFEB]">
            Settings & Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737373] hover:text-[#202020] dark:hover:text-white rounded hover:bg-[#F2F0E8] dark:hover:bg-[#282828] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Theme selection */}
          <div className="space-y-2">
            <label className="font-mono uppercase font-bold text-[#737373] block text-[10px]">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'light', label: 'Light' },
                  { id: 'dark', label: 'Dark' },
                  { id: 'system', label: 'System' }
                ] as const
              ).map(th => (
                <button
                  key={th.id}
                  onClick={() => handleSettingChange('theme', th.id)}
                  className={`py-2 rounded border text-center font-medium transition-colors cursor-pointer ${
                    current.theme === th.id
                      ? 'bg-[#202020] text-white dark:bg-white dark:text-black border-transparent font-bold'
                      : 'border-[#DDD] dark:border-[#333] hover:bg-[#F7F6F2] dark:hover:bg-[#282828]'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily New Limit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-mono uppercase font-bold text-[#737373] block text-[10px]">
                Daily New Cards Limit
              </label>
              <span className="font-mono font-bold text-[#202020] dark:text-[#F0EFEB]">
                {current.dailyNewLimit} cards / day
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map(limit => (
                <button
                  key={limit}
                  onClick={() => handleSettingChange('dailyNewLimit', limit)}
                  className={`py-1.5 rounded border text-center font-mono font-medium transition-colors cursor-pointer ${
                    current.dailyNewLimit === limit
                      ? 'bg-[#C94B3C] text-white border-transparent font-bold'
                      : 'border-[#DDD] dark:border-[#333] hover:bg-[#F7F6F2] dark:hover:bg-[#282828]'
                  }`}
                >
                  {limit}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Script */}
          <div className="space-y-2">
            <label className="font-mono uppercase font-bold text-[#737373] block text-[10px]">
              Preferred Review Deck
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'hiragana', label: 'Hiragana' },
                  { id: 'katakana', label: 'Katakana' },
                  { id: 'both', label: 'Both' }
                ] as const
              ).map(sc => (
                <button
                  key={sc.id}
                  onClick={() => handleSettingChange('preferredScript', sc.id)}
                  className={`py-2 rounded border text-center font-medium transition-colors cursor-pointer ${
                    current.preferredScript === sc.id
                      ? 'bg-[#202020] text-white dark:bg-white dark:text-black border-transparent font-bold'
                      : 'border-[#DDD] dark:border-[#333] hover:bg-[#F7F6F2] dark:hover:bg-[#282828]'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio toggle & test */}
          <div className="space-y-2 pt-2 border-t border-[#E5E4DE] dark:border-[#262626]">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold block text-[#202020] dark:text-[#F0EFEB]">
                  Native Pronunciation Audio
                </span>
                <span className="text-[#737373] text-[11px]">
                  Uses browser Japanese Web Speech API
                </span>
              </div>
              <button
                onClick={() => handleSettingChange('enableAudio', !current.enableAudio)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  current.enableAudio ? 'bg-[#C94B3C]' : 'bg-[#DDD] dark:bg-[#333]'
                }`}
                aria-label="Toggle audio"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    current.enableAudio ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {current.enableAudio && (
              <button
                onClick={() => playKanaAudio('あ')}
                className="mt-1 px-3 py-1 bg-[#F2F0E8] dark:bg-[#282828] rounded border border-[#E5E4DE] dark:border-[#333] text-[11px] font-medium flex items-center gap-1.5 hover:text-[#C94B3C] cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio (Plays "あ")</span>
              </button>
            )}
          </div>

          {/* Backup & Restore */}
          <div className="space-y-2 pt-2 border-t border-[#E5E4DE] dark:border-[#262626]">
            <span className="font-mono uppercase font-bold text-[#737373] block text-[10px]">
              Backup & Progress Migration
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 py-2 px-3 border border-[#DDD] dark:border-[#333] rounded hover:bg-[#F7F6F2] dark:hover:bg-[#282828] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Progress</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 border border-[#DDD] dark:border-[#333] rounded hover:bg-[#F7F6F2] dark:hover:bg-[#282828] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {importStatus && (
              <div
                className={`p-2 rounded text-[11px] ${
                  importStatus.isError
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                }`}
              >
                {importStatus.message}
              </div>
            )}
          </div>

          {/* Reset progress */}
          <div className="space-y-2 pt-2 border-t border-[#E5E4DE] dark:border-[#262626]">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2 px-3 border border-rose-200 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Learning Progress</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded space-y-2">
                <div className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Are you sure? This permanently deletes all your FSRS card states and review history.
                  </span>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 bg-white dark:bg-[#222] border border-[#DDD] dark:border-[#333] rounded text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F7F6F2] dark:bg-[#161616] border-t border-[#E5E4DE] dark:border-[#262626] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#202020] dark:bg-[#333] hover:bg-black text-white text-xs font-semibold rounded cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
