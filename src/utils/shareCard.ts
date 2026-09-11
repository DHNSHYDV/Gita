import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Language } from '../types';

export interface VerseShareData {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration?: string;
  translation: string;
  language: Language;
}

export const DUMMY_DOWNLOAD_LINK = 'https://gita.app/download';

/**
 * Wraps text into lines based on canvas context maxWidth.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
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
 * Selects appropriate font family based on user language.
 */
function getFontFamily(lang: Language): string {
  switch (lang) {
    case 'te':
      return "'Noto Serif Telugu', 'Noto Sans Telugu', serif";
    case 'hi':
      return "'Noto Sans Devanagari', 'Noto Serif Devanagari', sans-serif";
    case 'ta':
      return "'Noto Serif Tamil', 'Noto Sans Tamil', sans-serif";
    case 'kn':
      return "'Noto Serif Kannada', 'Noto Sans Kannada', serif";
    case 'en':
    default:
      return "'Plus Jakarta Sans', 'Georgia', serif";
  }
}

/**
 * Generates a high-resolution 1080 x 1920 (9:16 vertical story format) card canvas.
 */
export function generateVerseCardCanvas(
  data: VerseShareData,
  isDark: boolean = false
): HTMLCanvasElement {
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (isDark) {
    bgGrad.addColorStop(0, '#161310');
    bgGrad.addColorStop(0.5, '#1E1914');
    bgGrad.addColorStop(1, '#110F0D');
  } else {
    bgGrad.addColorStop(0, '#FAF5EC');
    bgGrad.addColorStop(0.5, '#F5EDE0');
    bgGrad.addColorStop(1, '#ECE2D0');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Outer & Inner Decorative Borders
  const borderColor = isDark ? 'rgba(232, 197, 129, 0.35)' : 'rgba(197, 147, 65, 0.4)';
  const innerBorderColor = isDark ? 'rgba(232, 197, 129, 0.18)' : 'rgba(197, 147, 65, 0.2)';

  // Outer Border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Inner Border
  ctx.strokeStyle = innerBorderColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Corner Accent Diamonds
  const drawCornerDiamond = (cx: number, cy: number) => {
    ctx.fillStyle = isDark ? '#E8C581' : '#C59341';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx + 10, cy);
    ctx.lineTo(cx, cy + 10);
    ctx.lineTo(cx - 10, cy);
    ctx.closePath();
    ctx.fill();
  };
  drawCornerDiamond(60, 60);
  drawCornerDiamond(width - 60, 60);
  drawCornerDiamond(60, height - 60);
  drawCornerDiamond(width - 60, height - 60);

  // 3. Top Header: Om Medallion
  const headerY = 220;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Circular Om Medallion Background
  ctx.fillStyle = isDark ? 'rgba(232, 197, 129, 0.12)' : 'rgba(197, 147, 65, 0.12)';
  ctx.beginPath();
  ctx.arc(width / 2, headerY, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = isDark ? '#E8C581' : '#C59341';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Om symbol
  ctx.font = '54px serif';
  ctx.fillStyle = isDark ? '#E8C581' : '#A27222';
  ctx.fillText('🕉️', width / 2, headerY + 4);

  // App Title
  ctx.font = '600 32px Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = isDark ? '#E8C581' : '#8C6422';
  ctx.fillText('SHREEMAD BHAGAVAD GITA', width / 2, headerY + 115);
  ctx.letterSpacing = '0px';

  // Chapter & Verse Pill Badge
  const pillY = headerY + 185;
  const badgeText = `CHAPTER ${data.chapter} • VERSE ${data.verse}`;
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 50;

  ctx.fillStyle = isDark ? 'rgba(232, 197, 129, 0.18)' : 'rgba(197, 147, 65, 0.15)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - badgeWidth / 2, pillY - 22, badgeWidth, 44, 22);
  ctx.fill();
  ctx.strokeStyle = isDark ? 'rgba(232, 197, 129, 0.5)' : 'rgba(197, 147, 65, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = isDark ? '#F5E6CC' : '#6A4C1B';
  ctx.fillText(badgeText, width / 2, pillY);

  // 4. Sanskrit Shloka Box
  const contentWidth = width - 220; // 860px max width for reading comfort
  let currentY = headerY + 320;

  // Sanskrit Verses
  ctx.font = "bold 44px 'Noto Serif Devanagari', Georgia, serif";
  ctx.fillStyle = isDark ? '#FAF7F2' : '#231D17';

  // Clean and split Sanskrit verses by line or danda
  const sanskritLines = data.sanskrit.split('\n').map(l => l.trim()).filter(Boolean);
  for (const rawLine of sanskritLines) {
    const wrapped = wrapText(ctx, rawLine, contentWidth);
    for (const line of wrapped) {
      ctx.fillText(line, width / 2, currentY);
      currentY += 66;
    }
  }

  // Decorative Golden Divider Line with Lotus
  currentY += 40;
  ctx.strokeStyle = isDark ? 'rgba(232, 197, 129, 0.4)' : 'rgba(197, 147, 65, 0.35)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(width / 2 - 180, currentY);
  ctx.lineTo(width / 2 - 30, currentY);
  ctx.moveTo(width / 2 + 30, currentY);
  ctx.lineTo(width / 2 + 180, currentY);
  ctx.stroke();

  // Mini Center Motif
  ctx.font = '24px serif';
  ctx.fillStyle = isDark ? '#E8C581' : '#C59341';
  ctx.fillText('❖', width / 2, currentY + 1);

  currentY += 75;

  // 5. Regional Translation
  const langFont = getFontFamily(data.language);
  ctx.font = `italic 36px ${langFont}`;
  ctx.fillStyle = isDark ? '#D9CEBF' : '#45382B';

  const cleanTranslation = `"${data.translation.replace(/\n+/g, ' ').trim()}"`;
  const translationLines = wrapText(ctx, cleanTranslation, contentWidth);

  for (const tLine of translationLines) {
    ctx.fillText(tLine, width / 2, currentY);
    currentY += 58;
  }

  // 6. Bottom Brand Call-To-Action Box (Sticky at bottom 280px)
  const bottomBoxY = height - 290;
  const boxW = width - 180;
  const boxH = 150;
  const boxX = width / 2 - boxW / 2;

  // Glassmorphic Card Container
  ctx.fillStyle = isDark ? 'rgba(30, 24, 19, 0.9)' : 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.roundRect(boxX, bottomBoxY, boxW, boxH, 28);
  ctx.fill();

  ctx.strokeStyle = isDark ? 'rgba(232, 197, 129, 0.35)' : 'rgba(197, 147, 65, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // App Logo & Text
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillStyle = isDark ? '#E8C581' : '#8C6422';
  ctx.fillText('🕉️ Shreemad Bhagavad Gita App', width / 2, bottomBoxY + 45);

  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isDark ? '#B8ABA0' : '#6A5D4D';
  ctx.fillText('Read & Listen to all 700 Sacred Shlokas with Chanting', width / 2, bottomBoxY + 82);

  // Link highlight pill
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isDark ? '#F5E6CC' : '#A27222';
  ctx.fillText(`👉 Download Free: ${DUMMY_DOWNLOAD_LINK}`, width / 2, bottomBoxY + 118);

  // Return canvas element directly
  return canvas;
}

/**
 * Convert canvas to Blob
 */
export async function generateVerseCardBlob(
  data: VerseShareData,
  isDark: boolean = false
): Promise<Blob> {
  const canvas = generateVerseCardCanvas(data, isDark);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image blob from canvas'));
    }, 'image/png', 0.95);
  });
}

/**
 * Convert canvas to Data URL for direct image preview / base64 storage
 */
export function generateVerseCardDataUrl(
  data: VerseShareData,
  isDark: boolean = false
): string {
  const canvas = generateVerseCardCanvas(data, isDark);
  return canvas.toDataURL('image/png', 0.95);
}

/**
 * Format caption text for social sharing with clickable link.
 */
export function formatStatusCaption(data: VerseShareData): string {
  const shortTranslation =
    data.translation.length > 160
      ? data.translation.slice(0, 157) + '...'
      : data.translation;

  return (
    `🕉️ Shreemad Bhagavad Gita • Chapter ${data.chapter}, Verse ${data.verse}\n\n` +
    `${data.sanskrit.trim()}\n\n` +
    `"${shortTranslation}"\n\n` +
    `📖 Listen to authentic chanting & read all 700 verses on the Gita App:\n` +
    `👉 ${DUMMY_DOWNLOAD_LINK}`
  );
}

declare global {
  interface Window {
    NativeShareBridge?: {
      isAvailable: () => boolean;
      requestStoragePermissions?: () => void;
      shareToWhatsApp: (base64Image: string, filename: string, caption: string) => boolean;
      saveImageToGallery: (base64Image: string, filename: string) => boolean;
    };
  }
}

/**
 * Native & Universal Share handler that guarantees sharing as an IMAGE CARD (never text-only).
 */
export async function shareToStatusOrStory(
  data: VerseShareData,
  isDark: boolean = false
): Promise<{ success: boolean; method: 'whatsapp-direct' | 'native' | 'web-files' | 'downloaded' }> {
  const caption = formatStatusCaption(data);
  const title = `Bhagavad Gita ${data.chapter}.${data.verse}`;
  const filename = `gita_verse_${data.chapter}_${data.verse}.png`;

  // 1. Direct WhatsApp Status via NativeBridge (Opens WhatsApp immediately with the image attached!)
  if (typeof window !== 'undefined' && window.NativeShareBridge?.isAvailable?.()) {
    try {
      const dataUrl = generateVerseCardDataUrl(data, isDark);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const ok = window.NativeShareBridge.shareToWhatsApp(base64Data, filename, caption);
      if (ok) {
        return { success: true, method: 'whatsapp-direct' };
      }
    } catch (bridgeErr) {
      console.warn('NativeShareBridge WhatsApp error:', bridgeErr);
    }
  }

  // 2. Try Native Capacitor Share (Attaches actual image file to Android Share sheet)
  if (Capacitor.isNativePlatform()) {
    try {
      const dataUrl = generateVerseCardDataUrl(data, isDark);
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
      if ((nativeErr as Error)?.name === 'AbortError' || (nativeErr as Error)?.message?.toLowerCase().includes('cancel')) {
        return { success: true, method: 'native' };
      }
      console.warn('Native Share unavailable, attempting web/download fallback:', nativeErr);
    }
  }

  // 2. Try Web Share API Level 2 (files support in modern mobile browsers)
  try {
    const blob = await generateVerseCardBlob(data, isDark);
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

  // 3. Fallback: Auto-download the high-res card to phone gallery & copy caption
  // WE NEVER FALL BACK TO SHARING PLAIN TEXT! The user expects an image!
  try {
    await downloadVerseCardImage(data, isDark);
  } catch (dlErr) {
    console.warn('Auto download error:', dlErr);
  }

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(caption);
    }
  } catch {
    // Ignore clipboard errors
  }

  return { success: true, method: 'downloaded' };
}

/**
 * Direct download / save of the card image directly to Gallery / Photos.
 */
export async function downloadVerseCardImage(
  data: VerseShareData,
  isDark: boolean = false
): Promise<void> {
  const filename = `Bhagavad-Gita-${data.chapter}.${data.verse}.png`;

  // Try direct native MediaStore save to Photos/Gallery (Pictures/Gita)
  if (typeof window !== 'undefined' && window.NativeShareBridge?.isAvailable?.()) {
    try {
      const dataUrl = generateVerseCardDataUrl(data, isDark);
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
  const blob = await generateVerseCardBlob(data, isDark);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
