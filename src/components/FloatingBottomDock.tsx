import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  ChevronUp, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Palette,
  Check,
  Sparkles,
  Loader2
} from 'lucide-react';
import { ResolutionPresetId, BackgroundStyle } from '../types';
import { CANVAS_PRESETS, SPEED_OPTIONS } from '../constants/presets';

interface FloatingBottomDockProps {
  currentPresetId: ResolutionPresetId;
  onSelectPreset: (id: ResolutionPresetId) => void;
  backgroundStyle: BackgroundStyle;
  customBgColor: string;
  onChangeBackgroundStyle: (style: BackgroundStyle) => void;
  onChangeCustomBgColor: (color: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  speed: number;
  onChangeSpeed: (spd: number) => void;
  onOpenExportModal: () => void;
  isRendering: boolean;
  renderingPercentage: number;
}

export const FloatingBottomDock: React.FC<FloatingBottomDockProps> = ({
  currentPresetId,
  onSelectPreset,
  backgroundStyle,
  customBgColor,
  onChangeBackgroundStyle,
  onChangeCustomBgColor,
  isPlaying,
  onTogglePlay,
  onRestart,
  speed,
  onChangeSpeed,
  onOpenExportModal,
  isRendering,
  renderingPercentage
}) => {
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSizeDropdownOpen(false);
        setIsColorPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPreset = CANVAS_PRESETS.find(p => p.id === currentPresetId) || CANVAS_PRESETS[0];

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 select-none max-w-[calc(100vw-1rem)] px-1">
      <div 
        ref={dropdownRef}
        className="bg-white/95 backdrop-blur-md border border-[#E4E4E7] rounded-2xl shadow-dock px-2 sm:px-3.5 py-1.5 sm:py-2 flex items-center space-x-1.5 sm:space-x-3 text-zinc-800"
      >
        {/* 1. Pemilih Ukuran (Dropdown Simpel Berbasis Fungsi) */}
        <div className="relative">
          <button
            onClick={() => {
              setIsSizeDropdownOpen(!isSizeDropdownOpen);
              setIsColorPickerOpen(false);
            }}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition text-xs font-semibold text-zinc-900"
            title="Ubah ukuran kanvas"
          >
            <Maximize2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate max-w-[65px] xs:max-w-[100px] sm:max-w-[150px]">{currentPreset.name}</span>
            <ChevronUp className={`w-3.5 h-3.5 text-zinc-400 transition-transform shrink-0 ${isSizeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSizeDropdownOpen && (
            <div className="absolute bottom-12 left-0 sm:left-0 w-64 max-w-[85vw] bg-white border border-[#E4E4E7] rounded-2xl shadow-xl p-1.5 z-50 space-y-0.5 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Pilih Ukuran Kanvas
              </div>
              {CANVAS_PRESETS.map((preset) => {
                const isSelected = currentPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset.id);
                      setIsSizeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {preset.width} × {preset.height} px
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-[1px] h-5 sm:h-6 bg-zinc-200" />

        {/* 2. Pemilih Background (3 Bulatan Cepat + Custom) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Transparent / Checkerboard */}
          <button
            onClick={() => onChangeBackgroundStyle('transparent')}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full checkerboard-clean border transition-all ${
              backgroundStyle === 'transparent' ? 'ring-2 ring-zinc-900 scale-105 border-zinc-900' : 'border-zinc-300 hover:scale-105'
            }`}
            title="Background Transparan"
          />

          {/* White */}
          <button
            onClick={() => onChangeBackgroundStyle('solid-white')}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border transition-all ${
              backgroundStyle === 'solid-white' ? 'ring-2 ring-zinc-900 scale-105 border-zinc-900' : 'border-zinc-300 hover:scale-105'
            }`}
            title="Background Putih (#FFFFFF)"
          />

          {/* Black / Dark */}
          <button
            onClick={() => onChangeBackgroundStyle('solid-black')}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#18181B] border border-zinc-800 transition-all ${
              backgroundStyle === 'solid-black' || backgroundStyle === 'solid-dark' ? 'ring-2 ring-zinc-900 ring-offset-1 scale-105' : 'hover:scale-105'
            }`}
            title="Background Hitam (#18181B)"
          />

          {/* Custom Color Picker */}
          <div className="relative flex items-center">
            <label
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full cursor-pointer flex items-center justify-center border transition-all overflow-hidden ${
                backgroundStyle === 'custom' ? 'ring-2 ring-zinc-900 scale-105 border-zinc-900' : 'border-zinc-300 hover:scale-105'
              }`}
              style={{ backgroundColor: backgroundStyle === 'custom' ? customBgColor : '#f4f4f5' }}
              title="Pilih Warna Kustom"
            >
              <input
                type="color"
                value={customBgColor}
                onChange={(e) => {
                  onChangeCustomBgColor(e.target.value);
                  onChangeBackgroundStyle('custom');
                }}
                className="opacity-0 w-0 h-0 cursor-pointer"
              />
              {backgroundStyle !== 'custom' && (
                <Palette className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-500" />
              )}
            </label>
          </div>
        </div>

        <div className="w-[1px] h-5 sm:h-6 bg-zinc-200" />

        {/* 3. Kontrol Animasi (Play/Pause, Restart, Kecepatan) */}
        <div className="flex items-center space-x-0.5 sm:space-x-1">
          <button
            onClick={onTogglePlay}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 transition"
            title={isPlaying ? 'Jeda Animasi' : 'Putar Animasi'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <button
            onClick={onRestart}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 transition"
            title="Mulai Ulang Animasi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector: Desktop Full Pills */}
          <div className="hidden md:flex bg-zinc-100 rounded-lg p-0.5 text-[11px] font-medium text-zinc-600 ml-1">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChangeSpeed(opt.value)}
                className={`px-1.5 py-0.5 rounded ${
                  speed === opt.value
                    ? 'bg-white text-zinc-900 font-bold shadow-sm'
                    : 'hover:text-zinc-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Speed Selector: Mobile Space-Saving Interactive Cycler */}
          <button
            onClick={() => {
              const currentIndex = SPEED_OPTIONS.findIndex(o => o.value === speed);
              const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
              onChangeSpeed(SPEED_OPTIONS[nextIndex].value);
            }}
            className="md:hidden px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 rounded text-[10px] font-bold text-zinc-700 transition ml-0.5"
            title="Klik untuk ganti kecepatan"
          >
            {speed}x
          </button>
        </div>

        <div className="w-[1px] h-5 sm:h-6 bg-zinc-200" />

        {/* 4. Tombol Utama [ Unduh File ] */}
        <button
          onClick={onOpenExportModal}
          disabled={isRendering}
          className="flex items-center space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-700 text-white text-xs font-semibold shadow-sm transition active:scale-[0.98] shrink-0"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden xs:inline">Memproses {renderingPercentage}%...</span>
              <span className="xs:hidden">{renderingPercentage}%</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Unduh File</span>
              <span className="xs:hidden">Unduh</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
