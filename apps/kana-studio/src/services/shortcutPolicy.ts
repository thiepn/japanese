/** Kana owns '?' only in its standalone view; Japanese owns embedded shortcuts. */
export function shouldOpenKanaShortcuts(
  event: Pick<KeyboardEvent, 'key' | 'altKey' | 'ctrlKey' | 'metaKey' | 'target'>,
  embedded: boolean
): boolean {
  if (embedded || event.key !== '?' || event.altKey || event.ctrlKey || event.metaKey) return false;
  const target = event.target;
  if (typeof Element === 'undefined' || !(target instanceof Element)) return true;
  return !target.closest('input, textarea, select, [contenteditable], [role="textbox"]');
}
