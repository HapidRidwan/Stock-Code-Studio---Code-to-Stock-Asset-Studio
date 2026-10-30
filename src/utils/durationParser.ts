/**
 * Auto-detect animation duration from canvas window object and source code patterns.
 * Adobe Stock Standard & Deterministic Frame Synchronizer.
 */
export function detectAnimationDuration(
  jsCode?: string,
  canvasWindow?: Window | null
): number {
  // 1. Inspect iframe/window global variables first
  if (canvasWindow) {
    try {
      const win = canvasWindow as any;
      const winVal = win.ANIMATION_DURATION ?? win.DURATION ?? win.duration;
      if (typeof winVal === 'number' && !isNaN(winVal) && winVal > 0) {
        return winVal;
      }
      if (typeof winVal === 'string') {
        const parsed = parseFloat(winVal);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore cross-origin / iframe initialisation errors
    }
  }

  // 2. Fallback regex scanning user source code string
  if (jsCode) {
    const patterns = [
      // const DURATION = X; or let ANIMATION_DURATION = X;
      /(?:const|let|var)\s+ANIMATION_DURATION\s*=\s*([0-9]+(?:\.[0-9]+)?)/i,
      /(?:const|let|var)\s+DURATION\s*=\s*([0-9]+(?:\.[0-9]+)?)/i,
      // window.ANIMATION_DURATION = X; or window.DURATION = X;
      /(?:window\.)?(?:ANIMATION_DURATION|DURATION)\s*=\s*([0-9]+(?:\.[0-9]+)?)/i,
      // duration: X (object property pattern)
      /\bduration\s*:\s*([0-9]+(?:\.[0-9]+)?)/i,
      // Generic variable duration = X;
      /(?:const|let|var)\s+duration\s*=\s*([0-9]+(?:\.[0-9]+)?)/i,
    ];

    for (const pattern of patterns) {
      const match = jsCode.match(pattern);
      if (match && match[1]) {
        const val = parseFloat(match[1]);
        if (!isNaN(val) && val > 0) {
          return val;
        }
      }
    }
  }

  // 3. Absolute fallback default duration: 10.0 seconds
  return 10.0;
}
