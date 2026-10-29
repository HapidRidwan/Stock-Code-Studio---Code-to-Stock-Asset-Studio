import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { MainCanvas } from './components/MainCanvas';
import { SlideOverDrawer } from './components/SlideOverDrawer';
import { FloatingBottomDock } from './components/FloatingBottomDock';
import { CleanExportModal } from './components/CleanExportModal';
import { CuratorGuideModal } from './components/CuratorGuideModal';
import { STARTER_TEMPLATES } from './constants/templates';
import { CANVAS_PRESETS } from './constants/presets';
import { 
  ResolutionPresetId, 
  BackgroundStyle, 
  ExportFormat, 
  ExportSettings, 
  RenderProgress 
} from './types';
import { analyzeAdobeStockCompliance } from './utils/adobeStockChecker';
import { ExportEngine } from './utils/exportEngine';

export const App: React.FC = () => {
  // Current Code State
  const [activeTemplateId, setActiveTemplateId] = useState<string>(STARTER_TEMPLATES[0].id);
  const [html, setHtml] = useState<string>(STARTER_TEMPLATES[0].html);
  const [css, setCss] = useState<string>(STARTER_TEMPLATES[0].css);
  const [js, setJs] = useState<string>(STARTER_TEMPLATES[0].js);

  // Injected External Scripts & Styles
  const [externalScripts, setExternalScripts] = useState<string[]>([]);
  const [externalStyles, setExternalStyles] = useState<string[]>([]);

  // Canvas Preset & Dimensions
  const [presetId, setPresetId] = useState<ResolutionPresetId>('adobe-min-4mp');
  const [customWidth, setCustomWidth] = useState<number>(2500);
  const [customHeight, setCustomHeight] = useState<number>(1600);

  // Background Settings
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('solid-white');
  const [customBgColor, setCustomBgColor] = useState<string>('#ffffff');

  // Playback & Speed Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);

  // Zoom & Viewport Auto-Fit
  const [zoom, setZoom] = useState<number>(0.3);
  const [autoFit, setAutoFit] = useState<boolean>(true);

  // UI Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isCuratorGuideOpen, setIsCuratorGuideOpen] = useState<boolean>(false);

  // Console Diagnostics
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);

  // Export Progress State
  const [renderProgress, setRenderProgress] = useState<RenderProgress>({
    isRendering: false,
    percentage: 0,
    stage: 'Siap',
    statusText: 'Siap untuk diekspor'
  });

  // Target DOM Refs for 1:1 High-Res Capture
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const artboardContentRef = useRef<HTMLDivElement>(null);

  // Active Dimensions
  const currentPreset = CANVAS_PRESETS.find(p => p.id === presetId) || CANVAS_PRESETS[0];
  const activeWidth = presetId === 'custom' ? customWidth : currentPreset.width;
  const activeHeight = presetId === 'custom' ? customHeight : currentPreset.height;
  const megapixels = Number(((activeWidth * activeHeight) / 1000000).toFixed(1));

  // Auto-fit calculation
  const calculateAutoFit = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const availableWidth = window.innerWidth - (isMobile ? 24 : 96);
    const availableHeight = window.innerHeight - (isMobile ? 130 : 170); // Header + Dock offset
    const scaleX = Math.max(0.01, availableWidth / activeWidth);
    const scaleY = Math.max(0.01, availableHeight / activeHeight);
    const fitScale = Math.min(scaleX, scaleY, 0.95);
    setZoom(Number(fitScale.toFixed(3)));
  }, [activeWidth, activeHeight]);

  useEffect(() => {
    if (autoFit) {
      calculateAutoFit();
    }
  }, [calculateAutoFit, autoFit]);

  useEffect(() => {
    const handleResize = () => {
      if (autoFit) calculateAutoFit();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [autoFit, calculateAutoFit]);

  // Real-time Adobe Stock Compliance Analysis
  const compliance = useMemo(() => {
    return analyzeAdobeStockCompliance(
      activeWidth,
      activeHeight,
      html,
      css,
      js,
      'png',
      10,
      30
    );
  }, [activeWidth, activeHeight, html, css, js]);

  // Handle Preset Selection
  const handleSelectPreset = (id: ResolutionPresetId) => {
    setPresetId(id);
    setAutoFit(true);
  };

  // Handle Template Selection
  const handleSelectTemplate = (templateId: string) => {
    const tmpl = STARTER_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;
    setActiveTemplateId(tmpl.id);
    setHtml(tmpl.html);
    setCss(tmpl.css);
    setJs(tmpl.js);

    // Set matching preset
    const recPreset = CANVAS_PRESETS.find(p => p.id === tmpl.recommendedPresetId);
    if (recPreset) {
      setPresetId(recPreset.id);
    }
    setAutoFit(true);
  };

  // Refresh sandbox view
  const handleApplyChanges = () => {
    setHtml(prev => prev + ' ');
    setTimeout(() => setHtml(prev => prev.trimEnd()), 30);
  };

  // Restart Animation
  const handleRestart = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  // Execute Export
  const handleExecuteExport = async (settings: ExportSettings) => {
    const artboardEl = artboardContentRef.current;
    if (!artboardEl) {
      alert('Kanvas belum siap untuk diekspor.');
      return;
    }

    try {
      if (settings.format === 'png') {
        await ExportEngine.exportPNG(
          artboardEl,
          activeWidth,
          activeHeight,
          settings,
          setRenderProgress
        );
      } else if (settings.format === 'jpeg') {
        await ExportEngine.exportJPEG(
          artboardEl,
          activeWidth,
          activeHeight,
          settings,
          setRenderProgress
        );
      } else if (settings.format === 'svg') {
        await ExportEngine.exportPureSVG(
          artboardEl,
          activeWidth,
          activeHeight,
          settings,
          css,
          setRenderProgress
        );
      } else if (settings.format === 'mp4') {
        await ExportEngine.exportMP4(
          artboardEl,
          activeWidth,
          activeHeight,
          settings,
          setRenderProgress
        );
      } else if (settings.format === 'webm') {
        await ExportEngine.exportWebM(
          artboardEl,
          activeWidth,
          activeHeight,
          settings,
          setRenderProgress
        );
      }
    } catch (err: any) {
      console.error('Export error caught:', err);
    }
  };

  return (
    <div className="w-full h-screen h-[100dvh] flex flex-col bg-[#F4F4F5] text-zinc-900 overflow-hidden font-sans select-none">
      {/* 1. Minimal Top Navbar */}
      <TopNavbar
        width={activeWidth}
        height={activeHeight}
        megapixels={megapixels}
        isCompliant={compliance.isMegapixelCompliant}
        zoom={zoom}
        autoFit={autoFit}
        onZoomIn={() => {
          setAutoFit(false);
          setZoom(prev => Math.min(Number((prev + 0.05).toFixed(2)), 2.5));
        }}
        onZoomOut={() => {
          setAutoFit(false);
          setZoom(prev => Math.max(Number((prev - 0.05).toFixed(2)), 0.05));
        }}
        onResetZoom={() => {
          setAutoFit(false);
          setZoom(1.0);
        }}
        onFit={() => {
          setAutoFit(true);
          calculateAutoFit();
        }}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenCuratorGuide={() => setIsCuratorGuideOpen(true)}
      />

      {/* 2. Main Canvas (80% Focus Screen) */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <MainCanvas
          width={activeWidth}
          height={activeHeight}
          html={html}
          css={css}
          js={js}
          externalScripts={externalScripts}
          externalStyles={externalStyles}
          backgroundStyle={backgroundStyle}
          customBgColor={customBgColor}
          zoom={zoom}
          previewContainerRef={previewContainerRef}
          artboardContentRef={artboardContentRef}
          isPlaying={isPlaying}
          speed={speed}
          onConsoleError={(err) => setConsoleErrors(prev => [err, ...prev.slice(0, 4)])}
        />

        {/* 3. Floating Bottom Dock (Ray.so / Figma Style) */}
        <FloatingBottomDock
          currentPresetId={presetId}
          onSelectPreset={handleSelectPreset}
          backgroundStyle={backgroundStyle}
          customBgColor={customBgColor}
          onChangeBackgroundStyle={setBackgroundStyle}
          onChangeCustomBgColor={setCustomBgColor}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onRestart={handleRestart}
          speed={speed}
          onChangeSpeed={setSpeed}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          isRendering={renderProgress.isRendering}
          renderingPercentage={renderProgress.percentage}
        />
      </main>

      {/* 4. Slide-Over Drawer for Code & Templates */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        html={html}
        css={css}
        js={js}
        externalScripts={externalScripts}
        externalStyles={externalStyles}
        onChangeHtml={setHtml}
        onChangeCss={setCss}
        onChangeJs={setJs}
        onSelectTemplate={handleSelectTemplate}
        activeTemplateId={activeTemplateId}
        onApplyChanges={handleApplyChanges}
        onAddScript={(url) => {
          if (!externalScripts.includes(url)) setExternalScripts(prev => [...prev, url]);
        }}
        onRemoveScript={(url) => {
          setExternalScripts(prev => prev.filter(u => u !== url));
        }}
      />

      {/* 5. Clean Non-Technical Export Modal */}
      <CleanExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        width={activeWidth}
        height={activeHeight}
        onExecuteExport={handleExecuteExport}
        renderProgress={renderProgress}
        onCancelExport={() => ExportEngine.cancelExport()}
        defaultFilename={`stockcode-${activeTemplateId}`}
        background={backgroundStyle === 'transparent' ? 'transparent' : (backgroundStyle === 'custom' ? customBgColor : '#ffffff')}
        compliance={compliance}
      />

      {/* 6. Curator Checklist & Auto-Keywords Modal */}
      <CuratorGuideModal
        isOpen={isCuratorGuideOpen}
        onClose={() => setIsCuratorGuideOpen(false)}
        compliance={compliance}
        width={activeWidth}
        height={activeHeight}
      />
    </div>
  );
};
