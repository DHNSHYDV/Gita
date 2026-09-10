import { Verse } from '../types';
import allVersesData from './allVerses.json';

// All 701 verses of the Shreemad Bhagavad Gita
export const VERSES_DATA: Verse[] = allVersesData as Verse[];

// O(1) Quick Map for instantaneous verse retrieval by "chapter.verse"
const versesMap = new Map<string, Verse>();
for (const v of VERSES_DATA) {
  versesMap.set(`${v.chapterNumber}.${v.verseNumber}`, v);
}

// Landmark verses for quick highlights and curated suggestions
export const LANDMARK_VERSES: Verse[] = [
  versesMap.get("2.47")!,
  versesMap.get("4.7")!,
  versesMap.get("6.5")!,
  versesMap.get("9.22")!,
  versesMap.get("12.13")!,
  versesMap.get("18.66")!,
  versesMap.get("2.20")!,
].filter(Boolean);

/**
 * Retrieve any verse in the Bhagavad Gita (Chapters 1 to 18)
 * Returns the authentic verse from the 700-verse database.
 */
export function getVerse(chapterNumber: number, verseNumber: number): Verse {
  const key = `${chapterNumber}.${verseNumber}`;
  const found = versesMap.get(key);
  if (found) {
    return found;
  }
  // Safe fallback to first verse of the requested chapter, or 1.1
  const chapterFallback = versesMap.get(`${chapterNumber}.1`);
  if (chapterFallback) {
    return chapterFallback;
  }
  return VERSES_DATA[0];
}
