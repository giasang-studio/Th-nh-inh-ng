
export interface Adjustments {
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  grayscale: number;
  invert: number;
  hueRotate: number;
}

export const initialAdjustments: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  hueRotate: 0,
};

export type Tool = 
  | 'ai'
  | 'magic-fill'
  | 'adjust'
  | 'filters'
  | 'combine'
  | 'marketing'
  | 'video'
  | 'restore'
  | 'quality'
  | 'extract-text';

export type FilterType =
  | 'none'
  | 'vintage'
  | 'lomo'
  | 'clarity'
  | 'sinCity'
  | 'sunrise'
  | 'crossProcess'
  | 'orangePeel'
  | 'love'
  | 'grungy'
  | 'jarques'
  | 'pinhole'
  | 'oldBoot'
  | 'glowingSun'
  | 'hazyDays'
  | 'herMajesty'
  | 'nostalgia'
  | 'hemingway'
  | 'concentrate';
