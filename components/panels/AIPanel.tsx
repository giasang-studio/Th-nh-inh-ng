import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Slider } from '../common/Slider';
import { RefreshIcon, WandIcon } from '../icons';

interface AIPanelProps {
    onGenerate: (prompt: string) => void;
    isMasking: boolean;
    setIsMasking: (isMasking: boolean) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    aiSuggestions: string[];
    onGetSuggestions: () => void;
    isSuggesting: boolean;
    suggestionError: string | null;
    isLoading?: boolean;
}

const examplePrompts = [
    "thay đổi bầu trời thành cảnh hoàng hôn",
    "biến đối tượng thành tượng vàng",
    "thêm một con mèo đang ngồi trên ghế",
    "tạo hiệu ứng mưa rơi",
    "thay nền thành bãi biển nhiệt đới",
];

export const AIPanel: React.FC<AIPanelProps> = ({ 
    onGenerate, 
    isMasking, 
    setIsMasking, 
    brushSize, 
    setBrushSize,
    aiSuggestions,
    onGetSuggestions,
    isSuggesting,
    suggestionError,
    isLoading
}) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = () => {
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };
    
    const handlePromptSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion);
    };

    const suggestionsToShow = aiSuggestions.length > 0 ? aiSuggestions : examplePrompts;

    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <WandIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Chỉnh sửa AI Sáng tạo</h3>
                    <p className="text-xs text-zinc-400">Mô tả các thay đổi bạn muốn.</p>
                </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div>
                    <label htmlFor="ai-prompt" className="block text-sm font-medium text-zinc-300 mb-2">Mô tả của bạn</label>
                    <textarea
                        id="ai-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: thêm một chiếc mũ cao bồi cho người trong ảnh"
                        className="w-full h-24 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                         <p className="text-sm font-medium text-zinc-300">Gợi ý:</p>
                         <button 
                            onClick={onGetSuggestions} 
                            disabled={isSuggesting}
                            className="flex items-center text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-wait transition-transform transform hover:scale-105"
                            title="Lấy gợi ý từ AI dựa trên ảnh của bạn"
                        >
                            {isSuggesting ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <RefreshIcon className="w-4 h-4 mr-1.5"/>
                            )}
                            Gợi ý từ AI
                         </button>
                    </div>
                     <div className="flex flex-wrap gap-2">
                        {suggestionsToShow.map(p => (
                            <button 
                                key={p}
                                onClick={() => handlePromptSuggestionClick(p)}
                                className="px-2.5 py-1 bg-zinc-800 hover:bg-cyan-500/50 rounded-full text-xs text-zinc-300 transition-all duration-200 transform hover:scale-105 active:scale-100"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    {suggestionError && <p className="text-xs text-red-400 mt-2">{suggestionError}</p>}
                </div>

                <div className="p-3 bg-black/20 rounded-lg space-y-3 border border-zinc-800">
                    <div className="flex items-center justify-between">
                        <label htmlFor="masking-toggle" className="text-sm font-medium text-zinc-300">Chỉnh sửa khu vực cụ thể</label>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="masking-toggle" className="sr-only peer" checked={isMasking} onChange={e => setIsMasking(e.target.checked)} />
                            <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                   
                    {isMasking && (
                        <div className="space-y-2 animate-fade-in">
                             <p className="text-xs text-zinc-400">Dùng chuột để tô lên vùng ảnh bạn muốn AI chỉnh sửa.</p>
                             <div>
                                <label htmlFor="brush-size" className="block text-xs font-medium text-zinc-300 mb-1">Kích thước cọ: {brushSize}</label>
                                <Slider 
                                    id="brush-size"
                                    min="5" 
                                    max="100" 
                                    step="1"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                />
                             </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={handleGenerate} className="w-full" isLoading={isLoading}>
                    Tạo
                </Button>
            </div>
        </div>
    );
};
