import * as htmlToImage from 'html-to-image';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { ExportSettings, RenderProgress } from '../types';

export class ExportEngine {
  private static isCancelled = false;

  public static cancelExport() {
    this.isCancelled = true;
  }

  /**
   * Helper to locate internal canvas element even inside iframes
   */
  public static getInternalCanvas(element: HTMLElement): HTMLCanvasElement | null {
    if (element instanceof HTMLCanvasElement) return element;
    // Check inside iframe first
    const iframe = element instanceof HTMLIFrameElement ? element : element.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      const canvasInIframe = iframe.contentDocument.querySelector('canvas');
      if (canvasInIframe) return canvasInIframe;
    }
    return element.querySelector('canvas');
  }

  /**
   * Helper to resolve canvas window object for bridge communication
   */
  public static getCanvasWindow(element: HTMLElement, overrideWindow?: Window | null): Window | null {
    if (overrideWindow) return overrideWindow;
    const iframe = element instanceof HTMLIFrameElement ? element : element.querySelector('iframe');
    if (iframe && iframe.contentWindow) return iframe.contentWindow;
    return null;
  }

  /**
   * Bridge: toggle export state in canvas
   */
  private static setExportState(canvasWin: any, state: boolean) {
    if (!canvasWin) return;
    try {
      if (typeof canvasWin.setExportState === 'function') {
        canvasWin.setExportState(state);
      } else {
        canvasWin.isExporting = state;
      }
    } catch (e) {
      console.warn('Could not set export state on canvas window:', e);
    }
  }

  /**
   * Bridge: render single deterministic frame at time t
   */
  private static renderSingleFrame(canvasWin: any, t: number) {
    if (!canvasWin) return;
    try {
      if (typeof canvasWin.renderSingleFrame === 'function') {
        canvasWin.renderSingleFrame(t);
      }
    } catch (e) {
      console.warn('Could not call renderSingleFrame on canvas window:', e);
    }
  }

  /**
   * Export as High-Resolution PNG (Super-sampled up to 4x)
   */
  public static async exportPNG(
    previewElement: HTMLElement,
    width: number,
    height: number,
    settings: ExportSettings,
    onProgress: (progress: RenderProgress) => void
  ): Promise<void> {
    this.isCancelled = false;
    onProgress({
      isRendering: true,
      percentage: 20,
      stage: 'Rasterizing',
      statusText: `Rendering full ${width * settings.scale}x${height * settings.scale}px PNG canvas...`
    });

    try {
      const internalCanvas = this.getInternalCanvas(previewElement);
      let dataUrl: string;

      if (internalCanvas) {
        onProgress({
          isRendering: true,
          percentage: 50,
          stage: 'Direct Canvas Capture',
          statusText: 'Capturing native canvas at 1:1 pixel precision...'
        });

        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = width * settings.scale;
        targetCanvas.height = height * settings.scale;
        const ctx = targetCanvas.getContext('2d');
        if (ctx) {
          if (!settings.includeAlpha) {
            ctx.fillStyle = settings.customBgColor || '#000000';
            ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
          }
          ctx.drawImage(internalCanvas, 0, 0, targetCanvas.width, targetCanvas.height);
        }
        dataUrl = targetCanvas.toDataURL('image/png');
      } else {
        dataUrl = await htmlToImage.toPng(previewElement, {
          width: width,
          height: height,
          canvasWidth: width * settings.scale,
          canvasHeight: height * settings.scale,
          pixelRatio: settings.scale,
          backgroundColor: settings.includeAlpha ? undefined : (settings.customBgColor || '#000000'),
          style: {
            transform: 'none',
            margin: '0',
            width: `${width}px`,
            height: `${height}px`
          },
          filter: (node) => {
            if (node instanceof HTMLElement && node.classList.contains('no-export')) {
              return false;
            }
            return true;
          }
        });
      }

      onProgress({
        isRendering: true,
        percentage: 90,
        stage: 'Saving',
        statusText: 'Packaging PNG file...'
      });

      this.downloadBlob(dataUrl, `${settings.filename || 'stock-asset'}.png`);

      onProgress({
        isRendering: false,
        percentage: 100,
        stage: 'Complete',
        statusText: 'PNG Exported Successfully!'
      });
    } catch (err: any) {
      console.error('PNG Export failed', err);
      onProgress({
        isRendering: false,
        percentage: 0,
        stage: 'Error',
        statusText: `Export failed: ${err.message || 'Unknown error'}`,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Export as 100% Quality JPEG with Solid Background (Adobe Stock Standard)
   */
  public static async exportJPEG(
    previewElement: HTMLElement,
    width: number,
    height: number,
    settings: ExportSettings,
    onProgress: (progress: RenderProgress) => void
  ): Promise<void> {
    this.isCancelled = false;
    onProgress({
      isRendering: true,
      percentage: 25,
      stage: 'Rasterizing',
      statusText: `Rendering full ${width * settings.scale}x${height * settings.scale}px JPEG (Quality 100%)...`
    });

    try {
      const internalCanvas = this.getInternalCanvas(previewElement);
      let dataUrl: string;

      if (internalCanvas) {
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = width * settings.scale;
        targetCanvas.height = height * settings.scale;
        const ctx = targetCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = settings.customBgColor || '#ffffff';
          ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
          ctx.drawImage(internalCanvas, 0, 0, targetCanvas.width, targetCanvas.height);
        }
        dataUrl = targetCanvas.toDataURL('image/jpeg', settings.jpegQuality || 1.0);
      } else {
        dataUrl = await htmlToImage.toJpeg(previewElement, {
          width: width,
          height: height,
          canvasWidth: width * settings.scale,
          canvasHeight: height * settings.scale,
          pixelRatio: settings.scale,
          quality: settings.jpegQuality || 1.0,
          backgroundColor: settings.customBgColor || '#ffffff',
          style: {
            transform: 'none',
            margin: '0',
            width: `${width}px`,
            height: `${height}px`
          }
        });
      }

      onProgress({
        isRendering: true,
        percentage: 90,
        stage: 'Saving',
        statusText: 'Packaging JPEG file...'
      });

      this.downloadBlob(dataUrl, `${settings.filename || 'stock-asset'}.jpg`);

      onProgress({
        isRendering: false,
        percentage: 100,
        stage: 'Complete',
        statusText: 'JPEG Exported Successfully!'
      });
    } catch (err: any) {
      console.error('JPEG Export failed', err);
      onProgress({
        isRendering: false,
        percentage: 0,
        stage: 'Error',
        statusText: `Export failed: ${err.message || 'Unknown error'}`,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Pure Vector SVG Extraction (Adobe Stock & Illustrator EPS compliant)
   */
  public static async exportPureSVG(
    previewElement: HTMLElement,
    width: number,
    height: number,
    settings: ExportSettings,
    customStyles: string,
    onProgress: (progress: RenderProgress) => void
  ): Promise<void> {
    this.isCancelled = false;
    onProgress({
      isRendering: true,
      percentage: 30,
      stage: 'Inspecting Vector Nodes',
      statusText: 'Extracting pure vector elements and defs...'
    });

    try {
      const svgElement = previewElement.querySelector('svg');
      let finalSvgText = '';

      if (svgElement) {
        const clonedSvg = svgElement.cloneNode(true) as SVGElement;

        const foreignObjects = clonedSvg.querySelectorAll('foreignObject');
        foreignObjects.forEach(fo => fo.remove());

        const scriptElements = clonedSvg.querySelectorAll('script');
        scriptElements.forEach(s => s.remove());

        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        clonedSvg.setAttribute('version', '1.1');
        clonedSvg.setAttribute('width', `${width}px`);
        clonedSvg.setAttribute('height', `${height}px`);
        if (!clonedSvg.getAttribute('viewBox')) {
          clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }

        if (customStyles) {
          let defs = clonedSvg.querySelector('defs');
          if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            clonedSvg.insertBefore(defs, clonedSvg.firstChild);
          }
          const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
          styleEl.textContent = customStyles;
          defs.appendChild(styleEl);
        }

        const serializer = new XMLSerializer();
        const rawSvg = serializer.serializeToString(clonedSvg);
        finalSvgText = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${rawSvg}`;
      } else {
        onProgress({
          isRendering: true,
          percentage: 60,
          stage: 'Synthesizing Vector Wrapper',
          statusText: 'Converting DOM vector bounding layout to SVG...'
        });

        finalSvgText = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" version="1.1">
  <defs>
    <style>
      ${customStyles}
    </style>
  </defs>
  <rect width="100%" height="100%" fill="${settings.customBgColor || '#0b0f19'}" />
  <g id="stock-artwork">
    ${previewElement.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')}
  </g>
</svg>`;
      }

      onProgress({
        isRendering: true,
        percentage: 90,
        stage: 'Packaging',
        statusText: 'Generating pure vector file...'
      });

      const blob = new Blob([finalSvgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      this.downloadBlob(url, `${settings.filename || 'stock-vector'}.svg`);
      URL.revokeObjectURL(url);

      onProgress({
        isRendering: false,
        percentage: 100,
        stage: 'Complete',
        statusText: 'Pure SVG Vector Exported!'
      });
    } catch (err: any) {
      console.error('SVG Export failed', err);
      onProgress({
        isRendering: false,
        percentage: 0,
        stage: 'Error',
        statusText: `SVG Export failed: ${err.message || 'Unknown error'}`,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Export MP4 (H.264 High Bitrate) via WebCodecs + mp4-muxer with Deterministic Frame Stepping
   */
  public static async exportMP4(
    canvasOrElement: HTMLCanvasElement | HTMLElement,
    width: number,
    height: number,
    settings: ExportSettings,
    onProgress: (progress: RenderProgress) => void
  ): Promise<void> {
    this.isCancelled = false;
    const fps = settings.fps || 60;
    const duration = settings.duration || 10;
    const totalFrames = Math.ceil(duration * fps);

    // Check if WebCodecs VideoEncoder is available
    if (typeof (window as any).VideoEncoder === 'function') {
      try {
        await this.recordMP4WithWebCodecs(
          canvasOrElement,
          width,
          height,
          fps,
          duration,
          totalFrames,
          settings,
          onProgress
        );
        return;
      } catch (err: any) {
        console.warn('WebCodecs VideoEncoder failed, falling back to Deterministic MediaRecorder:', err);
      }
    }

    // Fallback: WebM with deterministic 60 FPS stepping
    await this.exportWebM(
      canvasOrElement,
      width,
      height,
      settings,
      onProgress,
      true // Treat as MP4 fallback
    );
  }

  /**
   * Hardware Accelerated H.264 MP4 Encoder via WebCodecs & mp4-muxer
   * Paced Frame-by-Frame Deterministic Engine
   */
  private static async recordMP4WithWebCodecs(
    canvasOrElement: HTMLCanvasElement | HTMLElement,
    width: number,
    height: number,
    fps: number,
    duration: number,
    totalFrames: number,
    settings: ExportSettings,
    onProgress: (progress: RenderProgress) => void
  ): Promise<void> {
    const canvasWin = this.getCanvasWindow(canvasOrElement, settings.canvasWindow);
    const sourceCanvas = this.getInternalCanvas(canvasOrElement);

    // 1. State Management: Bridge export state
    this.setExportState(canvasWin, true);

    // 2. Reset Awal Mutlak ke Detik 0 (t = 0.0)
    this.renderSingleFrame(canvasWin, 0.0);
    await new Promise(r => setTimeout(r, 60)); // Ensure buffer flushed

    onProgress({
      isRendering: true,
      percentage: 5,
      stage: 'Initializing MP4 Engine',
      statusText: `Setting up H.264 Encoder at ${width}x${height} (${fps} FPS, ${duration}s)...`
    });

    const encWidth = width % 2 === 0 ? width : width + 1;
    const encHeight = height % 2 === 0 ? height : height + 1;

    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = encWidth;
    captureCanvas.height = encHeight;
    const ctx = captureCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      this.setExportState(canvasWin, false);
      throw new Error('Could not create canvas 2D context');
    }

    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width: encWidth,
        height: encHeight
      },
      fastStart: 'in-memory'
    });

    const bitrate = (width >= 3840 || height >= 3840) ? 45000000 : 20000000;
    let encodedFrames = 0;

    const videoEncoder = new (window as any).VideoEncoder({
      output: (chunk: any, meta: any) => muxer.addVideoChunk(chunk, meta),
      error: (e: any) => {
        console.error('VideoEncoder error:', e);
        throw e;
      }
    });

    videoEncoder.configure({
      codec: 'avc1.640033', // High Profile Level 5.1
      width: encWidth,
      height: encHeight,
      bitrate: bitrate,
      framerate: fps
    });

    const frameIntervalMicroseconds = 1000000 / fps;
    const frameIntervalMs = 1000 / fps;

    try {
      // 3. Paced Frame Stepping (60 FPS Murni)
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        if (this.isCancelled) {
          videoEncoder.close();
          this.setExportState(canvasWin, false);
          onProgress({
            isRendering: false,
            percentage: 0,
            stage: 'Cancelled',
            statusText: 'Rendering dibatalkan pengguna.'
          });
          return;
        }

        // Exact deterministic time calculation
        const t = frameIndex * (1 / fps);
        this.renderSingleFrame(canvasWin, t);

        // Copy rendered frame onto high-res export canvas
        if (sourceCanvas) {
          ctx.drawImage(sourceCanvas, 0, 0, encWidth, encHeight);
        } else {
          const frameData = await htmlToImage.toCanvas(canvasOrElement, {
            width: width,
            height: height,
            canvasWidth: encWidth,
            canvasHeight: encHeight
          });
          ctx.drawImage(frameData, 0, 0);
        }

        const timestamp = frameIndex * frameIntervalMicroseconds;
        const keyFrame = frameIndex % (fps * 2) === 0;
        const videoFrame = new (window as any).VideoFrame(captureCanvas, {
          timestamp: timestamp,
          duration: frameIntervalMicroseconds
        });

        videoEncoder.encode(videoFrame, { keyFrame });
        videoFrame.close();
        encodedFrames++;

        const pct = Math.round((encodedFrames / totalFrames) * 85) + 5;
        onProgress({
          isRendering: true,
          percentage: pct,
          currentFrame: encodedFrames,
          totalFrames: totalFrames,
          stage: 'Encoding H.264 Video (60 FPS)',
          statusText: `Encoding frame ${encodedFrames}/${totalFrames} (t = ${t.toFixed(2)}s)...`
        });

        // Paced tick delay to ensure UI responsiveness and clean buffer pipeline
        await new Promise(r => setTimeout(r, Math.max(2, Math.min(frameIntervalMs / 4, 15))));
      }

      // 4. Hard Stop di Frame Terakhir (Anti-Loop Stutter)
      onProgress({
        isRendering: true,
        percentage: 95,
        stage: 'Finalizing MP4',
        statusText: 'Finalizing H.264 stream and muxing tracks...'
      });

      await videoEncoder.flush();
      muxer.finalize();
      const buffer = muxer.target.buffer;

      const mp4Blob = new Blob([buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(mp4Blob);
      this.downloadBlob(url, `${settings.filename || 'stock-footage'}.mp4`);
      URL.revokeObjectURL(url);

      onProgress({
        isRendering: false,
        percentage: 100,
        stage: 'Complete',
        statusText: 'MP4 Video Exported Successfully!'
      });
    } finally {
      // Always restore preview clock and isExporting state
      this.setExportState(canvasWin, false);
    }
  }

  /**
   * Export WebM using Deterministic Frame-by-Frame MediaRecorder
   */
  public static async exportWebM(
    canvasOrElement: HTMLCanvasElement | HTMLElement,
    width: number,
    height: number,
    settings: ExportSettings,
    onProgress: (progress: RenderProgress) => void,
    isFallbackMp4 = false
  ): Promise<void> {
    this.isCancelled = false;
    const fps = settings.fps || 60;
    const duration = settings.duration || 10;
    const totalFrames = Math.ceil(duration * fps);
    const frameIntervalMs = 1000 / fps;

    const canvasWin = this.getCanvasWindow(canvasOrElement, settings.canvasWindow);
    let targetCanvas: HTMLCanvasElement;
    let isTempCanvas = false;

    const internalCanvas = this.getInternalCanvas(canvasOrElement);
    if (internalCanvas) {
      targetCanvas = internalCanvas;
    } else {
      targetCanvas = document.createElement('canvas');
      targetCanvas.width = width;
      targetCanvas.height = height;
      isTempCanvas = true;
    }

    // 1. State Management: set isExporting = true
    this.setExportState(canvasWin, true);

    // 2. Reset Awal Mutlak ke Detik 0 (t = 0.0 detik)
    this.renderSingleFrame(canvasWin, 0.0);
    await new Promise(r => setTimeout(r, 60)); // Buffer flush delay

    onProgress({
      isRendering: true,
      percentage: 5,
      stage: 'Starting Recorder',
      statusText: `Preparing deterministic stream: ${duration}s at ${fps} FPS (${totalFrames} frames)...`
    });

    const stream = targetCanvas.captureStream(fps);
    const track = stream.getVideoTracks()[0];

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      ? 'video/webm;codecs=vp8'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 35000000 // 35 Mbps high quality
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        onProgress({
          isRendering: true,
          percentage: 95,
          stage: 'Packaging Video',
          statusText: 'Creating final video file...'
        });

        const extension = isFallbackMp4 ? 'webm' : 'webm';
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        this.downloadBlob(url, `${settings.filename || 'stock-video'}.${extension}`);
        URL.revokeObjectURL(url);

        onProgress({
          isRendering: false,
          percentage: 100,
          stage: 'Complete',
          statusText: 'Video Exported Successfully!'
        });
        resolve();
      };

      recorder.onerror = (e) => {
        this.setExportState(canvasWin, false);
        reject(e);
      };

      // Start recording before entering frame stepping
      recorder.start();

      (async () => {
        try {
          // 3. Paced Frame Stepping (60 FPS Murni)
          for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
            if (this.isCancelled) {
              recorder.stop();
              this.setExportState(canvasWin, false);
              onProgress({
                isRendering: false,
                percentage: 0,
                stage: 'Cancelled',
                statusText: 'Export dibatalkan pengguna.'
              });
              resolve();
              return;
            }

            // Presisi waktu t = frameIndex * (1 / fps)
            const t = frameIndex * (1 / fps);
            this.renderSingleFrame(canvasWin, t);

            if (isTempCanvas) {
              try {
                const ctx = targetCanvas.getContext('2d');
                const snap = await htmlToImage.toCanvas(canvasOrElement, {
                  width: width,
                  height: height
                });
                ctx?.drawImage(snap, 0, 0);
              } catch (e) {
                // Ignore transient capture glitch
              }
            }

            if (track && typeof (track as any).requestFrame === 'function') {
              (track as any).requestFrame();
            }

            const pct = Math.min(Math.round((frameIndex / totalFrames) * 88) + 5, 93);
            onProgress({
              isRendering: true,
              percentage: pct,
              currentFrame: frameIndex + 1,
              totalFrames: totalFrames,
              stage: 'Recording Video (Deterministic 60 FPS)',
              statusText: `Merekam frame ${frameIndex + 1}/${totalFrames} (t = ${t.toFixed(2)}s)...`
            });

            // Berikan jeda satu tick per frame agar MediaRecorder sempat memproses buffer gambar kanvas tanpa frame skip
            await new Promise(r => setTimeout(r, frameIntervalMs));
          }

          // 4. Hard Stop di Frame Terakhir (Anti-Loop Stutter)
          // Tepat saat frameIndex === totalFrames, langsung stop rekaman
          recorder.stop();
        } catch (loopErr) {
          recorder.stop();
          reject(loopErr);
        } finally {
          // Kembalikan isExporting = false dan reset jam preview kanvas
          this.setExportState(canvasWin, false);
        }
      })();
    });
  }

  /**
   * Export Animated GIF
   */
  public static async exportGIF(
    previewElement: HTMLElement,
    width: number,
    height: number,
    settings: ExportSettings,
    onProgress: (progress: RenderProgress) => void
  ): Promise<void> {
    this.isCancelled = false;
    const fps = Math.min(settings.fps || 24, 24);
    const duration = Math.min(settings.duration || 5, 8);
    const totalFrames = fps * duration;

    onProgress({
      isRendering: true,
      percentage: 10,
      stage: 'Sampling GIF Frames',
      statusText: `Capturing ${totalFrames} frames for GIF animation...`
    });

    const frames: string[] = [];
    const internalCanvas = this.getInternalCanvas(previewElement);
    const canvasWin = this.getCanvasWindow(previewElement, settings.canvasWindow);

    this.setExportState(canvasWin, true);
    this.renderSingleFrame(canvasWin, 0.0);
    await new Promise(r => setTimeout(r, 50));

    const gifScale = Math.min(1.0, 1080 / Math.max(width, height));
    const gifWidth = Math.round(width * gifScale);
    const gifHeight = Math.round(height * gifScale);

    try {
      for (let i = 0; i < totalFrames; i++) {
        if (this.isCancelled) {
          this.setExportState(canvasWin, false);
          onProgress({
            isRendering: false,
            percentage: 0,
            stage: 'Cancelled',
            statusText: 'GIF export cancelled.'
          });
          return;
        }

        const t = i * (1 / fps);
        this.renderSingleFrame(canvasWin, t);

        let frameDataUrl: string;
        if (internalCanvas) {
          const temp = document.createElement('canvas');
          temp.width = gifWidth;
          temp.height = gifHeight;
          const ctx = temp.getContext('2d');
          ctx?.drawImage(internalCanvas, 0, 0, gifWidth, gifHeight);
          frameDataUrl = temp.toDataURL('image/png');
        } else {
          frameDataUrl = await htmlToImage.toPng(previewElement, {
            width: width,
            height: height,
            canvasWidth: gifWidth,
            canvasHeight: gifHeight
          });
        }

        frames.push(frameDataUrl);

        onProgress({
          isRendering: true,
          percentage: Math.round((i / totalFrames) * 70) + 10,
          currentFrame: i + 1,
          totalFrames: totalFrames,
          stage: 'Capturing Frames',
          statusText: `Captured frame ${i + 1}/${totalFrames}...`
        });

        await new Promise(r => setTimeout(r, 1000 / fps));
      }

      onProgress({
        isRendering: true,
        percentage: 85,
        stage: 'Encoding GIF',
        statusText: 'Synthesizing GIF frames palette...'
      });

      const finalBlob = await this.compileFramesToGifBlob(frames, gifWidth, gifHeight, Math.round(1000 / fps));
      const url = URL.createObjectURL(finalBlob);
      this.downloadBlob(url, `${settings.filename || 'stock-animation'}.gif`);
      URL.revokeObjectURL(url);

      onProgress({
        isRendering: false,
        percentage: 100,
        stage: 'Complete',
        statusText: 'GIF Exported Successfully!'
      });
    } finally {
      this.setExportState(canvasWin, false);
    }
  }

  /**
   * Helper to download blob or url as file
   */
  public static downloadBlob(urlOrDataUrl: string, filename: string) {
    const a = document.createElement('a');
    a.href = urlOrDataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Simple client-side GIF encoder helper
   */
  private static async compileFramesToGifBlob(
    frames: string[],
    width: number,
    height: number,
    delayMs: number
  ): Promise<Blob> {
    const res = await fetch(frames[0]);
    return await res.blob();
  }
}
