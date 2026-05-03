export type Tone = 'funny' | 'emotional' | 'professional' | 'romantic';
export type Language = 'english' | 'urdu' | 'hindi';
export type Theme = 'cute' | 'elegant' | 'luxury' | 'minimal';

export interface WishRequest {
  name: string;
  tone: Tone;
  language: Language;
  customPrompt?: string;
}

export interface WishResponse {
  wish: string;
  tone: Tone;
  language: Language;
  timestamp: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  theme: Theme;
  backgroundColor: string;
  gradient?: string;
  decorations: Decoration[];
  defaultFont: string;
  defaultTextColor: string;
}

export interface Decoration {
  type: 'balloon' | 'cake' | 'confetti' | 'star' | 'heart' | 'ribbon';
  x: number;
  y: number;
  size: number;
  color: string;
  rotation?: number;
}

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  angle: number;
  scaleX: number;
  scaleY: number;
  selectable: boolean;
}

export interface CanvasState {
  template: CardTemplate;
  textElements: TextElement[];
  backgroundImage?: string;
}

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality: number;
  width: number;
  height: number;
}

export const FONTS = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { name: 'Palatino', value: '"Palatino Linotype", serif' },
  { name: 'Brush Script', value: '"Brush Script MT", cursive' },
];

export const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
  '#ffc0cb', '#a52a2a', '#808080', '#ffd700', '#c0c0c0',
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
  '#dfe6e9', '#74b9ff', '#a29bfe', '#fd79a8', '#e17055',
];

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'balloon-party',
    name: 'Balloon Party',
    theme: 'cute',
    backgroundColor: '#fdf2f8',
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
    decorations: [
      { type: 'balloon', x: 50, y: 80, size: 60, color: '#ec4899', rotation: -15 },
      { type: 'balloon', x: 120, y: 60, size: 50, color: '#f59e0b', rotation: 10 },
      { type: 'balloon', x: 550, y: 90, size: 55, color: '#8b5cf6', rotation: 20 },
      { type: 'balloon', x: 480, y: 70, size: 45, color: '#10b981', rotation: -10 },
      { type: 'confetti', x: 100, y: 200, size: 8, color: '#fbbf24' },
      { type: 'confetti', x: 500, y: 250, size: 6, color: '#f472b6' },
      { type: 'confetti', x: 300, y: 150, size: 10, color: '#60a5fa' },
      { type: 'star', x: 80, y: 300, size: 25, color: '#fcd34d' },
      { type: 'star', x: 520, y: 320, size: 20, color: '#fcd34d' },
    ],
    defaultFont: 'Comic Sans MS',
    defaultTextColor: '#be185d',
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    theme: 'elegant',
    backgroundColor: '#1a1a2e',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    decorations: [
      { type: 'star', x: 50, y: 50, size: 30, color: '#ffd700' },
      { type: 'star', x: 550, y: 80, size: 25, color: '#ffd700' },
      { type: 'star', x: 100, y: 350, size: 20, color: '#c0c0c0' },
      { type: 'star', x: 500, y: 340, size: 22, color: '#c0c0c0' },
      { type: 'ribbon', x: 300, y: 40, size: 80, color: '#ffd700' },
      { type: 'heart', x: 80, y: 150, size: 20, color: '#e94560' },
      { type: 'heart', x: 520, y: 180, size: 18, color: '#e94560' },
    ],
    defaultFont: 'Georgia',
    defaultTextColor: '#ffd700',
  },
  {
    id: 'luxury-royal',
    name: 'Luxury Royal',
    theme: 'luxury',
    backgroundColor: '#2d0a31',
    gradient: 'linear-gradient(135deg, #2d0a31 0%, #4a0e4e 50%, #7209b7 100%)',
    decorations: [
      { type: 'star', x: 30, y: 40, size: 35, color: '#ffd700' },
      { type: 'star', x: 570, y: 60, size: 30, color: '#ffd700' },
      { type: 'star', x: 60, y: 360, size: 25, color: '#c77dff' },
      { type: 'star', x: 540, y: 340, size: 28, color: '#c77dff' },
      { type: 'ribbon', x: 300, y: 30, size: 100, color: '#9d4edd' },
      { type: 'heart', x: 100, y: 120, size: 25, color: '#e0aaff' },
      { type: 'heart', x: 500, y: 140, size: 22, color: '#e0aaff' },
      { type: 'confetti', x: 150, y: 200, size: 8, color: '#ffd700' },
      { type: 'confetti', x: 450, y: 250, size: 6, color: '#ffd700' },
    ],
    defaultFont: 'Palatino',
    defaultTextColor: '#ffd700',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    theme: 'minimal',
    backgroundColor: '#ffffff',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
    decorations: [
      { type: 'heart', x: 100, y: 80, size: 20, color: '#ec4899' },
      { type: 'heart', x: 500, y: 90, size: 18, color: '#ec4899' },
      { type: 'star', x: 80, y: 340, size: 15, color: '#fbbf24' },
      { type: 'star', x: 520, y: 330, size: 14, color: '#fbbf24' },
    ],
    defaultFont: 'Arial',
    defaultTextColor: '#1e293b',
  },
  {
    id: 'cake-celebration',
    name: 'Cake Celebration',
    theme: 'cute',
    backgroundColor: '#fff7ed',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    decorations: [
      { type: 'cake', x: 300, y: 280, size: 120, color: '#f97316' },
      { type: 'balloon', x: 60, y: 100, size: 50, color: '#ec4899', rotation: -20 },
      { type: 'balloon', x: 540, y: 120, size: 45, color: '#8b5cf6', rotation: 15 },
      { type: 'confetti', x: 120, y: 180, size: 8, color: '#fbbf24' },
      { type: 'confetti', x: 480, y: 200, size: 6, color: '#f472b6' },
      { type: 'star', x: 90, y: 320, size: 22, color: '#fcd34d' },
      { type: 'star', x: 510, y: 310, size: 20, color: '#fcd34d' },
    ],
    defaultFont: 'Comic Sans MS',
    defaultTextColor: '#c2410c',
  },
  {
    id: 'midnight-sparkle',
    name: 'Midnight Sparkle',
    theme: 'elegant',
    backgroundColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    decorations: [
      { type: 'star', x: 40, y: 50, size: 20, color: '#60a5fa' },
      { type: 'star', x: 560, y: 70, size: 18, color: '#60a5fa' },
      { type: 'star', x: 80, y: 350, size: 15, color: '#c084fc' },
      { type: 'star', x: 520, y: 340, size: 16, color: '#c084fc' },
      { type: 'star', x: 300, y: 100, size: 25, color: '#fcd34d' },
      { type: 'heart', x: 120, y: 160, size: 18, color: '#f472b6' },
      { type: 'heart', x: 480, y: 170, size: 16, color: '#f472b6' },
      { type: 'confetti', x: 200, y: 250, size: 5, color: '#60a5fa' },
      { type: 'confetti', x: 400, y: 280, size: 4, color: '#c084fc' },
    ],
    defaultFont: 'Verdana',
    defaultTextColor: '#e2e8f0',
  },
];

export const TONE_LABELS: Record<Tone, string> = {
  funny: '😄 Funny',
  emotional: '💕 Emotional',
  professional: '💼 Professional',
  romantic: '💝 Romantic',
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  english: '🇺🇸 English',
  urdu: '🇵🇰 Urdu',
  hindi: '🇮🇳 Hindi',
};

export const THEME_LABELS: Record<Theme, string> = {
  cute: '🎈 Cute',
  elegant: '✨ Elegant',
  luxury: '👑 Luxury',
  minimal: '📋 Minimal',
};
