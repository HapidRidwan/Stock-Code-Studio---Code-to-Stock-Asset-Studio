export type ResolutionPresetId = 
  | 'adobe-min-4mp' 
  | 'adobe-standard-12mp' 
  | 'adobe-square-16mp' 
  | 'video-4k' 
  | 'video-fhd' 
  | 'video-vertical' 
  | 'custom';

export interface CanvasPreset {
  id: ResolutionPresetId;
  name: string;
  category: 'Image / Illustration' | 'Video & Animation' | 'Custom';
  width: number;
  height: number;
  aspectRatio: string;
  megapixels: number;
  description: string;
  badge?: string;
  recommendedFps?: number;
  recommendedDuration?: number;
}

export type CodeTab = 'html' | 'css' | 'js';

export interface ProjectState {
  html: string;
  css: string;
  js: string;
  externalScripts: string[];
  externalStyles: string[];
}

export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'mp4' | 'webm' | 'gif';

export type BackgroundStyle = 'transparent' | 'checkerboard-dark' | 'checkerboard-light' | 'solid-black' | 'solid-white' | 'solid-dark' | 'custom';

export interface ExportSettings {
  format: ExportFormat;
  scale: 1 | 2 | 3 | 4; // Super-sampling
  jpegQuality: number; // 0.1 - 1.0 (Adobe Stock standard is 1.0)
  fps: 24 | 30 | 60;
  duration: number; // seconds
  background: BackgroundStyle;
  customBgColor: string;
  filename: string;
  includeAlpha: boolean;
  canvasWindow?: Window | null;
}

export interface AdobeComplianceResult {
  isImageCompliant: boolean;
  isVideoCompliant: boolean;
  megapixels: number;
  isMegapixelCompliant: boolean;
  isVectorPure: boolean;
  vectorWarnings: string[];
  imageWarnings: string[];
  videoWarnings: string[];
  recommendations: string[];
  score: number; // 0 - 100
  suggestedKeywords: string[];
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedCategory: string;
}

export interface RenderProgress {
  isRendering: boolean;
  percentage: number;
  currentFrame?: number;
  totalFrames?: number;
  stage: string;
  statusText: string;
  error?: string | null;
}
