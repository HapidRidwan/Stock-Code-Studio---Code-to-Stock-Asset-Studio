import React, { useRef, useEffect } from 'react';
import { BackgroundStyle } from '../types';

interface MainCanvasProps {
  width: number;
  height: number;
  html: string;
  css: string;
  js: string;
  externalScripts: string[];
  externalStyles: string[];
  backgroundStyle: BackgroundStyle;
  customBgColor: string;
  zoom: number;
  previewContainerRef: React.RefObject<HTMLDivElement>;
  artboardContentRef: React.RefObject<HTMLDivElement>;
  isPlaying: boolean;
  speed: number;
  onConsoleError: (err: string) => void;
  onDurationDetected?: (duration: number) => void;
}

export const MainCanvas: React.FC<MainCanvasProps> = ({
  width,
  height,
  html,
  css,
  js,
  externalScripts,
  externalStyles,
  backgroundStyle,
  customBgColor,
  zoom,
  previewContainerRef,
  artboardContentRef,
  isPlaying,
  speed,
  onConsoleError,
  onDurationDetected
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Background style calculation
  const getBackgroundClass = () => {
    switch (backgroundStyle) {
      case 'transparent': return 'checkerboard-clean';
      case 'checkerboard-dark': return 'checkerboard-clean';
      case 'checkerboard-light': return 'checkerboard-clean';
      case 'solid-white': return 'bg-white';
      case 'solid-black': return 'bg-[#18181B]';
      case 'solid-dark': return 'bg-[#18181B]';
      case 'custom': return '';
    }
  };

  const getBackgroundColor = () => {
    if (backgroundStyle === 'solid-white') return '#ffffff';
    if (backgroundStyle === 'solid-black' || backgroundStyle === 'solid-dark') return '#18181B';
    if (backgroundStyle === 'custom') return customBgColor;
    return 'transparent';
  };

  // Compile sandboxed HTML with playback & speed control
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${externalStyles.map(s => `<link rel="stylesheet" href="${s}">`).join('\n')}
        <style>
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
            background: ${getBackgroundColor()};
            ${!isPlaying ? 'animation-play-state: paused !important;' : ''}
          }
          * {
            ${!isPlaying ? 'animation-play-state: paused !important;' : ''}
          }
          ${css}
        </style>
        ${externalScripts.map(s => `<script src="${s}"></script>`).join('\n')}
      </head>
      <body>
        <div id="artboard-root" style="width: ${width}px; height: ${height}px; position: relative;">
          ${html}
        </div>
        <script>
          window.onerror = function(msg, url, lineNo) {
            window.parent.postMessage({ type: 'CONSOLE_ERROR', error: msg + ' (Line ' + lineNo + ')' }, '*');
            return false;
          };
          window.__PLAYING__ = ${isPlaying};
          window.__SPEED__ = ${speed};
          window.isExporting = false;
          try {
            ${js}
            // Notify parent of detected animation duration if defined
            var detectedDur = window.ANIMATION_DURATION || window.DURATION;
            if (typeof detectedDur === 'number' && !isNaN(detectedDur) && detectedDur > 0) {
              window.parent.postMessage({ type: 'ANIMATION_DURATION_DETECTED', duration: detectedDur }, '*');
            }
          } catch (e) {
            window.parent.postMessage({ type: 'CONSOLE_ERROR', error: e.toString() }, '*');
          }
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CONSOLE_ERROR') {
        onConsoleError(e.data.error);
      } else if (e.data && e.data.type === 'ANIMATION_DURATION_DETECTED') {
        if (typeof e.data.duration === 'number' && onDurationDetected) {
          onDurationDetected(e.data.duration);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleError, onDurationDetected]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden studio-dot-grid flex items-center justify-center p-2 sm:p-6 md:p-8 select-none"
    >
      {/* Centered Scaled Artboard Container */}
      <div 
        ref={previewContainerRef}
        className="transition-transform duration-100 ease-out relative"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* Actual Canvas with Soft Clean Shadow */}
        <div 
          ref={artboardContentRef}
          id="export-target"
          className={`relative w-full h-full canvas-shadow overflow-hidden rounded-md ${getBackgroundClass()}`}
          style={{
            backgroundColor: backgroundStyle === 'custom' ? customBgColor : undefined,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Canvas Workspace"
            className="w-full h-full border-0 pointer-events-auto"
            sandbox="allow-scripts allow-same-origin"
            style={{ width: `${width}px`, height: `${height}px` }}
          />
        </div>
      </div>
    </div>
  );
};
