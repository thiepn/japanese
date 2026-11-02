import { describe, expect, it, vi } from 'vitest';
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
  it('does not crash without browser DOM globals', () => {
    expect(shouldOpenKanaShortcuts(key(null),false)).toBe(true);
  });
  it('rejects editable descendants using real selector matching semantics', () => {
    const previous = globalThis.Element;
    class FakeElement {
      constructor(private readonly selectors: string[]) {}
      closest(selector: string): FakeElement | null {
        return selector.split(',').some(s => this.selectors.includes(s.trim())) ? this : null;
      }
    }
    vi.stubGlobal('Element', FakeElement);
    try {
      for (const selector of ['input','textarea','select','[contenteditable]','[role="textbox"]']) {
        expect(shouldOpenKanaShortcuts(key(new FakeElement([selector]) as unknown as EventTarget),false)).toBe(false);
      }
      expect(shouldOpenKanaShortcuts(key(new FakeElement([]) as unknown as EventTarget),false)).toBe(true);
    } finally {
      if (previous === undefined) vi.unstubAllGlobals();
      else vi.stubGlobal('Element', previous);
    }
  });
});
