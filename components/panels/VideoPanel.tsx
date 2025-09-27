import React, { useState } from 'react';
import { Button } from '../common/Button';
import { VideoIcon } from '../icons';

interface VideoPanelProps {
    onGenerate: (prompt: string) => void;
    videoUrl: string | null;
    isLoading?: boolean;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({ onGenerate, videoUrl, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = () => {
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    return (
        <div className="flex flex-col h-full animate-slide-in">
             <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <VideoIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Tạo Video từ Ảnh</h3>
                    <p className="text-xs text-zinc-400">Tạo một đoạn video ngắn từ ảnh tĩnh.</p>
                </div>
            </div>
             <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div>
                    <label htmlFor="video-prompt" className="block text-sm font-medium text-zinc-300 mb-2">Mô tả chuyển động</label>
                    <textarea
                        id="video-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: máy ảnh lia từ từ sang phải, những đám mây di chuyển trên bầu trời"
                        className="w-full h-28 p-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none focus:border-cyan-500"
                    />
                </div>
                 {videoUrl && (
                    <div className="animate-fade-in">
                        <p className="text-sm font-medium text-zinc-300 mb-2">Kết quả:</p>
                        <div className="aspect-video w-full rounded-lg bg-black overflow-hidden">
                             <video
                                src={videoUrl}
                                controls
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>
             <div className="p-4 border-t border-zinc-800 mt-auto">
                 <p className="text-xs text-zinc-400 mb-3 text-center">Lưu ý: Quá trình tạo video có thể mất vài phút.</p>
                <Button onClick={handleGenerate} className="w-full" disabled={!prompt.trim()} isLoading={isLoading}>
                    Tạo Video
                </Button>
            </div>
        </div>
    );
};
