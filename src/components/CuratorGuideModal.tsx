import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Sparkles, 
  Tag, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { AdobeComplianceResult } from '../types';

interface CuratorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  compliance: AdobeComplianceResult;
  width: number;
  height: number;
}

export const CuratorGuideModal: React.FC<CuratorGuideModalProps> = ({
  isOpen,
  onClose,
  compliance,
  width,
  height
}) => {
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  if (!isOpen) return null;

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(compliance.suggestedKeywords.join(', '));
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(compliance.suggestedTitle);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(compliance.suggestedDescription);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-zinc-900/30 backdrop-blur-[2px] transition-opacity animate-fadeIn"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E4E4E7] shadow-modal overflow-hidden z-10 animate-fadeIn my-auto max-h-[88vh] flex flex-col">
        {/* Header (Pinned) */}
        <div className="h-16 px-6 border-b border-[#E4E4E7] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Checklist & Metadata Adobe Stock</h2>
              <p className="text-xs text-zinc-500">Standar kurasi teknis & asisten metadata otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (Scrollable & Padded) */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* Status checklist */}
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-900">Checklist Teknis Otomatis:</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Skor Kesiapan: {compliance.score}/100
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2 text-zinc-700">
                {compliance.isMegapixelCompliant ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <span>
                  <strong>Resolusi Kanvas:</strong> {width} × {height} px ({compliance.megapixels} MP) —{' '}
                  {compliance.isMegapixelCompliant ? 'Memenuhi syarat kurasi ≥ 4.0 MP' : 'Perlu ditingkatkan ke minimal 4.0 MP'}
                </span>
              </div>

              <div className="flex items-start space-x-2 text-zinc-700">
                {compliance.isVectorPure ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <span>
                  <strong>Struktur Vektor:</strong>{' '}
                  {compliance.isVectorPure ? 'Kurva murni, bebas foreignObject, siap dikonversi ke EPS' : 'Terdeteksi tag non-standar'}
                </span>
              </div>

              <div className="flex items-start space-x-2 text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Standar Ekspor:</strong> PNG Lossless, JPG 100% Quality, SVG Murni, & MP4 (H.264)
                </span>
              </div>
            </div>
          </div>

          {/* Auto Metadata Assistant */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-900 block">
              Metadata Dihasilkan Otomatis Sesuai Aset Saat Ini:
            </span>

            {/* Title */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Judul Komersial (Title):</span>
                <button
                  onClick={handleCopyTitle}
                  className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium flex items-center space-x-1 shrink-0 transition shadow-xs"
                >
                  {copiedTitle ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTitle ? 'Tersalin' : 'Salin Judul'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-800 font-medium leading-snug">{compliance.suggestedTitle}</p>
            </div>

            {/* Description */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>Deskripsi Komersial (Description):</span>
                </span>
                <button
                  onClick={handleCopyDesc}
                  className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium flex items-center space-x-1 shrink-0 transition shadow-xs"
                >
                  {copiedDesc ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDesc ? 'Tersalin' : 'Salin Deskripsi'}</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">{compliance.suggestedDescription}</p>
            </div>

            {/* Keywords */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-zinc-400" />
                  <span>Tags / Kata Kunci ({compliance.suggestedKeywords.length} tags):</span>
                </span>
                <button
                  onClick={handleCopyKeywords}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center space-x-1 transition shadow-xs"
                >
                  {copiedKeywords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKeywords ? 'Semua Tersalin' : 'Salin Semua Tag'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pt-1">
                {compliance.suggestedKeywords.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600 text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Pinned) */}
        <div className="h-14 px-6 border-t border-[#E4E4E7] flex items-center justify-end bg-zinc-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
