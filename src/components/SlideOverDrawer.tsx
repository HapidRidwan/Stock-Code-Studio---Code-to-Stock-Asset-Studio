import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  X, 
  Sparkles, 
  Check, 
  Clipboard, 
  Code2, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Paintbrush, 
  FileText,
  Play,
  RotateCcw,
  Library,
  Plus,
  Trash2
} from 'lucide-react';
import { STARTER_TEMPLATES, StarterTemplate } from '../constants/templates';
import { CodeTab } from '../types';

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
  externalScripts: string[];
  externalStyles: string[];
  onChangeHtml: (val: string) => void;
  onChangeCss: (val: string) => void;
  onChangeJs: (val: string) => void;
  onSelectTemplate: (templateId: string) => void;
  activeTemplateId: string;
  onApplyChanges: () => void;
  onAddScript: (url: string) => void;
  onRemoveScript: (url: string) => void;
}

const POPULAR_CDNS = [
  { name: 'GSAP 3', url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js' },
  { name: 'Three.js', url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' },
  { name: 'Anime.js', url: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js' },
  { name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com' },
];

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  html,
  css,
  js,
  externalScripts,
  externalStyles,
  onChangeHtml,
  onChangeCss,
  onChangeJs,
  onSelectTemplate,
  activeTemplateId,
  onApplyChanges,
  onAddScript,
  onRemoveScript
}) => {
  const [activeTab, setActiveTab] = useState<'smart-paste' | 'templates'>('smart-paste');
  const [smartPasteContent, setSmartPasteContent] = useState('');
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [editorTab, setEditorTab] = useState<CodeTab>('html');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [customCdnUrl, setCustomCdnUrl] = useState('');

  if (!isOpen) return null;

  // Smart Parser for 1-Click Paste
  const handleSmartApply = () => {
    const raw = smartPasteContent.trim();
    if (!raw) return;

    let parsedHtml = raw;
    let parsedCss = '';
    let parsedJs = '';

    // Extract <style>...</style>
    const styleMatches = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
      styleMatches.forEach((s) => {
        const inner = s.replace(/<\/?style[^>]*>/gi, '').trim();
        parsedCss += inner + '\n';
        parsedHtml = parsedHtml.replace(s, '');
      });
    }

    // Extract <script>...</script>
    const scriptMatches = raw.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatches) {
      scriptMatches.forEach((s) => {
        const inner = s.replace(/<\/?script[^>]*>/gi, '').trim();
        parsedJs += inner + '\n';
        parsedHtml = parsedHtml.replace(s, '');
      });
    }

    onChangeHtml(parsedHtml.trim());
    if (parsedCss.trim()) onChangeCss(parsedCss.trim());
    if (parsedJs.trim()) onChangeJs(parsedJs.trim());

    onApplyChanges();
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleFormatCode = () => {
    if (editorTab === 'html') {
      let formatted = '';
      const reg = /(>)(<)(\/*)/g;
      const xml = html.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      xml.split('\r\n').forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        }
        formatted += '  '.repeat(pad) + node + '\n';
        pad += indent;
      });
      onChangeHtml(formatted.trim());
    } else if (editorTab === 'css') {
      const formatted = css
        .replace(/\s*\{\s*/g, ' {\n  ')
        .replace(/\s*;\s*/g, ';\n  ')
        .replace(/\s*\}\s*/g, '\n}\n\n')
        .trim();
      onChangeCss(formatted);
    }
  };

  const getEditorValue = () => {
    if (editorTab === 'html') return html;
    if (editorTab === 'css') return css;
    return js;
  };

  const handleEditorChange = (val: string | undefined) => {
    const v = val || '';
    if (editorTab === 'html') onChangeHtml(v);
    else if (editorTab === 'css') onChangeCss(v);
    else onChangeJs(v);
  };

  const handleAddCustomCdn = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCdnUrl.trim()) {
      onAddScript(customCdnUrl.trim());
      setCustomCdnUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Gentle backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-zinc-900/20 backdrop-blur-[2px] transition-opacity animate-fadeIn"
      />

      {/* Slide-over White Drawer */}
      <aside className="relative w-full max-w-full sm:max-w-md md:max-w-lg bg-white border-r border-[#E4E4E7] shadow-xl flex flex-col h-full z-10 animate-slideRight">
        {/* Header */}
        <div className="h-14 sm:h-16 px-4 sm:px-6 border-b border-[#E4E4E7] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Kode & Template</h2>
            <p className="text-xs text-zinc-500">Pilih template siap pakai atau tempel kode Anda</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Minimalist Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-zinc-100 flex items-center space-x-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('smart-paste')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
              activeTab === 'smart-paste'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Smart Paste (1-Klik)</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
              activeTab === 'templates'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Contoh Siap Pakai</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'smart-paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                  Tempel Kode di Sini
                </label>
                <textarea
                  value={smartPasteContent}
                  onChange={(e) => setSmartPasteContent(e.target.value)}
                  placeholder="Tempel kode utuh di sini (SVG murni, HTML + <style>, atau gabungan script)..."
                  className="w-full h-44 p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white transition resize-none"
                />
              </div>

              {/* Primary Black CTA */}
              <button
                onClick={handleSmartApply}
                disabled={!smartPasteContent.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-sm active:scale-[0.99]"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Berhasil Diterapkan ke Kanvas!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Terapkan ke Kanvas</span>
                  </>
                )}
              </button>

              {/* CDN Libraries Toggle / Quick Chips */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-700 block">
                  Pustaka CDN Tambahan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CDNS.map((cdn) => {
                    const isLoaded = externalScripts.includes(cdn.url);
                    return (
                      <button
                        key={cdn.name}
                        onClick={() => {
                          if (isLoaded) onRemoveScript(cdn.url);
                          else onAddScript(cdn.url);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                          isLoaded
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {isLoaded ? `✓ ${cdn.name}` : `+ ${cdn.name}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 space-y-1">
                <span className="font-semibold text-zinc-800 block">Tips Penggunaan:</span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Smart Paste akan otomatis mendeteksi tag <code className="text-zinc-700 bg-white px-1 py-0.5 rounded border border-zinc-200">&lt;style&gt;</code> dan <code className="text-zinc-700 bg-white px-1 py-0.5 rounded border border-zinc-200">&lt;script&gt;</code> untuk memisahkannya secara rapi ke kanvas.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-zinc-800 block">
                Pilih Desain Siap Pakai:
              </span>
              <div className="space-y-2.5">
                {STARTER_TEMPLATES.map((tmpl) => {
                  const isSelected = activeTemplateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        onSelectTemplate(tmpl.id);
                        onApplyChanges();
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-50'
                          : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/60 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs text-zinc-900">
                            {tmpl.name}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.2 rounded">
                            {tmpl.category}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-zinc-900" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Collapsible Advanced Line-by-Line Code Editor */}
          <div className="pt-4 border-t border-zinc-200">
            <button
              onClick={() => setShowAdvancedEditor(!showAdvancedEditor)}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition"
            >
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-zinc-500" />
                <span>Editor Lanjutan (HTML / CSS / JS)</span>
              </div>
              {showAdvancedEditor ? (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {showAdvancedEditor && (
              <div className="mt-3 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                {/* Tabs */}
                <div className="h-9 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between px-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditorTab('html')}
                      className={`px-2.5 py-1 text-xs font-medium rounded ${
                        editorTab === 'html' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      HTML
                    </button>
                    <button
                      onClick={() => setEditorTab('css')}
                      className={`px-2.5 py-1 text-xs font-medium rounded ${
                        editorTab === 'css' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      CSS
                    </button>
                    <button
                      onClick={() => setEditorTab('js')}
                      className={`px-2.5 py-1 text-xs font-medium rounded ${
                        editorTab === 'js' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      JavaScript
                    </button>
                  </div>

                  <button
                    onClick={handleFormatCode}
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium px-2 py-0.5 rounded hover:bg-zinc-100"
                    title="Format Code"
                  >
                    Format
                  </button>
                </div>

                {/* Monaco Editor */}
                <div className="h-56 relative bg-white">
                  <Editor
                    height="100%"
                    language={editorTab === 'js' ? 'javascript' : editorTab}
                    value={getEditorValue()}
                    onChange={handleEditorChange}
                    theme="vs-light"
                    options={{
                      fontSize: 12,
                      fontFamily: '"JetBrains Mono", Consolas, monospace',
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      tabSize: 2,
                      wordWrap: 'on',
                      padding: { top: 8, bottom: 8 }
                    }}
                  />
                </div>

                <div className="p-2 bg-zinc-50 border-t border-zinc-200 flex justify-end">
                  <button
                    onClick={onApplyChanges}
                    className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
                  >
                    Terapkan Perubahan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-4 sm:px-6 border-t border-[#E4E4E7] flex items-center justify-end bg-zinc-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition"
          >
            Tutup
          </button>
        </div>
      </aside>
    </div>
  );
};
