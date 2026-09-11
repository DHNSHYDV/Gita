import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Language } from '../types';
import { APP_SHARE_URL } from '../config/appConfig';

export interface VerseShareData {
  chapter: number;
  verse: number;
  sanskrit: string;
  regionalScriptShloka?: string;
  transliteration?: string;
  bhavartham: string;
  language: Language;
}

export { APP_SHARE_URL };

/**
 * Ensures Google fonts and Indian script webfonts are loaded before drawing to canvas.
 */
export async function ensureFontsLoaded(): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue even if font loading ready promise rejects
    }
  }
}

/**
 * Wraps text into lines based on canvas context maxWidth.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Returns appropriate font family for the regional language.
 */
function getRegionalFontFamily(lang: Language): string {
  switch (lang) {
    case 'te':
      return "'Noto Serif Telugu', 'Noto Sans Telugu', serif";
    case 'hi':
      return "'Noto Serif Devanagari', 'Noto Sans Devanagari', serif";
    case 'ta':
      return "'Noto Serif Tamil', 'Noto Sans Tamil', serif";
    case 'kn':
      return "'Noto Serif Kannada', 'Noto Sans Kannada', serif";
    case 'en':
    default:
      return "'Playfair Display', 'Cormorant Garamond', Georgia, serif";
  }
}

/**
 * Returns localized Bhavartham header label based on user's selected language.
 */
function getBhavarthamLabel(lang: Language): string {
  switch (lang) {
    case 'te':
      return 'భావార్థం';
    case 'hi':
      return 'भावार्थ';
    case 'kn':
      return 'ಭಾವಾರ್ಥ';
    case 'ta':
      return 'பொருளுரை';
    case 'en':
    default:
      return 'BHAVARTHAM';
  }
}

/**
 * Cleans Sanskrit text by removing trailing verse numbering tags (like ।।6.5।। or || 5 ||)
 * while preserving the sacred danda (। and ॥) punctuation.
 */
function cleanSanskritVerse(text: string): string {
  return text
    .replace(/[।॥]?\s*[\d\u0966-\u096F\u0C66-\u0C6F\u0CE6-\u0CEF\u0BE6-\u0BEF]+(\.[\d\u0966-\u096F\u0C66-\u0C6F\u0CE6-\u0CEF\u0BE6-\u0BEF]+)*\s*[।॥]?$/g, '')
    .trim();
}

/**
 * Generates a high-resolution 1080 x 1920 (9:16 vertical story format) "My Shloka Today" card canvas.
 * - Non-promotional, purely devotional.
 * - Dynamic fitting for all 700 verses.
 * - Exact Sanskrit Devanagari & Regional language script.
 * - Verified Bhavartham explanation.
 * - Zero in-image app links or ads.
 */
export function generateVerseCardCanvas(data: VerseShareData): HTMLCanvasElement {
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Warm Parchment Base Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#FAF5EC');
  bgGrad.addColorStop(0.35, '#F7F0E4');
  bgGrad.addColorStop(0.7, '#F3EAD9');
  bgGrad.addColorStop(1, '#ECE0CD');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Center Golden Radiance
  const centerRadial = ctx.createRadialGradient(
    width / 2,
    height * 0.48,
    50,
    width / 2,
    height * 0.48,
    700
  );
  centerRadial.addColorStop(0, 'rgba(238, 206, 142, 0.22)');
  centerRadial.addColorStop(0.5, 'rgba(238, 206, 142, 0.08)');
  centerRadial.addColorStop(1, 'rgba(238, 206, 142, 0)');
  ctx.fillStyle = centerRadial;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Sacred Motif Watermark (Lotus & Light Rays in background)
  ctx.save();
  ctx.translate(width / 2, height * 0.46);
  ctx.strokeStyle = 'rgba(184, 134, 45, 0.06)';
  ctx.fillStyle = 'rgba(184, 134, 45, 0.035)';
  ctx.lineWidth = 1.5;

  // Background Petals & Rays
  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(45, 140, 0, 260);
    ctx.quadraticCurveTo(-45, 140, 0, 0);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 3. Elegant Antique Borders & Corner Brackets
  const frameInset = 46;
  const innerInset = 58;

  // Outer Gold Border
  ctx.strokeStyle = 'rgba(184, 134, 45, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(frameInset, frameInset, width - frameInset * 2, height - frameInset * 2);

  // Inner Hairline Border
  ctx.strokeStyle = 'rgba(184, 134, 45, 0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(innerInset, innerInset, width - innerInset * 2, height - innerInset * 2);

  // Corner Accent Diamonds
  const drawCornerOrnament = (cx: number, cy: number) => {
    ctx.fillStyle = '#B8862D';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 9);
    ctx.lineTo(cx + 9, cy);
    ctx.lineTo(cx, cy + 9);
    ctx.lineTo(cx - 9, cy);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(184, 134, 45, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();
  };

  drawCornerOrnament(innerInset, innerInset);
  drawCornerOrnament(width - innerInset, innerInset);
  drawCornerOrnament(innerInset, height - innerInset);
  drawCornerOrnament(width - innerInset, height - innerInset);

  // 4. Content Formatting & Dynamic Layout Calculation
  const maxContentWidth = 860;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Prepare text contents
  const cleanedSanskrit = cleanSanskritVerse(data.sanskrit);
  const sanskritLinesRaw = cleanedSanskrit.split('\n').map((l) => l.trim()).filter(Boolean);

  // Regional Shloka Text:
  // For Telugu, Kannada, Tamil, use scriptShloka.
  // For English, use transliteration.
  // For Hindi, since Devanagari Sanskrit is already prominent, use transliteration or omit redundant script duplicate.
  let regionalShlokaText = '';
  if (data.language === 'te' || data.language === 'kn' || data.language === 'ta') {
    regionalShlokaText = cleanSanskritVerse(data.regionalScriptShloka || '');
  } else if (data.language === 'en') {
    regionalShlokaText = data.transliteration ? cleanSanskritVerse(data.transliteration) : '';
  } else if (data.language === 'hi') {
    // If Hindi, transliteration gives Roman pronunciation, or leave empty if identical
    regionalShlokaText = data.transliteration ? cleanSanskritVerse(data.transliteration) : '';
  }

  const regionalLinesRaw = regionalShlokaText
    ? regionalShlokaText.split('\n').map((l) => l.trim()).filter(Boolean)
    : [];

  const bhavarthamHeader = getBhavarthamLabel(data.language);
  const cleanExplanation = data.bhavartham.replace(/\s+/g, ' ').trim();

  // Dynamic Typography Sizing based on content density
  const totalChars =
    cleanedSanskrit.length +
    regionalShlokaText.length +
    cleanExplanation.length;

  let sanskritFontSize = 42;
  let sanskritLineHeight = 70;
  let regionalFontSize = 34;
  let regionalLineHeight = 56;
  let explanationFontSize = 32;
  let explanationLineHeight = 52;
  let sectionGap = 42;

  if (totalChars > 450) {
    sanskritFontSize = 36;
    sanskritLineHeight = 60;
    regionalFontSize = 30;
    regionalLineHeight = 50;
    explanationFontSize = 27;
    explanationLineHeight = 44;
    sectionGap = 32;
  } else if (totalChars > 320) {
    sanskritFontSize = 38;
    sanskritLineHeight = 64;
    regionalFontSize = 32;
    regionalLineHeight = 52;
    explanationFontSize = 29;
    explanationLineHeight = 48;
    sectionGap = 36;
  }

  // Pre-calculate wrapped lines
  // Sanskrit lines
  ctx.font = `bold ${sanskritFontSize}px 'Noto Serif Devanagari', 'Noto Sans Devanagari', Georgia, serif`;
  const wrappedSanskritLines: string[] = [];
  for (const raw of sanskritLinesRaw) {
    const wrapped = wrapText(ctx, raw, maxContentWidth);
    wrappedSanskritLines.push(...wrapped);
  }

  // Regional lines
  const regionalFont = getRegionalFontFamily(data.language);
  ctx.font = data.language === 'en'
    ? `italic 600 ${regionalFontSize}px 'Playfair Display', Georgia, serif`
    : `600 ${regionalFontSize}px ${regionalFont}`;
  const wrappedRegionalLines: string[] = [];
  for (const raw of regionalLinesRaw) {
    const wrapped = wrapText(ctx, raw, maxContentWidth);
    wrappedRegionalLines.push(...wrapped);
  }

  // Explanation lines
  ctx.font = `500 ${explanationFontSize}px ${regionalFont}`;
  const wrappedExplanationLines = wrapText(ctx, `"${cleanExplanation}"`, maxContentWidth);

  // Measure total vertical height of content block
  const sanskritBlockHeight = wrappedSanskritLines.length * sanskritLineHeight;
  const regionalBlockHeight = wrappedRegionalLines.length > 0
    ? wrappedRegionalLines.length * regionalLineHeight + sectionGap
    : 0;
  const explanationBlockHeight =
    40 + // Bhavartham label & spacing
    wrappedExplanationLines.length * explanationLineHeight;

  let totalContentHeight =
    sanskritBlockHeight +
    regionalBlockHeight +
    explanationBlockHeight +
    sectionGap * 2;

  // Safe area budget between Header (ends ~Y: 410) and Footer (starts ~Y: 1740)
  const availableContentArea = 1740 - 410; // ~1330px

  // Adaptive auto-fitting: if content exceeds available height, scale font sizes and re-wrap
  if (totalContentHeight > availableContentArea) {
    const scale = Math.max(0.72, (availableContentArea - 20) / totalContentHeight);
    sanskritFontSize = Math.max(26, Math.floor(sanskritFontSize * scale));
    sanskritLineHeight = Math.max(42, Math.floor(sanskritLineHeight * scale));
    regionalFontSize = Math.max(24, Math.floor(regionalFontSize * scale));
    regionalLineHeight = Math.max(38, Math.floor(regionalLineHeight * scale));
    explanationFontSize = Math.max(22, Math.floor(explanationFontSize * scale));
    explanationLineHeight = Math.max(34, Math.floor(explanationLineHeight * scale));
    sectionGap = Math.max(20, Math.floor(sectionGap * scale));

    wrappedSanskritLines.length = 0;
    ctx.font = `bold ${sanskritFontSize}px 'Noto Serif Devanagari', 'Noto Sans Devanagari', Georgia, serif`;
    for (const raw of sanskritLinesRaw) {
      wrappedSanskritLines.push(...wrapText(ctx, raw, maxContentWidth));
    }

    wrappedRegionalLines.length = 0;
    ctx.font = data.language === 'en'
      ? `italic 600 ${regionalFontSize}px 'Playfair Display', Georgia, serif`
      : `600 ${regionalFontSize}px ${regionalFont}`;
    for (const raw of regionalLinesRaw) {
      wrappedRegionalLines.push(...wrapText(ctx, raw, maxContentWidth));
    }

    ctx.font = `500 ${explanationFontSize}px ${regionalFont}`;
    wrappedExplanationLines.length = 0;
    wrappedExplanationLines.push(...wrapText(ctx, `"${cleanExplanation}"`, maxContentWidth));

    const newSanskritBlockHeight = wrappedSanskritLines.length * sanskritLineHeight;
    const newRegionalBlockHeight = wrappedRegionalLines.length > 0
      ? wrappedRegionalLines.length * regionalLineHeight + sectionGap
      : 0;
    const newExplanationBlockHeight = 36 + wrappedExplanationLines.length * explanationLineHeight;
    totalContentHeight = newSanskritBlockHeight + newRegionalBlockHeight + newExplanationBlockHeight + sectionGap * 2;
  }

  let contentStartY = 410 + Math.max(20, (availableContentArea - totalContentHeight) / 2);
  if (contentStartY + totalContentHeight > 1730) {
    contentStartY = Math.max(380, 1730 - totalContentHeight);
  }

  // 5. TOP SECTION: Header, Title & Chapter/Verse Pill
  const headerY = 210;

  // Small Elegant Om Medallion
  ctx.fillStyle = 'rgba(184, 134, 45, 0.12)';
  ctx.beginPath();
  ctx.arc(width / 2, headerY, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(184, 134, 45, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Om symbol in gold
  ctx.font = "bold 38px 'Noto Serif Devanagari', serif";
  ctx.fillStyle = '#91631F';
  ctx.fillText('ॐ', width / 2, headerY + 2);

  // Main Title: "MY SHLOKA TODAY"
  ctx.font = "700 34px 'Cinzel', 'Playfair Display', Georgia, serif";
  ctx.letterSpacing = '8px';
  ctx.fillStyle = '#6E491A';
  ctx.fillText('MY SHLOKA TODAY', width / 2, headerY + 84);
  ctx.letterSpacing = '0px';

  // Subtitle: Dynamic Chapter & Verse
  const pillY = headerY + 140;
  const badgeText = `CHAPTER ${data.chapter} • VERSE ${data.verse}`;
  ctx.font = "600 20px 'Cinzel', 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = '3px';
  const badgeWidth = ctx.measureText(badgeText).width + 48;

  // Capsule Badge
  ctx.fillStyle = 'rgba(184, 134, 45, 0.1)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - badgeWidth / 2, pillY - 18, badgeWidth, 36, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(184, 134, 45, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = '#6A4616';
  ctx.fillText(badgeText, width / 2, pillY + 1);
  ctx.letterSpacing = '0px';

  // Decorative Top Divider
  const topDivY = pillY + 48;
  ctx.strokeStyle = 'rgba(184, 134, 45, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 160, topDivY);
  ctx.lineTo(width / 2 - 30, topDivY);
  ctx.moveTo(width / 2 + 30, topDivY);
  ctx.lineTo(width / 2 + 160, topDivY);
  ctx.stroke();

  ctx.font = '18px serif';
  ctx.fillStyle = '#B8862D';
  ctx.fillText('❖', width / 2, topDivY);

  // 6. SANSKRIT SECTION (Centerpiece)
  let curY = Math.max(contentStartY, topDivY + 50);

  ctx.font = `bold ${sanskritFontSize}px 'Noto Serif Devanagari', 'Noto Sans Devanagari', Georgia, serif`;
  ctx.fillStyle = '#221810';

  for (const line of wrappedSanskritLines) {
    ctx.fillText(line, width / 2, curY);
    curY += sanskritLineHeight;
  }

  // Divider between Sanskrit & Regional
  curY += Math.floor(sectionGap * 0.6);
  ctx.strokeStyle = 'rgba(184, 134, 45, 0.28)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, curY);
  ctx.lineTo(width / 2 - 20, curY);
  ctx.moveTo(width / 2 + 20, curY);
  ctx.lineTo(width / 2 + 120, curY);
  ctx.stroke();

  ctx.fillStyle = '#B8862D';
  ctx.beginPath();
  ctx.arc(width / 2, curY, 3, 0, Math.PI * 2);
  ctx.fill();

  curY += Math.floor(sectionGap * 0.8);

  // 7. REGIONAL LANGUAGE SECTION (e.g. Telugu script rendering)
  if (wrappedRegionalLines.length > 0) {
    ctx.font = data.language === 'en'
      ? `italic 600 ${regionalFontSize}px 'Playfair Display', Georgia, serif`
      : `600 ${regionalFontSize}px ${regionalFont}`;
    ctx.fillStyle = '#3E2A1C';

    for (const line of wrappedRegionalLines) {
      ctx.fillText(line, width / 2, curY);
      curY += regionalLineHeight;
    }

    curY += Math.floor(sectionGap * 0.6);
  }

  // 8. BHAVARTHAM / EXPLANATION SECTION
  // Heading: "— భావార్థం —"
  ctx.font = `bold 22px ${regionalFont}`;
  ctx.fillStyle = '#8F611E';
  ctx.letterSpacing = '2px';
  ctx.fillText(`— ${bhavarthamHeader} —`, width / 2, curY);
  ctx.letterSpacing = '0px';
  curY += 46;

  // Explanation Text
  ctx.font = `500 ${explanationFontSize}px ${regionalFont}`;
  ctx.fillStyle = '#38271A';

  for (const line of wrappedExplanationLines) {
    ctx.fillText(line, width / 2, curY);
    curY += explanationLineHeight;
  }

  // 9. FOOTER SECTION: Minimal Devotional Branding (NO ADS, NO STORE LINKS)
  const footerY = height - 130;

  // Bottom ornamental accent line
  ctx.strokeStyle = 'rgba(184, 134, 45, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 100, footerY - 45);
  ctx.lineTo(width / 2 + 100, footerY - 45);
  ctx.stroke();

  // Gita Logo & Brand Name
  ctx.font = "bold 26px 'Cinzel', Georgia, serif";
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#6E491A';
  ctx.fillText('🕉️ Gita', width / 2, footerY - 14);
  ctx.letterSpacing = '0px';

  // Subtle Devotional Line
  ctx.font = "500 18px 'Cinzel', 'Plus Jakarta Sans', sans-serif";
  ctx.letterSpacing = '4px';
  ctx.fillStyle = '#8C755A';
  ctx.fillText('READ • REFLECT • GROW', width / 2, footerY + 22);
  ctx.letterSpacing = '0px';

  return canvas;
}

/**
 * Convert canvas to Blob
 */
export async function generateVerseCardBlob(
  data: VerseShareData
): Promise<Blob> {
  await ensureFontsLoaded();
  const canvas = generateVerseCardCanvas(data);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate image blob from canvas'));
      },
      'image/png',
      0.95
    );
  });
}

/**
 * Convert canvas to Data URL for direct preview & base64 transmission
 */
export async function generateVerseCardDataUrl(
  data: VerseShareData
): Promise<string> {
  await ensureFontsLoaded();
  const canvas = generateVerseCardCanvas(data);
  return canvas.toDataURL('image/png', 0.95);
}

/**
 * Format minimal, non-promotional caption text for WhatsApp Status & Social Sharing.
 * Associates the Gita application landing URL without printing raw URLs onto the devotional image.
 */
export function formatStatusCaption(data: VerseShareData): string {
  return (
    `My Shloka Today 🙏\n\n` +
    `Bhagavad Gita Chapter ${data.chapter}, Verse ${data.verse}\n\n` +
    `${APP_SHARE_URL}`
  );
}

declare global {
  interface Window {
    NativeShareBridge?: {
      isAvailable: () => boolean;
      isWhatsAppInstalled?: () => boolean;
      requestStoragePermissions?: () => void;
      shareToWhatsApp: (base64Image: string, filename: string, caption: string) => boolean;
      saveImageToGallery: (base64Image: string, filename: string) => boolean;
    };
  }
}

/**
 * Checks if WhatsApp is installed/available on the device.
 */
export function isWhatsAppAvailable(): boolean {
  if (typeof window !== 'undefined' && window.NativeShareBridge?.isWhatsAppInstalled) {
    try {
      return window.NativeShareBridge.isWhatsAppInstalled();
    } catch {
      return true;
    }
  }
  return true;
}

/**
 * Native & Universal Share handler that guarantees sharing as an IMAGE CARD (never text-only).
 */
export async function shareToStatusOrStory(
  data: VerseShareData
): Promise<{
  success: boolean;
  method: 'whatsapp-direct' | 'native' | 'web-files' | 'downloaded';
  message?: string;
}> {
  const caption = formatStatusCaption(data);
  const title = `Bhagavad Gita ${data.chapter}.${data.verse}`;
  const filename = `Gita_Chapter_${data.chapter}_Verse_${data.verse}.png`;

  // 1. Direct WhatsApp Status via NativeBridge
  if (typeof window !== 'undefined' && window.NativeShareBridge?.isAvailable?.()) {
    try {
      const dataUrl = await generateVerseCardDataUrl(data);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

      // Also save to phone gallery in background for convenience
      try {
        window.NativeShareBridge.saveImageToGallery?.(base64Data, filename);
      } catch {
        // Non-fatal
      }

      const ok = window.NativeShareBridge.shareToWhatsApp(base64Data, filename, caption);
      if (ok) {
        return { success: true, method: 'whatsapp-direct' };
      }
    } catch (bridgeErr) {
      console.warn('NativeShareBridge WhatsApp error:', bridgeErr);
    }
  }

  // 2. Try Native Capacitor Share (attaches file to Android Share sheet)
  if (Capacitor.isNativePlatform()) {
    try {
      const dataUrl = await generateVerseCardDataUrl(data);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache,
      });

      if (savedFile && savedFile.uri) {
        await Share.share({
          title,
          text: caption,
          files: [savedFile.uri],
          dialogTitle: 'Share to WhatsApp Status & Story',
        });
        return { success: true, method: 'native' };
      }
    } catch (nativeErr: unknown) {
      if (
        (nativeErr as Error)?.name === 'AbortError' ||
        (nativeErr as Error)?.message?.toLowerCase().includes('cancel')
      ) {
        return { success: true, method: 'native' };
      }
      console.warn('Native Share fallback to web/download:', nativeErr);
    }
  }

  // 3. Try Web Share API Level 2 (files support in modern mobile browsers)
  try {
    const blob = await generateVerseCardBlob(data);
    const file = new File([blob], filename, { type: 'image/png' });

    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] }) &&
      navigator.share
    ) {
      await navigator.share({
        title,
        text: caption,
        files: [file],
      });
      return { success: true, method: 'web-files' };
    }
  } catch (webErr: unknown) {
    if ((webErr as Error)?.name === 'AbortError') {
      return { success: true, method: 'web-files' };
    }
    console.warn('Web file share unavailable:', webErr);
  }

  // 4. Fallback: Auto-save high-res card to gallery/downloads & copy caption
  try {
    await downloadVerseCardImage(data);
  } catch (dlErr) {
    console.warn('Auto download error:', dlErr);
  }

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(caption);
    }
  } catch {
    // Ignore clipboard error
  }

  return { success: true, method: 'downloaded' };
}

/**
 * Direct download / save of the card image directly to Gallery / Photos.
 */
export async function downloadVerseCardImage(data: VerseShareData): Promise<void> {
  const filename = `Gita_Chapter_${data.chapter}_Verse_${data.verse}.png`;

  // Try direct native MediaStore save to Photos/Gallery (Pictures/Gita)
  if (typeof window !== 'undefined' && window.NativeShareBridge?.isAvailable?.()) {
    try {
      const dataUrl = await generateVerseCardDataUrl(data);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const saved = window.NativeShareBridge.saveImageToGallery(base64Data, filename);
      if (saved) {
        return;
      }
    } catch (err) {
      console.warn('Native gallery save fallback to blob download:', err);
    }
  }

  // Web / PWA fallback download
  const blob = await generateVerseCardBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
