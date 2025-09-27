import React, { useState, useEffect } from 'react';
import { Tool, Adjustments, FilterType } from '../types';
import { AIPanel } from './panels/AIPanel';
import { AdjustmentsPanel } from './panels/AdjustmentsPanel';
import { FiltersPanel } from './panels/FiltersPanel';
import { CombinePanel } from './panels/CombinePanel';
import { MarketingPanel } from './panels/MarketingPanel';
import { VideoPanel } from './panels/VideoPanel';
import { RestorePanel } from './panels/RestorePanel';
import { QualityPanel } from './panels/QualityPanel';
import { ExtractTextPanel } from './panels/ExtractTextPanel';
import { MagicFillPanel } from './panels/MagicFillPanel';
// Fix: Corrected import path for geminiService.
import * as geminiService from '../services/geminiService';
// Fix: Corrected import path for getFilterPresets.
import { getFilterPresets } from '../utils/canvasUtils';
import { WandIcon } from './icons';
import { ImageDisplayHandle } from './ImageDisplay';

interface ControlPanelProps {
  image: string | null;
  setImage: (action: React.SetStateAction<string | null>) => void;
  adjustments: Adjustments;
  setAdjustments: (adjustments: Adjustments) => void;
  selectedTool: Tool;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage: string | null;
  setLoadingMessage: (message: string | null) => void;
  videoUrl: string | null;
  setVideoUrl: (url: string | null) => void;
  imageDisplayRef: React.RefObject<ImageDisplayHandle>;
  isMasking: boolean;
  setIsMasking: (isMasking: boolean) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  image,
  setImage,
  adjustments,
  setAdjustments,
  selectedTool,
  isLoading,
  setIsLoading,
  loadingMessage,
  setLoadingMessage,
  videoUrl,
  setVideoUrl,
  imageDisplayRef,
  isMasking,
  setIsMasking,
  brushSize,
  setBrushSize
}) => {
  const [secondaryImage, setSecondaryImage] = useState<string | null>(null);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('none');
  const filterPresets = getFilterPresets();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  useEffect(() => {
    setAdjustments(filterPresets[activeFilter]);
  }, [activeFilter, setAdjustments]);

  useEffect(() => {
    if (selectedTool !== 'ai') {
        setIsMasking(false);
    }
    imageDisplayRef.current?.clearMask();
  }, [selectedTool, image, imageDisplayRef, setIsMasking]);

  const handleGetSuggestions = async () => {
    if (!image) return;
    setIsSuggesting(true);
    setSuggestionError(null);
    try {
        const suggestions = await geminiService.getAiSuggestions(image);
        setAiSuggestions(suggestions);
    } catch (error) {
        setSuggestionError(error instanceof Error ? error.message : "Unknown error");
    } finally {
        setIsSuggesting(false);
    }
  };

  const performGenerativeAction = async (
    action: () => Promise<string>,
    loadingMessage: string
  ) => {
    setIsLoading(true);
    setLoadingMessage(loadingMessage);
    try {
      const result = await action();
      setImage(result);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
      imageDisplayRef.current?.clearMask();
      setIsMasking(false);
    }
  };
  
  const handleAiGenerate = (prompt: string) => {
    if (!image) return;
    const mask = isMasking ? imageDisplayRef.current?.getMask() : null;
    performGenerativeAction(
        () => geminiService.performAiEdit(image, prompt, mask), 
        "AI đang xử lý..."
    );
  };
  
  const handleGenerativeAdjust = (prompt: string) => {
      if (!image) return;
      performGenerativeAction(
          // Fix: Pass `null` for the mask argument as `performAiEdit` expects three arguments.
          () => geminiService.performAiEdit(image, `Adjust the image: ${prompt}`, null),
          "AI đang điều chỉnh..."
      );
  }

  const handleCombine = (prompt: string) => {
      if (!image || !secondaryImage) return;
      performGenerativeAction(
          () => geminiService.combineImages(image, secondaryImage, prompt),
          "AI đang ghép ảnh..."
      );
  };

  const handleMarketingGenerate = (style: string, prompt: string) => {
      if (!characterImage || !productImage) return;
      performGenerativeAction(
          () => geminiService.createMarketingImage(characterImage, productImage, style, prompt),
          "Đang tạo ảnh marketing..."
      );
  };

  const handleVideoGenerate = async (prompt: string) => {
    if (!image) return;
    setIsLoading(true);
    setVideoUrl(null);
    setLoadingMessage("Đang tạo video, quá trình này có thể mất vài phút...");
    try {
        const url = await geminiService.generateVideo(image, prompt);
        setVideoUrl(url);
    } catch (error) {
        alert(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
        setIsLoading(false);
        setLoadingMessage(null);
    }
  };

  const handleRestore = (options: { fixScratches: boolean; colorize: boolean; enhanceFaces: boolean; }) => {
    if (!image) return;
    performGenerativeAction(
        () => geminiService.restorePhoto(image, options),
        "Đang phục hồi ảnh..."
    );
  };

  const handleEnhanceQuality = () => {
    if (!image) return;
    performGenerativeAction(
        () => geminiService.enhanceQuality(image),
        "Đang khôi phục chất lượng..."
    );
  };

  const handleExtractText = async () => {
    if (!image) return;
    setIsExtracting(true);
    setExtractError(null);
    setExtractedText('');
    try {
        const text = await geminiService.extractTextFromImage(image);
        setExtractedText(text);
    } catch(error) {
        setExtractError(error instanceof Error ? error.message : "Failed to extract text.");
    } finally {
        setIsExtracting(false);
    }
  };

  const handleMagicExpand = (config: { direction: 'top' | 'bottom' | 'left' | 'right', percentage: number }, prompt: string) => {
      if (!image) return;
      performGenerativeAction(
          () => geminiService.expandImage(image, config, prompt),
          "Đang mở rộng ảnh..."
      );
  }

  const renderPanel = () => {
    switch (selectedTool) {
      case 'ai':
        return <AIPanel 
                    onGenerate={handleAiGenerate} 
                    isMasking={isMasking}
                    setIsMasking={setIsMasking}
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    aiSuggestions={aiSuggestions}
                    onGetSuggestions={handleGetSuggestions}
                    isSuggesting={isSuggesting}
                    suggestionError={suggestionError}
                    isLoading={isLoading}
                />;
      case 'adjust':
        return <AdjustmentsPanel onGenerativeEdit={handleGenerativeAdjust} isLoading={isLoading} />;
      case 'filters':
        return <FiltersPanel activeFilter={activeFilter} setActiveFilter={setActiveFilter} filterPresets={filterPresets} image={image}/>;
      case 'combine':
        return <CombinePanel secondaryImage={secondaryImage} setSecondaryImage={setSecondaryImage} onCombine={handleCombine} isLoading={isLoading} />;
      case 'marketing':
        return <MarketingPanel characterImage={characterImage} setCharacterImage={setCharacterImage} productImage={productImage} setProductImage={setProductImage} onGenerate={handleMarketingGenerate} isLoading={isLoading} />;
      case 'video':
        return <VideoPanel onGenerate={handleVideoGenerate} videoUrl={videoUrl} isLoading={isLoading} />;
      case 'restore':
        return <RestorePanel onRestore={handleRestore} isLoading={isLoading} />;
      case 'quality':
        return <QualityPanel onEnhance={handleEnhanceQuality} isLoading={isLoading} />;
      case 'extract-text':
        return <ExtractTextPanel onExtract={handleExtractText} extractedText={extractedText} isExtracting={isExtracting} error={extractError} />;
      case 'magic-fill':
          return <MagicFillPanel onExpand={handleMagicExpand} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  if (!image) {
    return (
        <aside className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col items-center justify-center text-center p-8">
            <WandIcon className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">Chào mừng đến Studio Ảnh AI</h3>
            <p className="text-sm text-zinc-500">Tải ảnh lên để bắt đầu chỉnh sửa.</p>
        </aside>
    );
  }
  
  return (
    <aside className="w-[26rem] bg-zinc-900 border-l border-zinc-800 flex flex-col relative flex-shrink-0">
        {isLoading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
                 <svg className="animate-spin h-8 w-8 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-zinc-200 text-sm font-medium">{loadingMessage || 'Đang xử lý...'}</p>
            </div>
        )}
        {renderPanel()}
    </aside>
  );
};
