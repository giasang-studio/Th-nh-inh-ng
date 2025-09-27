// Fix: Create the MagicFillPanel component to resolve module not found errors.
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Slider } from '../common/Slider';
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, MagicFillIcon } from '../icons';

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface MagicFillPanelProps {
    onExpand: (config: { direction: Direction, percentage: number }, prompt: string) => void;
    isLoading?: boolean;
}

const directionLabels: Record<Direction, string> = {
    top: 'lên trên',
    bottom: 'xuống dưới',
    left: 'sang trái',
    right: 'sang phải',
};

export const MagicFillPanel: React.FC<MagicFillPanelProps> = ({ onExpand, isLoading }) => {
    const [direction, setDirection] = useState<Direction>('top');
    const [percentage, setPercentage] = useState(25);
    const [prompt, setPrompt] = useState('');

    const handleExpand = () => {
        onExpand({ direction, percentage }, prompt);
    };

    const directionButtons: { dir: Direction, icon: React.FC<any> }[] = [
        { dir: 'top', icon: ArrowUpIcon },
        { dir: 'left', icon: ArrowLeftIcon },
        { dir: 'right', icon: ArrowRightIcon },
        { dir: 'bottom', icon: ArrowDownIcon },
    ];

    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <MagicFillIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Lấp đầy & Mở rộng AI</h3>
                    <p className="text-xs text-zinc-400">Mở rộng khung ảnh của bạn bằng AI một cách thông minh.</p>
                </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Hướng mở rộng</label>
                    <div className="grid grid-cols-4 gap-2">
                        {directionButtons.map(({ dir, icon: Icon }) => (
                            <button
                                key={dir}
                                onClick={() => setDirection(dir)}
                                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                                    direction === dir ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-zinc-800 border-zinc-700 hover:border-cyan-600 text-zinc-400'
                                }`}
                                title={`Mở rộng về phía ${directionLabels[dir]}`}
                            >
                                <Icon className="w-6 h-6" />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="expand-percentage" className="block text-sm font-medium text-zinc-300 mb-1">
                        Kích thước mở rộng: {percentage}%
                    </label>
                    <Slider
                        id="expand-percentage"
                        min="10"
                        max="100"
                        step="5"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                    />
                     <p className="text-xs text-zinc-500 mt-2">Lưu ý: Kích thước chỉ là tương đối. AI sẽ cố gắng tiếp tục hình ảnh một cách tự nhiên dựa trên hướng đã chọn.</p>
                </div>

                <div>
                    <label htmlFor="expand-prompt" className="block text-sm font-medium text-zinc-300 mb-2">Chỉ dẫn thêm (tùy chọn)</label>
                    <textarea
                        id="expand-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: thêm một khu rừng rậm rạp"
                        className="w-full h-20 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    />
                </div>
            </div>
            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={handleExpand} className="w-full" isLoading={isLoading}>
                    Mở rộng
                </Button>
            </div>
        </div>
    );
};
