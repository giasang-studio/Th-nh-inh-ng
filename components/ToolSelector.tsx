import React from 'react';
import { Tool } from '../types';
// Fix: Import the new MagicFillIcon
import { WandIcon, AdjustmentsIcon, FilterIcon, CombineIcon, VideoIcon, RestoreIcon, DiamondIcon, TextIcon, MarketingIcon, MagicFillIcon } from './icons';

interface ToolSelectorProps {
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  hasImage: boolean;
}

// Fix: Add the 'magic-fill' tool to the tools array to make it selectable in the UI.
const tools: { id: Tool; name: string; icon: React.FC<any>; }[] = [
  { id: 'ai', name: 'Chỉnh sửa AI', icon: WandIcon },
  { id: 'magic-fill', name: 'Magic Fill', icon: MagicFillIcon },
  { id: 'adjust', name: 'Tùy chỉnh', icon: AdjustmentsIcon },
  { id: 'filters', name: 'Bộ lọc', icon: FilterIcon },
  { id: 'combine', name: 'Ghép ảnh', icon: CombineIcon },
  { id: 'marketing', name: 'Ảnh Marketing', icon: MarketingIcon },
  { id: 'video', name: 'Tạo Video', icon: VideoIcon },
  { id: 'restore', name: 'Phục hồi ảnh', icon: RestoreIcon },
  { id: 'quality', name: 'Khôi phục chất lượng', icon: DiamondIcon },
  { id: 'extract-text', name: 'Trích xuất văn bản', icon: TextIcon },
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTool, onSelectTool, hasImage }) => {
  if (!hasImage) {
    return <div className="h-10"></div>; // Placeholder to maintain layout
  }

  return (
    <div className="flex items-center justify-center p-1 bg-zinc-900/60 rounded-xl space-x-1">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onSelectTool(tool.id)}
          disabled={!hasImage}
          className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedTool === tool.id
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transform hover:scale-110 active:scale-100'
          }`}
          title={tool.name}
        >
          <tool.icon className="w-6 h-6" />
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-950 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 shadow-lg border border-zinc-800">
            {tool.name}
          </span>
        </button>
      ))}
    </div>
  );
};
