import React, { useState } from 'react';
import { Button } from '../common/Button';
import { RestoreIcon } from '../icons';

interface RestorePanelProps {
    onRestore: (options: { fixScratches: boolean; colorize: boolean; enhanceFaces: boolean; }) => void;
    isLoading?: boolean;
}

export const RestorePanel: React.FC<RestorePanelProps> = ({ onRestore, isLoading }) => {
    const [options, setOptions] = useState({
        fixScratches: true,
        colorize: true,
        enhanceFaces: true,
    });

    const handleOptionChange = (option: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [option]: !prev[option] }));
    };

    const restoreOptions = [
        { id: 'fixScratches', label: 'Sửa vết xước & hư hỏng' },
        { id: 'colorize', label: 'Tô màu (cho ảnh đen trắng)' },
        { id: 'enhanceFaces', label: 'Nâng cao chi tiết khuôn mặt' },
    ];

    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <RestoreIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Phục hồi ảnh cũ</h3>
                    <p className="text-xs text-zinc-400">Sửa chữa và cải thiện chất lượng ảnh cũ, bị hỏng.</p>
                </div>
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6 text-center">
                 <RestoreIcon className="w-16 h-16 text-cyan-400/20" />
                 <p className="text-zinc-300 max-w-sm">
                    AI sẽ phân tích ảnh của bạn và cố gắng sửa chữa các khuyết điểm, làm rõ các chi tiết và thậm chí tô màu nếu cần.
                 </p>

                <div className="space-y-3 self-stretch">
                    <p className="text-sm font-medium text-zinc-300 text-left">Tùy chọn phục hồi:</p>
                    {restoreOptions.map(opt => (
                         <label key={opt.id} className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500 transition-all duration-200">
                             <input
                                type="checkbox"
                                checked={options[opt.id as keyof typeof options]}
                                onChange={() => handleOptionChange(opt.id as keyof typeof options)}
                                className="h-5 w-5 rounded border-zinc-600 text-cyan-500 bg-zinc-950 focus:ring-cyan-600"
                            />
                            <span className="text-sm text-zinc-200">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={() => onRestore(options)} className="w-full" isLoading={isLoading}>
                    Bắt đầu phục hồi
                </Button>
            </div>
        </div>
    );
};
