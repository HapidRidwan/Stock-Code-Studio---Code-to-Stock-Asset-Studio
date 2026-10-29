import { CanvasPreset } from '../types';

export const CANVAS_PRESETS: CanvasPreset[] = [
  {
    id: 'adobe-min-4mp',
    name: 'Gambar Adobe Stock (4MP)',
    category: 'Image / Illustration',
    width: 2500,
    height: 1600,
    aspectRatio: '16:10',
    megapixels: 4.0,
    description: 'Syarat minimal kurasi Adobe Stock (4.0 Megapixel). Standar foto & ilustrasi komersial.',
    badge: '4.0 MP'
  },
  {
    id: 'adobe-standard-12mp',
    name: 'Gambar High-Res (12MP)',
    category: 'Image / Illustration',
    width: 4000,
    height: 3000,
    aspectRatio: '4:3',
    megapixels: 12.0,
    description: 'Kualitas cetak komersial resolusi tinggi untuk pembeli korporat dan agency.',
    badge: '12.0 MP'
  },
  {
    id: 'video-4k',
    name: 'Video Animasi 4K',
    category: 'Video & Animation',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    megapixels: 8.29,
    description: 'Format footage 4K UHD dengan standar royalti komersial tertinggi di Adobe Stock.',
    badge: '4K UHD',
    recommendedFps: 60,
    recommendedDuration: 10
  },
  {
    id: 'video-vertical',
    name: 'Video Vertikal (9:16)',
    category: 'Video & Animation',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    megapixels: 2.07,
    description: 'Format vertikal untuk video media sosial, Reels, dan video iklan smartphone.',
    badge: '9:16 Reels',
    recommendedFps: 30,
    recommendedDuration: 15
  },
  {
    id: 'adobe-square-16mp',
    name: 'Vektor SVG Murni',
    category: 'Image / Illustration',
    width: 4000,
    height: 3000,
    aspectRatio: '4:3',
    megapixels: 12.0,
    description: 'Vektor SVG murni kurva geometris, kompatibel langsung dengan Adobe Illustrator EPS.',
    badge: 'Pure Vector'
  },
  {
    id: 'custom',
    name: 'Ukuran Kustom...',
    category: 'Custom',
    width: 3000,
    height: 2000,
    aspectRatio: 'Custom',
    megapixels: 6.0,
    description: 'Tentukan dimensi bebas secara manual.',
    badge: 'Kustom'
  }
];

export const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 1.0, label: '1x' },
  { value: 2.0, label: '2x' }
];

export const DURATION_OPTIONS = [
  { value: 5, label: '5 detik' },
  { value: 10, label: '10 detik' },
  { value: 15, label: '15 detik' },
  { value: 30, label: '30 detik' }
];

export const FPS_OPTIONS = [
  { value: 24, label: '24 FPS' },
  { value: 30, label: '30 FPS' },
  { value: 60, label: '60 FPS' }
];
