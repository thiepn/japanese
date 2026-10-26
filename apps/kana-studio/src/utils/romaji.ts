import { kanaMap } from '../data/kanaData';

/**
 * Normalizes user input for matching romaji answers.
 * Removes leading/trailing whitespace, converts to lowercase,
 * strips excess spaces, and normalizes unicode.
 */
export function normalizeInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\s\-_]+/g, '');
}

/**
 * Check if the user's typed input matches a kana item.
 */
export function checkAnswer(
  kanaId: string,
  rawInput: string
): { isCorrect: boolean; canonical: string; userClean: string; allowedAnswers: string[] } {
  const item = kanaMap.get(kanaId);
  const userClean = normalizeInput(rawInput);

  if (!item) {
    return { isCorrect: false, canonical: '', userClean, allowedAnswers: [] };
  }

  // Blank answer is never correct
  if (!userClean) {
    return {
      isCorrect: false,
      canonical: item.romaji,
      userClean,
      allowedAnswers: [item.romaji, ...(item.aliases || [])]
    };
  }

  const allowed = new Set<string>();
  allowed.add(normalizeInput(item.romaji));

  if (item.aliases) {
    for (const alias of item.aliases) {
      allowed.add(normalizeInput(alias));
    }
  }

  // Check specific systemic phonetic equivalencies
  const canon = item.romaji;
  if (canon === 'shi') allowed.add('si');
  if (canon === 'chi') allowed.add('ti');
  if (canon === 'tsu') allowed.add('tu');
  if (canon === 'fu') allowed.add('hu');
  if (canon === 'ji') { allowed.add('zi'); allowed.add('dji'); }
  if (canon === 'zu') { allowed.add('dzu'); allowed.add('du'); }
  if (canon === 'wo') allowed.add('o');
  if (canon === 'n') allowed.add('nn');
  if (canon === 'sha') { allowed.add('sya'); }
  if (canon === 'shu') { allowed.add('syu'); }
  if (canon === 'sho') { allowed.add('syo'); }
  if (canon === 'cha') { allowed.add('tya'); }
  if (canon === 'chu') { allowed.add('tyu'); }
  if (canon === 'cho') { allowed.add('tyo'); }
  if (canon === 'ja') { allowed.add('jya'); allowed.add('zya'); }
  if (canon === 'ju') { allowed.add('jyu'); allowed.add('zyu'); }
  if (canon === 'jo') { allowed.add('jyo'); allowed.add('zyo'); }

  const isCorrect = allowed.has(userClean);

  return {
    isCorrect,
    canonical: item.romaji,
    userClean,
    allowedAnswers: Array.from(allowed)
  };
}
