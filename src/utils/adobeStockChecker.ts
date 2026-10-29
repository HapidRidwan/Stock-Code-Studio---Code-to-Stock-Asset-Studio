import { AdobeComplianceResult, ExportFormat } from '../types';

export function analyzeAdobeStockCompliance(
  width: number,
  height: number,
  html: string,
  css: string,
  js: string,
  format: ExportFormat,
  duration: number,
  fps: number
): AdobeComplianceResult {
  const megapixels = Number(((width * height) / 1000000).toFixed(2));
  const isMegapixelCompliant = megapixels >= 4.0;
  
  const imageWarnings: string[] = [];
  const videoWarnings: string[] = [];
  const vectorWarnings: string[] = [];
  const recommendations: string[] = [];
  
  let score = 100;

  // 1. Technical Resolution Check
  if (megapixels < 4.0) {
    imageWarnings.push(`Dimensi saat ini (${width} × ${height} px = ${megapixels} MP) di bawah syarat minimal Adobe Stock (4.0 MP). Minimal adalah 2500 × 1600 px.`);
    score -= 30;
  } else if (megapixels >= 12.0) {
    recommendations.push(`Resolusi tinggi istimewa (${megapixels} MP) memenuhi kategori High-Res Commercial Print & Vector Tier.`);
  }

  // 2. Vector Pureness Check (Critical for Illustrator & EPS conversion)
  let isVectorPure = true;
  const lowerHtml = html.toLowerCase();
  
  if (lowerHtml.includes('<foreignobject')) {
    isVectorPure = false;
    vectorWarnings.push('Terdeteksi tag <foreignObject>. Adobe Stock menolak SVG yang mengandung foreignObject karena tidak kompatibel dengan Adobe Illustrator / format EPS.');
    score -= 40;
  }
  
  if (lowerHtml.includes('data:image/') || lowerHtml.includes('<image')) {
    isVectorPure = false;
    vectorWarnings.push('Terdeteksi elemen raster/base64 di dalam kode. File vektor Adobe Stock harus murni kurva geometris tanpa bitmap.');
    score -= 25;
  }

  const hasSvgTag = lowerHtml.includes('<svg');
  if (format === 'svg' && !hasSvgTag) {
    vectorWarnings.push('Tidak terdeteksi elemen <svg> langsung. Untuk ekspor vektor murni, gunakan struktur kurva SVG.');
    score -= 15;
  }

  // 3. Video Criteria Check
  if (duration < 5) {
    videoWarnings.push(`Durasi rekaman (${duration} detik) terlalu singkat. Adobe Stock mensyaratkan durasi video minimal 5 detik.`);
    score -= 35;
  } else if (duration > 60) {
    videoWarnings.push(`Durasi rekaman (${duration} detik) melebihi batas maksimal Adobe Stock (60 detik).`);
    score -= 35;
  }

  const validFramerates = [24, 25, 30, 50, 60];
  if (!validFramerates.includes(fps)) {
    videoWarnings.push(`Frame rate ${fps} FPS bukan standar stock footage.`);
    score -= 10;
  }

  const isStandardAspect = (width === 3840 && height === 2160) || 
                           (width === 1920 && height === 1080) || 
                           (width === 1080 && height === 1920);
  if (!isStandardAspect && (format === 'mp4' || format === 'webm')) {
    recommendations.push('Disarankan menggunakan rasio 16:9 (4K/1080p) atau 9:16 (Vertikal) untuk video stok komersial.');
  }

  // 4. Intelligent Asset Content Analysis
  const combinedCode = (html + ' ' + css + ' ' + js).toLowerCase();

  // Detect visual elements
  const isCanvas = combinedCode.includes('canvas') || combinedCode.includes('getcontext');
  const isParticle = combinedCode.includes('particle') || combinedCode.includes('physics') || combinedCode.includes('filaments');
  const isAurora = combinedCode.includes('aurora') || combinedCode.includes('blob') || combinedCode.includes('blur(80px)');
  const isBadge = combinedCode.includes('badge') || combinedCode.includes('shield') || combinedCode.includes('emblem') || combinedCode.includes('hexagon');
  const isGeometric = combinedCode.includes('spoke') || combinedCode.includes('bauhaus') || combinedCode.includes('geometric') || combinedCode.includes('concentric');
  const isInfographic = combinedCode.includes('infographic') || combinedCode.includes('gauge') || combinedCode.includes('data');

  // Detect dominant color vibes
  const hasGold = combinedCode.includes('gold') || combinedCode.includes('amber') || combinedCode.includes('#f59e0b') || combinedCode.includes('#ffd200');
  const hasCyan = combinedCode.includes('cyan') || combinedCode.includes('#06b6d4') || combinedCode.includes('#00f2fe') || combinedCode.includes('#38bdf8');
  const hasViolet = combinedCode.includes('violet') || combinedCode.includes('purple') || combinedCode.includes('#7c3aed') || combinedCode.includes('#6366f1');
  const hasDark = combinedCode.includes('#000') || combinedCode.includes('#0a') || combinedCode.includes('#030712') || combinedCode.includes('#090d16');

  // Construct Keywords Set
  const keywordsSet = new Set<string>([
    'stock asset', 'adobe stock', 'high resolution', 'commercial use', 'graphic design', 'modern design'
  ]);

  let title = 'Modern High Resolution Creative Stock Asset';
  let description = 'High-resolution modern creative asset designed for commercial stock licensing. Fully optimized geometry and colors, perfect for websites, digital advertising, branding, and multimedia productions.';
  let category = 'Graphic Resources';

  // Customized generation based on asset specifics
  if (isParticle || (isCanvas && !isGeometric)) {
    title = `Futuristic Anti-Gravity Floating Particles Network ${width >= 3840 ? '4K' : 'HD'} Loop`;
    description = `Atmospheric generative particle simulation featuring glowing floating nodes and subtle depth of field. Perfectly rendered in ${width}x${height} resolution for modern technology backgrounds, cyber network visualization, deep space concept, and cinematic loop video. Fully compliant with Adobe Stock footage standards.`;
    category = 'Motion Graphics & 3D';

    [
      'particles', 'anti-gravity', 'floating', 'network', 'connecting nodes', 'quantum', 
      'glowing', 'cyberpunk', 'futuristic', 'technology', 'deep space', 'cinematic loop', 
      'vfx', 'motion graphics', 'energy field', 'constellation', 'data stream', 'ambient motion', 
      '4k wallpaper', 'science fiction', 'digital universe', 'abstract physics', 'seamless loop',
      'dark background', 'tech background', 'ai concept', 'neural network', 'digital cosmos'
    ].forEach(k => keywordsSet.add(k));

  } else if (isAurora || combinedCode.includes('mesh-overlay') || combinedCode.includes('gradient')) {
    title = `Fluid Aurora Mesh Motion Gradient Seamless ${width >= 3840 ? '4K' : 'HD'} Background`;
    description = `Vibrant organic fluid mesh gradient animation with smooth color transitions and subtle ambient glow. High-resolution loop footage ideal for luxury branding backgrounds, digital event screens, mobile app wallpapers, and modern presentation backdrops. Meets all Adobe Stock technical criteria.`;
    category = 'Abstract Backgrounds';

    [
      'aurora borealis', 'fluid gradient', 'mesh gradient', 'colorful background', 'vibrant colors', 
      'liquid motion', 'smooth wave', 'ambient lights', 'abstract loop', 'modern wallpaper', 
      'digital backdrop', 'neon glow', 'relaxing motion', 'creative background', 'ui motion', 
      'pastel neon', 'color blend', 'dynamic light', 'streaming background', 'video loop', 
      'abstract art', 'atmospheric', 'gradient wave', 'contemporary visual'
    ].forEach(k => keywordsSet.add(k));

  } else if (isBadge || isInfographic) {
    title = 'Futuristic Cyber Tech Infographic Shield Emblem & UI Vector Badge';
    description = `Precision-crafted vector tech badge and infographic shield featuring clean concentric geometric gauges, data markers, and metallic gold accents. Designed with 100% pure scalable vector paths, free of foreignObject, ready for Adobe Illustrator EPS export, security certifications, fintech logos, and HUD interfaces.`;
    category = 'Vectors & Icons';

    [
      'cyber security', 'infographic badge', 'tech emblem', 'vector shield', 'gold badge', 
      'quality guarantee', 'ui element', 'hud display', 'futuristic label', 'fintech icon', 
      'data gauge', 'certificate stamp', 'secure emblem', 'vector graphics', 'eps ready', 
      'clean design', 'corporate badge', 'digital security', 'cyberpunk icon', 'modern insignia', 
      'pure vector', 'scalable artwork', 'commercial symbol', 'branding asset'
    ].forEach(k => keywordsSet.add(k));

  } else if (isGeometric || hasSvgTag) {
    title = 'Geometric Abstract Bauhaus Swiss Style Overlapping Vector Composition';
    description = `Striking geometric abstract composition inspired by Swiss modernism and Bauhaus aesthetics, with harmonious concentric circles, intersecting dynamic lines, and balanced color gradients. Pure mathematical vector illustration suitable for high-end wall art posters, editorial covers, architectural banners, and commercial branding.`;
    category = 'Illustrations & Vectors';

    [
      'geometric abstract', 'bauhaus vector', 'swiss style', 'sacred geometry', 'concentric circles', 
      'overlapping shapes', 'modern art poster', 'minimalist vector', 'contemporary illustration', 
      'creative composition', 'graphic artwork', 'vector poster', 'eps illustration', 'fine curves', 
      'architectural design', 'cover art', 'print ready', 'commercial vector', 'mathematical art', 
      'clean lines', 'harmony', 'aesthetic shapes', 'mid-century modern'
    ].forEach(k => keywordsSet.add(k));

  } else {
    // Custom user code dynamic adaptation
    title = `Creative ${megapixels >= 4 ? 'High-Res' : ''} ${hasSvgTag ? 'Vector Graphic' : 'Digital Illustration'} Asset`;
    description = `High-resolution creative asset designed in ${width}x${height} px (${megapixels} MP). Carefully arranged visual composition with modern aesthetic standards, ready for digital presentation, web design, commercial print, and social media branding. Compliant with Adobe Stock guidelines.`;
    category = 'Graphic Resources';

    [
      'digital art', 'creative design', 'modern layout', 'graphic element', 'visual asset', 
      'web asset', 'high resolution', 'commercial stock', 'illustration', 'royalty free', 
      'trendy design', 'creative background', 'content creator', 'marketing material'
    ].forEach(k => keywordsSet.add(k));
  }

  // Add detected color keywords
  if (hasGold) ['gold accents', 'golden yellow', 'warm tones'].forEach(k => keywordsSet.add(k));
  if (hasCyan) ['neon cyan', 'electric blue', 'aqua turquoise'].forEach(k => keywordsSet.add(k));
  if (hasViolet) ['indigo purple', 'deep violet', 'magenta'].forEach(k => keywordsSet.add(k));
  if (hasDark) ['dark mode', 'dark background', 'deep contrast'].forEach(k => keywordsSet.add(k));

  // Add format & resolution tags
  if (megapixels >= 12.0) keywordsSet.add('12 megapixel');
  if (megapixels >= 4.0) keywordsSet.add('4 megapixel');
  if (width === 3840 && height === 2160) {
    keywordsSet.add('4k uhd');
    keywordsSet.add('3840x2160');
    keywordsSet.add('16:9');
  }
  if (width === 1080 && height === 1920) {
    keywordsSet.add('vertical video');
    keywordsSet.add('reels');
    keywordsSet.add('9:16');
  }
  if (hasSvgTag) {
    keywordsSet.add('pure svg');
    keywordsSet.add('illustrator eps');
    keywordsSet.add('vector scalable');
  }

  const suggestedKeywords = Array.from(keywordsSet);
  score = Math.max(10, Math.min(100, score));

  return {
    isImageCompliant: isMegapixelCompliant,
    isVideoCompliant: duration >= 5 && duration <= 60 && validFramerates.includes(fps),
    megapixels,
    isMegapixelCompliant,
    isVectorPure,
    vectorWarnings,
    imageWarnings,
    videoWarnings,
    recommendations,
    score,
    suggestedKeywords,
    suggestedTitle: title,
    suggestedDescription: description,
    suggestedCategory: category
  };
}
