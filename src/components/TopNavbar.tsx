import React from 'react';
import { 
  Code2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { AdobeComplianceResult } from '../types';

interface TopNavbarProps {
  width: number;
  height: number;
  megapixels: number;
  isCompliant: boolean;
  zoom: number;
  autoFit: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFit: () => void;
  onOpenDrawer: () => void;
  onOpenCuratorGuide: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  width,
  height,
  megapixels,
  isCompliant,
  zoom,
  autoFit,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFit,
  onOpenDrawer,
  onOpenCuratorGuide
}) => {
  return (
    <header className="h-14 bg-white border-b border-[#E4E4E7] px-3 sm:px-5 flex items-center justify-between z-30 select-none gap-2">
      {/* Left: Minimal Logo & [ Kode & Template ] Button */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-bold tracking-tight shrink-0 shadow-xs">
            S
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-xs sm:text-sm text-zinc-900 tracking-tight">StockCode</span>
            <span className="hidden xs:inline-block text-[10px] sm:text-[11px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">Studio</span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-zinc-200 mx-0.5 sm:mx-1" />

        {/* Clean Primary Button to open Slide-Over Drawer */}
        <button
          onClick={onOpenDrawer}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 text-xs font-medium shadow-xs transition active:scale-[0.98]"
          title="Buka panel untuk memasukkan kode atau memilih template"
        >
          <Code2 className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
          <span className="hidden sm:inline">Kode & Template</span>
          <span className="sm:hidden text-[11px]">Kode</span>
        </button>
      </div>

      {/* Center: Minimalist Single-Line Info (Adaptive for All Screens) */}
      <div className="flex items-center text-xs text-zinc-600 font-medium">
        {/* Mobile Compact Pill */}
        <div className="flex sm:hidden items-center space-x-1.5 bg-zinc-50 border border-zinc-200/80 px-2 py-0.5 rounded-full text-[11px]">
          <span 
            className={`w-2 h-2 rounded-full shrink-0 ${
              isCompliant ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="font-semibold text-zinc-800">{megapixels} MP</span>
        </div>

        {/* Tablet / Mid Screens */}
        <div className="hidden sm:flex lg:hidden items-center space-x-2">
          <span 
            className={`w-2 h-2 rounded-full shrink-0 ${
              isCompliant ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span>{width} × {height} px</span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">{megapixels} MP</span>
        </div>

        {/* Desktop Full Info */}
        <div className="hidden lg:flex items-center space-x-2">
          <span 
            className={`w-2 h-2 rounded-full shrink-0 ${
              isCompliant ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            title={isCompliant ? 'Memenuhi syarat kurasi Adobe Stock (≥ 4.0 MP)' : 'Di bawah 4 Megapixel'}
          />
          <span>
            {width} × {height} px
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">
            {megapixels} MP {isCompliant ? '(Standar Adobe Stock)' : '(Di bawah 4.0 MP)'}
          </span>
        </div>
      </div>

      {/* Right: Minimalist View & Zoom Controls */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {/* Subtle Zoom Pill */}
        <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 text-xs text-zinc-600">
          <button
            onClick={onZoomOut}
            className="p-1 rounded hover:bg-white text-zinc-600 hover:text-zinc-900 transition"
            title="Perkecil (-5%)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onFit}
            className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition ${
              autoFit ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'hover:bg-white text-zinc-500'
            }`}
            title="Paskan ke Layar"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            className="p-1 rounded hover:bg-white text-zinc-600 hover:text-zinc-900 transition"
            title="Perbesar (+5%)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-zinc-200 mx-0.5" />

        {/* Curator & Keywords button */}
        <button
          onClick={onOpenCuratorGuide}
          className="flex items-center space-x-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-medium transition"
          title="Lihat checklist Adobe Stock & salin keywords otomatis"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <span className="hidden md:inline">Checklist & Tag</span>
        </button>
      </div>
    </header>
  );
};
