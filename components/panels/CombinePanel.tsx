import React, { useState, useRef } from 'react';
import { Button } from '../common/Button';
import { UploadIcon, TrashIcon, CombineIcon } from '../icons';

interface CombinePanelProps {
    secondaryImage: string | null;
    setSecondaryImage: (image: string | null) => void;
    onCombine: (prompt: string) => void;
    isLoading?: boolean;
}

export const CombinePanel: React.FC<CombinePanelProps> = ({ secondaryImage, setSecondaryImage, onCombine, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSecondaryImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCombine = () => {
        if (prompt.trim() && secondaryImage) {
            onCombine(prompt);
        }
    };

    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <CombineIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Ghép ảnh AI</h3>
                    <p className="text-xs text-zinc-400">Kết hợp hai hình ảnh với sự trợ giúp của AI.</p>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Ảnh thứ hai</label>
                    <div className="aspect-video w-full rounded-lg bg-zinc-800/50 border-2 border-dashed border-zinc-700 flex items-center justify-center relative">
                        {secondaryImage ? (
                            <>
                                <img src={secondaryImage} alt="Ảnh thứ hai" className="max-w-full max-h-full object-contain rounded-md" />
                                <button 
                                    onClick={() => setSecondaryImage(null)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-all duration-200 transform hover:scale-110 active:scale-100"
                                    title="Xóa ảnh"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-zinc-400">
                                <UploadIcon className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                                <p className="text-sm">Tải lên ảnh để ghép</p>
                                <Button onClick={handleUploadClick} variant="secondary" className="mt-3 text-xs px-3 py-1.5">
                                    Chọn ảnh
                                </Button>
                            </div>
                        )}
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                        />
                    </div>
                </div>
                 <div>
                    <label htmlFor="combine-prompt" className="block text-sm font-medium text-zinc-300 mb-2">Mô tả cách ghép ảnh</label>
                    <textarea
                        id="combine-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: đặt người từ ảnh 1 vào phong cảnh của ảnh 2"
                        className="w-full h-24 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none focus:border-cyan-500"
                        disabled={!secondaryImage}
                    />
                </div>
            </div>

            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={handleCombine} className="w-full" disabled={!prompt.trim() || !secondaryImage} isLoading={isLoading}>
                    Ghép ảnh
                </Button>
            </div>
        </div>
    );
};
