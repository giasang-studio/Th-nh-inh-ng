import React from 'react';
import { FilterType, Adjustments } from '../../types';
import { FilterIcon } from '../icons';

interface FiltersPanelProps {
    activeFilter: FilterType;
    setActiveFilter: (filter: FilterType) => void;
    filterPresets: Record<FilterType, Adjustments>;
    image: string | null;
}

const filterNames: Record<FilterType, string> = {
    'none': 'Gốc',
    'vintage': 'Cổ điển',
    'lomo': 'Lomo',
    'clarity': 'Rõ nét',
    'sinCity': 'Sin City',
    'sunrise': 'Bình minh',
    'crossProcess': 'Cross Process',
    'orangePeel': 'Vỏ cam',
    'love': 'Tình yêu',
    'grungy': 'Bụi bặm',
    'jarques': 'Jarques',
    'pinhole': 'Pinhole',
    'oldBoot': 'Old Boot',
    'glowingSun': 'Nắng rực rỡ',
    'hazyDays': 'Ngày mờ sương',
    'herMajesty': 'Her Majesty',
    'nostalgia': 'Hoài niệm',
    'hemingway': 'Hemingway',
    'concentrate': 'Tập trung',
};


export const FiltersPanel: React.FC<FiltersPanelProps> = ({ activeFilter, setActiveFilter, filterPresets, image }) => {
    return (
         <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <FilterIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Bộ lọc</h3>
                    <p className="text-xs text-zinc-400">Chọn một bộ lọc để áp dụng cho ảnh.</p>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-3 gap-3">
                    {Object.keys(filterPresets).map(filterKey => {
                        const filterName = filterKey as FilterType;
                        const adjustments = filterPresets[filterName];
                        const filterStyle = {
                            filter: `
                                brightness(${adjustments.brightness / 100})
                                contrast(${adjustments.contrast / 100})
                                saturate(${adjustments.saturate / 100})
                                sepia(${adjustments.sepia / 100})
                                grayscale(${adjustments.grayscale / 100})
                                invert(${adjustments.invert / 100})
                                hue-rotate(${adjustments.hueRotate}deg)
                            `,
                        };

                        return (
                            <button
                                key={filterName}
                                onClick={() => setActiveFilter(filterName)}
                                className={`aspect-square w-full rounded-lg overflow-hidden bg-zinc-800 text-white text-xs relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-cyan-400 transition-all duration-200 transform hover:scale-105 active:scale-100 hover:shadow-lg hover:shadow-cyan-400/40 ${activeFilter === filterName ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-zinc-900 shadow-xl shadow-cyan-400/30' : ''}`}
                            >
                                <img src={image || ''} alt={filterName} style={filterStyle} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30"></div>
                                <span className="absolute bottom-1 left-1 right-1 text-center font-medium p-1 bg-black/50 rounded-sm truncate text-xs">{filterNames[filterName]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};