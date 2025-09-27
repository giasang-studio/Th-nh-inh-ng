// Fix: Create the MarketingPanel component to resolve the module not found error.
import React, { useState, useRef } from 'react';
import { Button } from '../common/Button';
import { UploadIcon, TrashIcon, MarketingIcon, RefreshIcon } from '../icons';
import * as geminiService from '../../services/geminiService';


interface ImageUploaderProps {
    title: string;
    image: string | null;
    setImage: (image: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, image, setImage }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
         if (e.target) {
            e.target.value = '';
        }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">{title}</label>
            <div className="aspect-video w-full rounded-lg bg-zinc-800/50 border-2 border-dashed border-zinc-700 flex items-center justify-center relative">
                {image ? (
                    <>
                        <img src={image} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
                        <button 
                            onClick={() => setImage(null)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-all duration-200 transform hover:scale-110 active:scale-100"
                            title="Xóa ảnh"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="text-center text-zinc-400 p-4">
                        <UploadIcon className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                        <button onClick={() => inputRef.current?.click()} className="text-sm text-cyan-400 hover:underline">
                            Tải ảnh lên
                        </button>
                    </div>
                )}
                 <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
            </div>
        </div>
    );
}


interface MarketingPanelProps {
    characterImage: string | null;
    setCharacterImage: (image: string | null) => void;
    productImage: string | null;
    setProductImage: (image: string | null) => void;
    onGenerate: (style: string, prompt: string) => void;
    isLoading?: boolean;
}

const marketingStyles = ["Tối giản", "Sống động", "Doanh nghiệp", "Sang trọng", "Vui tươi", "Tương lai"];

export const MarketingPanel: React.FC<MarketingPanelProps> = ({ 
    characterImage,
    setCharacterImage,
    productImage,
    setProductImage,
    onGenerate,
    isLoading
}) => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState(marketingStyles[0]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);


    const handleGenerate = () => {
        if (characterImage && productImage) {
            onGenerate(style, prompt);
        }
    };

    const handleGetSuggestions = async () => {
        if (!characterImage || !productImage) return;
        setIsSuggesting(true);
        setSuggestionError(null);
        try {
            const result = await geminiService.getMarketingSuggestions(characterImage, productImage);
            setSuggestions(result);
        } catch (error) {
            setSuggestionError(error instanceof Error ? error.message : "Lỗi không xác định");
        } finally {
            setIsSuggesting(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <MarketingIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Tạo Ảnh Marketing</h3>
                    <p className="text-xs text-zinc-400">Tạo hình ảnh quảng cáo ấn tượng.</p>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <ImageUploader title="Ảnh nhân vật hoặc người mẫu" image={characterImage} setImage={setCharacterImage} />
                <ImageUploader title="Ảnh sản phẩm" image={productImage} setImage={setProductImage} />

                <div>
                    <label htmlFor="marketing-style" className="block text-sm font-medium text-zinc-300 mb-2">Phong cách</label>
                    <select
                        id="marketing-style"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        disabled={!characterImage || !productImage}
                    >
                        {marketingStyles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div>
                     <div className="flex justify-between items-center mb-2">
                         <label htmlFor="marketing-prompt" className="block text-sm font-medium text-zinc-300">Mô tả ý tưởng (tùy chọn)</label>
                         <button 
                            onClick={handleGetSuggestions} 
                            disabled={isSuggesting || !characterImage || !productImage}
                            className="flex items-center text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                            title="Lấy gợi ý từ AI"
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
                    <textarea
                        id="marketing-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: nhân vật đang cầm sản phẩm trên nền trời đêm đầy sao"
                        className="w-full h-20 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                        disabled={!characterImage || !productImage}
                    />
                </div>
                 {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(p => (
                            <button 
                                key={p}
                                onClick={() => setPrompt(p)}
                                className="px-2.5 py-1 bg-zinc-800 hover:bg-cyan-500/50 rounded-full text-xs text-zinc-300 transition-all duration-200 transform hover:scale-105 active:scale-100"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
                {suggestionError && <p className="text-xs text-red-400 mt-2">{suggestionError}</p>}
            </div>

            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={handleGenerate} className="w-full" disabled={!characterImage || !productImage} isLoading={isLoading}>
                    Tạo ảnh
                </Button>
            </div>
        </div>
    );
};
