import { describe, expect, it } from 'vitest';
import { kanaStudioUrl } from '../apps/web/src/kanaHandoff';
import { renderKanaLegacyRedirect, resolveKanaPublicBase } from '../scripts/copy-kana-studio.mjs';

describe('Kana legacy route on separate app origins', () => {
  it('preserves the existing GitHub Pages /japanese/ mount', () => {
    expect(kanaStudioUrl('review', '/japanese/')).toBe('/japanese/kana/?view=review');
    const html = renderKanaLegacyRedirect('/japanese/');
    expect(html).toContain('var base="/japanese/"');
    expect(html).toContain('href="/japanese/"');
    expect(html).toContain('location.replace(base+"?kana=resume&kanaView="');
  });
  it('keeps the Cloudflare root deployment on the same origin and base path', () => {
    expect(kanaStudioUrl('review', '/')).toBe('/kana/?view=review');
    expect(kanaStudioUrl('home', '/')).toBe('/kana/');
    const html = renderKanaLegacyRedirect('/');
    expect(html).toContain('var base="/"');
    expect(html).toContain('href="/"');
    expect(html).not.toContain('url=/japanese/');
  });
  it('retains only the five safe legacy view IDs and refuses injected bases', () => {
    const html = renderKanaLegacyRedirect('/');
    expect(html).toContain('["home","learn","review","words","chart"]');
    for (const base of ['//evil.example/', '/japanese/?x=', 'javascript:alert(1)', '/<script>/', 'japanese/']) {
      expect(() => resolveKanaPublicBase(base)).toThrow('KANA_PUBLIC_BASE_INVALID');
      expect(() => renderKanaLegacyRedirect(base)).toThrow('KANA_PUBLIC_BASE_INVALID');
      expect(() => kanaStudioUrl('home', base)).toThrow('KANA_PUBLIC_BASE_INVALID');
    }
  });
});
