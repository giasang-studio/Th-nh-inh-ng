import React from 'react';
import { Button } from '../common/Button';
import { DiamondIcon } from '../icons';

interface QualityPanelProps {
    onEnhance: () => void;
    isLoading?: boolean;
}

export const QualityPanel: React.FC<QualityPanelProps> = ({ onEnhance, isLoading }) => {
    return (
        <div className="flex flex-col h-full animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
                <DiamondIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Khôi phục chất lượng</h3>
                    <p className="text-xs text-zinc-400">Tự động cải thiện độ nét và sửa lỗi.</p>
                </div>
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6 text-center">
                <DiamondIcon className="w-16 h-16 text-cyan-400/20" />
                <p className="text-zinc-300 max-w-sm">
                    Hãy để AI phân tích và nâng cao chất lượng hình ảnh của bạn. Quá trình này sẽ làm cho ảnh của bạn trở nên rõ ràng và sống động hơn.
                </p>
            </div>

            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button onClick={onEnhance} className="w-full" isLoading={isLoading}>
                    Bắt đầu khôi phục chất lượng
                </Button>
            </div>
        </div>
    );
};
