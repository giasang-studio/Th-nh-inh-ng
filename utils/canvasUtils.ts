import { Adjustments, FilterType } from '../types';
import { initialAdjustments } from '../types';

export const FILTER_PRESETS: Record<FilterType, Adjustments> = {
    'none': initialAdjustments,
    'vintage': { ...initialAdjustments, sepia: 60, saturate: 120, brightness: 105, contrast: 105 },
    'lomo': { ...initialAdjustments, contrast: 150, saturate: 150 },
    'clarity': { ...initialAdjustments, contrast: 130, saturate: 110, brightness: 105 },
    'sinCity': { ...initialAdjustments, grayscale: 100, contrast: 160, brightness: 90 },
    'sunrise': { ...initialAdjustments, saturate: 150, contrast: 120, brightness: 110, hueRotate: -10 },
    'crossProcess': { ...initialAdjustments, saturate: 140, contrast: 110, sepia: 20 },
    'orangePeel': { ...initialAdjustments, saturate: 160, sepia: 30, hueRotate: -15 },
    'love': { ...initialAdjustments, saturate: 130, hueRotate: -5, brightness: 105 },
    'grungy': { ...initialAdjustments, contrast: 150, brightness: 90, saturate: 110 },
    'jarques': { ...initialAdjustments, sepia: 35, contrast: 120, saturate: 130 },
    'pinhole': { ...initialAdjustments, brightness: 95, contrast: 140, sepia: 25 },
    'oldBoot': { ...initialAdjustments, sepia: 50, saturate: 140, contrast: 110 },
    'glowingSun': { ...initialAdjustments, saturate: 120, brightness: 110, contrast: 90 },
    'hazyDays': { ...initialAdjustments, contrast: 90, saturate: 120, sepia: 20 },
    'herMajesty': { ...initialAdjustments, brightness: 110, saturate: 130, contrast: 110 },
    'nostalgia': { ...initialAdjustments, sepia: 70, saturate: 120, contrast: 105 },
    'hemingway': { ...initialAdjustments, sepia: 40, contrast: 120, brightness: 105, saturate: 90 },
    'concentrate': { ...initialAdjustments, contrast: 150, saturate: 110, brightness: 95, sepia: 15 },
};

export const getFilterPresets = (): Record<FilterType, Adjustments> => {
    return FILTER_PRESETS;
};

export const applyFilter = (filter: Adjustments): Adjustments => {
    return { ...initialAdjustments, ...filter };
};

export const downloadImage = (dataUrl: string, filename = 'edited-photo.png') => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getCanvasWithFilters = (imageElement: HTMLImageElement, adjustments: Adjustments): string => {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const filterString = `
        brightness(${adjustments.brightness / 100})
        contrast(${adjustments.contrast / 100})
        saturate(${adjustments.saturate / 100})
        sepia(${adjustments.sepia / 100})
        grayscale(${adjustments.grayscale / 100})
        invert(${adjustments.invert / 100})
        hue-rotate(${adjustments.hueRotate}deg)
    `.trim();

    ctx.filter = filterString;
    ctx.drawImage(imageElement, 0, 0);

    return canvas.toDataURL('image/png');
};
