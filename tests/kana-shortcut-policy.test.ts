import { describe, expect, it } from 'vitest';
import { shouldOpenKanaShortcuts } from '../apps/kana-studio/src/services/shortcutPolicy';

const key = (target: EventTarget | null, extra: Record<string, unknown> = {}) =>
  ({ key: '?', altKey: false, ctrlKey: false, metaKey: false, target, ...extra }) as KeyboardEvent;

describe('Kana shortcut ownership', () => {
  it('never intercepts Japanese shell shortcuts in embedded mode', () => {
    expect(shouldOpenKanaShortcuts(key(null), true)).toBe(false);
    expect(shouldOpenKanaShortcuts(key(null, { key: 'Escape' }), true)).toBe(false);
  });
  it('accepts standalone unmodified ? but not modified or other keys', () => {
    expect(shouldOpenKanaShortcuts(key(null), false)).toBe(true);
    for (const extra of [{altKey:true},{ctrlKey:true},{metaKey:true},{key:'a'}]) {
      expect(shouldOpenKanaShortcuts(key(null,extra),false)).toBe(false);
    }
  });
  it('never intercepts editable fields or their descendants', () => {
    if (typeof document === 'undefined') return; // DOM case runs in browser tests
    for (const tag of ['input','textarea','select','div']) {
      const host = document.createElement(tag);
      if (tag === 'div') host.setAttribute('contenteditable','true');
      const child = document.createElement('span');
      host.append(child);
      expect(shouldOpenKanaShortcuts(key(child),false)).toBe(false);
    }
    const textbox = document.createElement('div');
    textbox.setAttribute('role','textbox');
    expect(shouldOpenKanaShortcuts(key(textbox),false)).toBe(false);
  });
});
