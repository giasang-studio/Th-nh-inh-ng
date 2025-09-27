import React, { useState } from 'react';
import { Button } from '../common/Button';
import { AdjustmentsIcon } from '../icons';

interface AdjustmentsPanelProps {
    onGenerativeEdit: (prompt: string) => void;
    isLoading?: boolean;
}

export const AdjustmentsPanel: React.FC<AdjustmentsPanelProps> = ({ onGenerativeEdit, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerativeAdjust = () => {
        if (prompt.trim()) {
            onGenerativeEdit(prompt);
        }
    };
    
    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <AdjustmentsIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Tùy chỉnh bằng AI</h3>
                    <p className="text-xs text-zinc-400">Sử dụng ngôn ngữ tự nhiên để điều chỉnh ảnh.</p>
                </div>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center space-y-4">
                 <div className="text-center">
                    <AdjustmentsIcon className="w-16 h-16 text-cyan-400/20 mx-auto mb-4" />
                    <p className="text-zinc-300">
                        Để AI tự động điều chỉnh ánh sáng, màu sắc và độ tương phản. 
                        Hãy mô tả thay đổi bạn muốn.
                    </p>
                </div>
                 <div>
                    <label htmlFor="generative-adjust-prompt" className="block text-sm font-medium text-zinc-300 mb-2">Mô tả của bạn</label>
                    <textarea
                        id="generative-adjust-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: làm cho ảnh trông ấm hơn và tăng độ tương phản"
                        className="w-full h-24 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none focus:border-cyan-500"
                    />
                </div>
            </div>
            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={handleGenerativeAdjust} className="w-full" isLoading={isLoading}>
                   Áp dụng
                </Button>
            </div>
        </div>
    );
};
