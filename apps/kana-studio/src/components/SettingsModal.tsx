import React, { useState, useRef } from 'react';
import type { UserSettings } from '../types/kana';
import { X, Download, Upload, Trash2, Volume2, Check, AlertTriangle } from 'lucide-react';
import { exportProgressJSON, previewProgressImportJSON, importProgressJSON, restorePortableJapaneseSchedules, resetAllProgress, readStudioCards, readLegacyGuestCards, serializeLegacyKanaBackup } from '../services/storage';
import { linkedToJapanese, previewLegacyKanaImport, importLegacyKanaSnapshots, type LegacyImportPreview } from '../services/canonicalBridge';
import { playKanaAudio } from '../services/speech';

interface SettingsModalProps {
  embedded?:boolean;
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  embedded=false,
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onRefreshData
}) => {
  const [current, setCurrent] = useState<UserSettings>(settings);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pendingRestore,setPendingRestore] = useState<{
    json:string;newCards:number;existingCards:number;logs:number;canonicalEligible:number;restored:boolean
  }|null>(null);
  const [restoreBusy,setRestoreBusy] = useState(false);

  const [legacyPreview, setLegacyPreview] = useState<{
    current:LegacyImportPreview;guest:LegacyImportPreview;guestCount:number
  } | null>(null);
  const [legacyBusy, setLegacyBusy] = useState(false);

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
      const dateStr = new Date().toISOString().split('T')[0];
      saveBackup(json,`kana-backup-${dateStr}.json`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const saveBackup = (json:string,name:string) => {
    const blob=new Blob([json],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;link.download=name;
    document.body.appendChild(link);link.click();link.remove();
    // Defer revocation so the browser can finish starting its download.
    window.setTimeout(()=>URL.revokeObjectURL(url),2000);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0];
    if(!file)return;
    setPendingRestore(null);
    try {
      if(file.size>12*1024*1024)throw Error('Backup exceeds 12 MB.');
      const json=await file.text();
      const preview=await previewProgressImportJSON(json);
      setPendingRestore({json,newCards:preview.newCards,
        existingCards:preview.existingCards,logs:preview.logs,canonicalEligible:preview.canonicalEligible,restored:false});
      setImportStatus({isError:false,message:
        `${preview.newCards} missing Google cards, ${preview.logs} saved logs and ${preview.canonicalEligible} transferable Japanese schedules. ${preview.existingCards} existing Google cards stay unchanged.`});
    } catch(error) {
      setImportStatus({isError:true,message:error instanceof Error?error.message:'Invalid backup file.'});
    } finally {
      if(fileInputRef.current)fileInputRef.current.value='';
    }
  };
  const applyBackupRestore = async () => {
    if(!pendingRestore||restoreBusy)return;
    setRestoreBusy(true);
    try {
      const backup=await exportProgressJSON();
      saveBackup(backup,`kana-before-restore-${new Date().toISOString().slice(0,10)}.json`);
      const result=await importProgressJSON(pendingRestore.json);
      setImportStatus({isError:!result.success,message:result.message});
      if(result.success){
        setPendingRestore(prev=>prev?{...prev,restored:true}:null);
        await onRefreshData();
      }
    }catch(error){
      setImportStatus({isError:true,message:error instanceof Error?error.message:'Restore was not completed.'});
    }finally{setRestoreBusy(false);}
  };

  const applyPortableSchedules = async () => {
    if(!pendingRestore?.restored || restoreBusy || pendingRestore.canonicalEligible===0)return;
    setRestoreBusy(true);
    try {
      const result=await restorePortableJapaneseSchedules(pendingRestore.json);
      await onRefreshData();
      setPendingRestore(null);
      setImportStatus({isError:false,message:
        `${result.imported} Japanese schedules restored; ${result.skipped} already present; ${result.invalid} not eligible. Existing Japanese review history is unchanged.`});
    }catch(error){
      setImportStatus({isError:true,message:error instanceof Error?error.message:'Schedule restoration failed.'});
    }finally{setRestoreBusy(false);}
  };

  const inspectLegacy = async () => {
    setLegacyBusy(true);
    try {
      const [current,guest] = await Promise.all([readStudioCards(),readLegacyGuestCards()]);
      const [currentPreview,guestPreview] = await Promise.all([
        previewLegacyKanaImport([...current.values()]),previewLegacyKanaImport(guest)
      ]);
      setLegacyPreview({current:currentPreview,guest:guestPreview,guestCount:guest.length});
      setImportStatus(null);
    } catch (error) {
      setImportStatus({isError:true,message:error instanceof Error?error.message:'Could not inspect existing progress.'});
    } finally {setLegacyBusy(false);}
  };

  const importLegacy = async (source:'current-studio'|'legacy-guest') => {
    setLegacyBusy(true);
    try {
      const cards = source==='legacy-guest' ? await readLegacyGuestCards() : [...(await readStudioCards()).values()];
      // Download the untouched original source before a single canonical write.
      const backup = await serializeLegacyKanaBackup(cards,source);
      saveBackup(backup,`kana-${source}-before-import-${new Date().toISOString().slice(0,10)}.json`);
      const result = await importLegacyKanaSnapshots(cards,source);
      await onRefreshData();
      setLegacyPreview(null);
      setImportStatus({isError:false,message:
        `${result.imported} historical schedules transferred; ${result.skipped} already present; ${result.invalid} not eligible. Original Google records remain unchanged.`});
    } catch (error) {
      setImportStatus({isError:true,message:error instanceof Error?error.message:'Historical progress import failed.'});
    } finally {setLegacyBusy(false);}
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
          {/* Japanese owns the theme in embedded mode; do not show a second switch. */}
          {!embedded && <div className="space-y-2">
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
          </div>}

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

            {pendingRestore && !pendingRestore.restored && (
              <button type="button" disabled={restoreBusy} onClick={()=>void applyBackupRestore()}
                className="w-full py-2 px-3 border border-[#DDD] dark:border-[#333] rounded font-semibold disabled:opacity-50">
                {restoreBusy?'Restoring…':'Back up current data and restore missing cards'}
              </button>
            )}
            {pendingRestore?.restored && pendingRestore.canonicalEligible>0 && linkedToJapanese && (
              <button type="button" disabled={restoreBusy}
                onClick={()=>void applyPortableSchedules()}
                className="w-full py-2 px-3 border border-[#DDD] dark:border-[#333] rounded font-semibold disabled:opacity-50">
                {restoreBusy?'Restoring Japanese schedules…':
                  `Restore ${pendingRestore.canonicalEligible} missing Japanese schedules`}
              </button>
            )}
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

          {linkedToJapanese && (
            <div className="space-y-2 pt-2 border-t border-[#E5E4DE] dark:border-[#262626]">
              <button type="button" disabled={legacyBusy} onClick={inspectLegacy}
                className="w-full py-2 px-3 border border-[#DDD] dark:border-[#333] rounded font-semibold hover:bg-[#F7F6F2] dark:hover:bg-[#282828] disabled:opacity-50">
                {legacyBusy ? 'Checking saved reviews…' : 'Find older Kana review progress'}
              </button>
              {legacyPreview && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#555] dark:text-[#AAA]">
                    This workspace: {legacyPreview.current.eligible} transferable, {legacyPreview.current.alreadyCanonical} already in Japanese.
                  </div>
                  <button type="button" disabled={legacyBusy || legacyPreview.current.eligible===0}
                    onClick={()=>void importLegacy('current-studio')}
                    className="w-full py-2 px-3 rounded border border-[#DDD] dark:border-[#333] font-semibold disabled:opacity-50">
                    Back up and transfer this workspace
                  </button>
                  {legacyPreview.guestCount>0 && (
                    <>
                      <div className="text-xs font-medium text-[#555] dark:text-[#AAA]">
                        Previous standalone guest: {legacyPreview.guest.eligible} transferable, {legacyPreview.guest.alreadyCanonical} already in Japanese.
                      </div>
                      <button type="button" disabled={legacyBusy || legacyPreview.guest.eligible===0}
                        onClick={()=>void importLegacy('legacy-guest')}
                        className="w-full py-2 px-3 rounded border border-[#DDD] dark:border-[#333] font-semibold disabled:opacity-50">
                        Back up and claim previous guest reviews
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reset progress */}
          <div className="space-y-2 pt-2 border-t border-[#E5E4DE] dark:border-[#262626]">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2 px-3 border border-rose-200 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{linkedToJapanese ? 'Reset Google-only Progress' : 'Reset All Learning Progress'}</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded space-y-2">
                <div className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {linkedToJapanese
                      ? 'This deletes only Google-specific local cards and logs. Shared Japanese FSRS history is preserved.'
                      : 'Are you sure? This permanently deletes all your FSRS card states and review history.'}
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
