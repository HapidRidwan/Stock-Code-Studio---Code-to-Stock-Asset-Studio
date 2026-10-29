import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileImage, 
  FileCode2, 
  Video, 
  Check, 
  Loader2,
  Clock,
  Sparkles,
  Copy,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { ExportFormat, ExportSettings, RenderProgress, AdobeComplianceResult } from '../types';

interface CleanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  height: number;
  onExecuteExport: (settings: ExportSettings) => Promise<void>;
  renderProgress: RenderProgress;
  onCancelExport: () => void;
  defaultFilename?: string;
  background: string;
  compliance?: AdobeComplianceResult;
}

export const CleanExportModal: React.FC<CleanExportModalProps> = ({
  isOpen,
  onClose,
  width,
  height,
  onExecuteExport,
  renderProgress,
  onCancelExport,
  defaultFilename = 'stockcode-asset',
  background,
  compliance
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<1 | 2>(1);
  const [duration, setDuration] = useState<number>(10);
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    const isTransparent = background === 'transparent';
    const finalBgColor = isTransparent ? '#000000' : (background.startsWith('#') ? background : '#FFFFFF');

    await onExecuteExport({
      format: selectedFormat,
      scale: scale,
      jpegQuality: 1.0,
      fps: fps,
      duration: duration,
      background: isTransparent ? 'transparent' : 'solid-white',
      customBgColor: finalBgColor,
      filename: `${defaultFilename}-${selectedFormat}`,
      includeAlpha: isTransparent
    });
  };

  const copyText = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const options = [
    {
      id: 'png' as ExportFormat,
      title: 'PNG',
      desc: 'Gambar tajam resolusi tinggi, mendukung background transparan.',
      icon: FileImage,
      badge: 'Super-Sharp'
    },
    {
      id: 'jpeg' as ExportFormat,
      title: 'JPG',
      desc: 'Ukuran file optimal (kualitas 100%), standar kurasi Adobe Stock.',
      icon: FileImage,
      badge: '100% Quality'
    },
    {
      id: 'svg' as ExportFormat,
      title: 'SVG',
      desc: 'Vektor murni, tanpa foreignObject, siap diedit di Adobe Illustrator.',
      icon: FileCode2,
      badge: 'EPS Ready'
    },
    {
      id: 'mp4' as ExportFormat,
      title: 'MP4 / Video',
      desc: 'Rekam animasi bergerak berkualitas tinggi (H.264).',
      icon: Video,
      badge: '4K / FHD'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
      {/* Gentle backdrop */}
      <div 
        onClick={!renderProgress.isRendering ? onClose : undefined}
        className="fixed inset-0 bg-zinc-900/30 backdrop-blur-[2px] transition-opacity animate-fadeIn"
      />

      {/* Clean White Modal with Pinned Header/Footer and Scrollable Body */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E4E4E7] shadow-modal overflow-hidden z-10 animate-fadeIn my-auto max-h-[90vh] flex flex-col">
        {/* Header (Pinned) */}
        <div className="h-14 sm:h-16 px-4 sm:px-6 border-b border-[#E4E4E7] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Unduh File Siap Pakai</h2>
            <p className="text-xs text-zinc-500">Pilih format file sesuai kebutuhan submission atau komersial</p>
          </div>
          {!renderProgress.isRendering && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Body (Scrollable & Never Cut Off) */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Selectable Rows */}
          <div className="space-y-2">
            {options.map((opt) => {
              const isSelected = selectedFormat === opt.id;
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  onClick={() => !renderProgress.isRendering && setSelectedFormat(opt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-zinc-900">{opt.title}</span>
                        <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.2 rounded font-medium">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    isSelected ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conditional Options for Video */}
          {selectedFormat === 'mp4' && (
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" /> Durasi Perekaman:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      disabled={renderProgress.isRendering}
                      onClick={() => setDuration(d)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                        duration === d
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {d} detik
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-1.5">
                  Kecepatan Frame:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([24, 30, 60] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      disabled={renderProgress.isRendering}
                      onClick={() => setFps(f)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                        fps === f
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {f} FPS
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conditional Options for Raster */}
          {(selectedFormat === 'png' || selectedFormat === 'jpeg') && (
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
              <span className="text-zinc-600 font-medium">Resolusi Ekspor:</span>
              <div className="flex space-x-1.5">
                <button
                  type="button"
                  disabled={renderProgress.isRendering}
                  onClick={() => setScale(1)}
                  className={`px-2.5 py-1 rounded-lg font-medium text-xs transition ${
                    scale === 1 ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  1x ({width}×{height})
                </button>
                <button
                  type="button"
                  disabled={renderProgress.isRendering}
                  onClick={() => setScale(2)}
                  className={`px-2.5 py-1 rounded-lg font-medium text-xs transition ${
                    scale === 2 ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  2x Super-Sampling ({width * 2}×{height * 2})
                </button>
              </div>
            </div>
          )}

          {/* Metadata & Tag Auto-Assistant (Collapsible) */}
          {compliance && (
            <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowMetadata(!showMetadata)}
                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/70 text-left flex items-center justify-between text-xs font-semibold text-zinc-800 transition"
              >
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Metadata & Tag Otomatis (Adobe Stock Ready)</span>
                </div>
                {showMetadata ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
              </button>

              {showMetadata && (
                <div className="p-4 space-y-3 bg-white text-xs border-t border-zinc-100 animate-fadeIn">
                  {/* Title */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Judul Otomatis:</span>
                      <button
                        type="button"
                        onClick={() => copyText(compliance.suggestedTitle, setCopiedTitle)}
                        className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                      >
                        {copiedTitle ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedTitle ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-zinc-800 font-medium bg-zinc-50 p-2 rounded-lg border border-zinc-200 text-[11px]">
                      {compliance.suggestedTitle}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Deskripsi Otomatis:</span>
                      <button
                        type="button"
                        onClick={() => copyText(compliance.suggestedDescription, setCopiedDesc)}
                        className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                      >
                        {copiedDesc ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDesc ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-zinc-600 leading-relaxed bg-zinc-50 p-2 rounded-lg border border-zinc-200 text-[11px]">
                      {compliance.suggestedDescription}
                    </p>
                  </div>

                  {/* Keywords */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Kata Kunci ({compliance.suggestedKeywords.length} tags):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyText(compliance.suggestedKeywords.join(', '), setCopiedKeywords)}
                        className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                      >
                        {copiedKeywords ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKeywords ? 'Semua Tersalin' : 'Salin Semua Tag'}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pt-0.5">
                      {compliance.suggestedKeywords.map((k, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] border border-zinc-200">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rendering Progress View */}
          {renderProgress.isRendering && (
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-900" />
                  <span>{renderProgress.stage}</span>
                </span>
                <span className="font-mono text-zinc-700 font-bold">
                  {renderProgress.percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 transition-all duration-150"
                  style={{ width: `${renderProgress.percentage}%` }}
                />
              </div>
              <div className="text-[11px] text-zinc-500 truncate">
                {renderProgress.statusText}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Pinned) */}
        <div className="h-14 sm:h-16 px-4 sm:px-6 border-t border-[#E4E4E7] flex items-center justify-between bg-zinc-50 shrink-0">
          <div>
            {renderProgress.isRendering ? (
              <button
                type="button"
                onClick={onCancelExport}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                Batalkan
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-zinc-500 hover:text-zinc-800 font-medium"
              >
                Batal
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleStartExport}
            disabled={renderProgress.isRendering}
            className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-700 text-white text-xs font-semibold shadow-sm transition active:scale-[0.98] flex items-center space-x-1.5"
          >
            {renderProgress.isRendering ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh {selectedFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
