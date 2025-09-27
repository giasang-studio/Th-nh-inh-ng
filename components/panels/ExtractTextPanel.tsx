import React from 'react';
import { Button } from '../common/Button';
import { TextIcon } from '../icons';

interface ExtractTextPanelProps {
    onExtract: () => void;
    extractedText: string;
    isExtracting: boolean;
    error: string | null;
}

export const ExtractTextPanel: React.FC<ExtractTextPanelProps> = ({ onExtract, extractedText, isExtracting, error }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(extractedText);
    };

    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <TextIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Trích xuất văn bản</h3>
                    <p className="text-xs text-zinc-400">Nhận dạng và trích xuất văn bản từ hình ảnh.</p>
                </div>
            </div>

            <div className="flex-1 p-4 flex flex-col space-y-4">
                <div className="flex-1 p-3 bg-zinc-950 rounded-lg relative overflow-y-auto border border-zinc-800">
                    {isExtracting ? (
                         <div className="flex items-center justify-center h-full">
                            <p className="text-zinc-400">Đang trích xuất...</p>
                         </div>
                    ) : (
                        <pre className="text-sm text-zinc-200 whitespace-pre-wrap font-sans">
                           {extractedText || "Văn bản được trích xuất sẽ xuất hiện ở đây."}
                        </pre>
                    )}
                </div>
                {extractedText && !isExtracting && !error && (
                     <Button onClick={handleCopy} variant="secondary">
                        Sao chép văn bản
                    </Button>
                )}
            </div>

            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={onExtract} className="w-full" isLoading={isExtracting}>
                    <TextIcon className="w-5 h-5 mr-2"/>
                    Bắt đầu trích xuất
                </Button>
            </div>
        </div>
    );
};
