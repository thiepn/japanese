let japaneseVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function findJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Look for explicit Japanese voice
  const jaVoice = voices.find((v) => {
    const lang = (v.lang || '').toLowerCase();
    return lang === 'ja-jp' || lang === 'ja_jp' || lang.startsWith('ja');
  });

  if (jaVoice) return jaVoice;

  // 2. Check for voice name containing Japanese or Nihongo
  const namedVoice = voices.find((v) => {
    const name = (v.name || '').toLowerCase();
    return name.includes('japan') || name.includes('nihon') || name.includes('kyoko') || name.includes('otoya');
  });

  return namedVoice || null;
}

export function initSpeech(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  japaneseVoice = findJapaneseVoice();
  voicesLoaded = true;

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      japaneseVoice = findJapaneseVoice();
      voicesLoaded = true;
    };
  }
}

export function isJapaneseSpeechSupported(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return true;
}

export function playKanaAudio(text: string, volume: number = 0.8): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      if (!japaneseVoice) {
        japaneseVoice = findJapaneseVoice();
      }
      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85; // slightly slower for clear kana articulation
      utterance.volume = Math.max(0, Math.min(1, volume));

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve(false);
    }
  });
}
