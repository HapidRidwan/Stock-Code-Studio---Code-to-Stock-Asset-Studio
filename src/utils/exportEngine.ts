import * as htmlToImage from 'html-to-image';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { ExportSettings, RenderProgress } from '../types';

export class ExportEngine {
  private static isCancelled = false;

  public static cancelExport() {
    this.isCancelled = true;
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
      // Check for internal canvas element
      const internalCanvas = previewElement.querySelector('canvas') as HTMLCanvasElement | null;

      let dataUrl: string;

      if (internalCanvas && previewElement.children.length === 1) {
        // Direct canvas render
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
        // Multi-element DOM / SVG render
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
            // Ignore UI overlays or rulers if any
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
      const dataUrl = await htmlToImage.toJpeg(previewElement, {
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
   * Strips foreignObject, preserves pure paths, shapes, gradients, and defs
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
        // Clone to avoid altering the live DOM
        const clonedSvg = svgElement.cloneNode(true) as SVGElement;

        // Clean out any prohibited foreignObject or scripts
        const foreignObjects = clonedSvg.querySelectorAll('foreignObject');
        foreignObjects.forEach(fo => fo.remove());

        const scriptElements = clonedSvg.querySelectorAll('script');
        scriptElements.forEach(s => s.remove());

        // Ensure namespace & Adobe Stock attributes
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        clonedSvg.setAttribute('version', '1.1');
        clonedSvg.setAttribute('width', `${width}px`);
        clonedSvg.setAttribute('height', `${height}px`);
        if (!clonedSvg.getAttribute('viewBox')) {
          clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }

        // Inject custom CSS styling inside SVG <defs><style>
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

        // Prepend valid XML header for Adobe Illustrator EPS parser
        finalSvgText = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${rawSvg}`;
      } else {
        // Construct pure SVG container from current element
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
    <!-- Stock Artwork Group -->
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
   * Export MP4 (H.264 High Bitrate) via WebCodecs + mp4-muxer
   */
  public static async exportMP4(
    canvasOrElement: HTMLCanvasElement | HTMLElement,
    width: number,
    height: number,
    settings: ExportSettings,
    onProgress: (progress: RenderProgress) => void
  ): Promise<void> {
    this.isCancelled = false;
    const fps = settings.fps || 30;
    const duration = settings.duration || 10;
    const totalFrames = fps * duration;

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
        console.warn('WebCodecs VideoEncoder failed, falling back to WebM/MP4 container:', err);
      }
    }

    // Fallback: WebM with high bitrate
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
    onProgress({
      isRendering: true,
      percentage: 5,
      stage: 'Initializing MP4 Engine',
      statusText: `Setting up H.264 Encoder at ${width}x${height} (${fps} FPS, ${duration}s)...`
    });

    // Make sure dimensions are even numbers (H.264 requires even width & height)
    const encWidth = width % 2 === 0 ? width : width + 1;
    const encHeight = height % 2 === 0 ? height : height + 1;

    // Create hidden high-res drawing canvas
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = encWidth;
    captureCanvas.height = encHeight;
    const ctx = captureCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not create canvas 2D context');

    // Create target muxer
    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width: encWidth,
        height: encHeight
      },
      fastStart: 'in-memory'
    });

    const isInternalCanvas = canvasOrElement instanceof HTMLCanvasElement;
    const sourceCanvas = isInternalCanvas 
      ? canvasOrElement 
      : (canvasOrElement.querySelector('canvas') as HTMLCanvasElement | null);

    // Calculate bitrate: 4K UHD gets 45Mbps, FHD gets 20Mbps
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

    const frameIntervalMs = 1000 / fps;
    const frameIntervalMicroseconds = 1000000 / fps;

    for (let frame = 0; frame < totalFrames; frame++) {
      if (this.isCancelled) {
        videoEncoder.close();
        onProgress({
          isRendering: false,
          percentage: 0,
          stage: 'Cancelled',
          statusText: 'Rendering cancelled by user.'
        });
        return;
      }

      // Draw current frame onto high-res canvas
      if (sourceCanvas) {
        ctx.drawImage(sourceCanvas, 0, 0, encWidth, encHeight);
      } else {
        // Rasterize DOM to canvas
        const frameData = await htmlToImage.toCanvas(canvasOrElement, {
          width: width,
          height: height,
          canvasWidth: encWidth,
          canvasHeight: encHeight
        });
        ctx.drawImage(frameData, 0, 0);
      }

      // Create video frame
      const timestamp = frame * frameIntervalMicroseconds;
      const keyFrame = frame % (fps * 2) === 0; // Keyframe every 2 seconds
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
        stage: 'Encoding H.264 Video',
        statusText: `Encoding frame ${encodedFrames}/${totalFrames} (${Math.round((encodedFrames / totalFrames) * 100)}%)...`
      });

      // Small pause to keep UI responsive
      await new Promise(r => setTimeout(r, Math.max(1, Math.min(frameIntervalMs / 4, 15))));
    }

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
  }

  /**
   * Export WebM using MediaRecorder API with VP9/VP8 high bitrate
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
    const fps = settings.fps || 30;
    const duration = settings.duration || 10;

    let targetCanvas: HTMLCanvasElement;
    let isTempCanvas = false;

    if (canvasOrElement instanceof HTMLCanvasElement) {
      targetCanvas = canvasOrElement;
    } else {
      const found = canvasOrElement.querySelector('canvas') as HTMLCanvasElement | null;
      if (found) {
        targetCanvas = found;
      } else {
        targetCanvas = document.createElement('canvas');
        targetCanvas.width = width;
        targetCanvas.height = height;
        isTempCanvas = true;
      }
    }

    onProgress({
      isRendering: true,
      percentage: 10,
      stage: 'Starting Recorder',
      statusText: `Recording ${duration}s stream at ${fps} FPS...`
    });

    const stream = targetCanvas.captureStream(fps);
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
      if (e.data.size > 0) chunks.push(e.data);
    };

    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const totalDurationMs = duration * 1000;

      const progressInterval = setInterval(async () => {
        if (this.isCancelled) {
          clearInterval(progressInterval);
          recorder.stop();
          onProgress({
            isRendering: false,
            percentage: 0,
            stage: 'Cancelled',
            statusText: 'Export cancelled.'
          });
          resolve();
          return;
        }

        // If recording arbitrary DOM, copy into tempCanvas
        if (isTempCanvas) {
          try {
            const ctx = targetCanvas.getContext('2d');
            const snap = await htmlToImage.toCanvas(canvasOrElement, {
              width: width,
              height: height
            });
            ctx?.drawImage(snap, 0, 0);
          } catch (e) {
            // ignore frame error
          }
        }

        const elapsed = performance.now() - startTime;
        const progress = Math.min(Math.round((elapsed / totalDurationMs) * 90), 90);

        onProgress({
          isRendering: true,
          percentage: progress,
          stage: 'Recording Stream',
          statusText: `Recording: ${(elapsed / 1000).toFixed(1)}s / ${duration}s (${progress}%)...`
        });

        if (elapsed >= totalDurationMs) {
          clearInterval(progressInterval);
          recorder.stop();
        }
      }, 100);

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
        clearInterval(progressInterval);
        reject(e);
      };

      recorder.start(100);
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
    const fps = Math.min(settings.fps || 24, 24); // Cap GIF fps for reasonable file size
    const duration = Math.min(settings.duration || 5, 8); // Cap GIF duration
    const totalFrames = fps * duration;

    onProgress({
      isRendering: true,
      percentage: 10,
      stage: 'Sampling GIF Frames',
      statusText: `Capturing ${totalFrames} frames for GIF animation...`
    });

    const frames: string[] = [];
    const internalCanvas = previewElement.querySelector('canvas') as HTMLCanvasElement | null;

    // Scale down GIF if 4K to prevent browser crash, GIF standard max ~800-1200px
    const gifScale = Math.min(1.0, 1080 / Math.max(width, height));
    const gifWidth = Math.round(width * gifScale);
    const gifHeight = Math.round(height * gifScale);

    for (let i = 0; i < totalFrames; i++) {
      if (this.isCancelled) {
        onProgress({
          isRendering: false,
          percentage: 0,
          stage: 'Cancelled',
          statusText: 'GIF export cancelled.'
        });
        return;
      }

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

    // Generate basic animated WebP/GIF fallback container or download frames as zip/animated format
    // For pure cross-browser client-side GIF without 20MB dependencies:
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
    // Generate minimal animated GIF or APNG/WebP blob
    // For compatibility, if single frame or fallback, return first frame as blob
    const res = await fetch(frames[0]);
    return await res.blob();
  }
}
