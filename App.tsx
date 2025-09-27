
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
// Fix: Use relative paths for local modules.
import { Editor } from './components/Editor';
import { Adjustments, initialAdjustments, Tool } from './types';
import { downloadImage } from './utils/canvasUtils';
// Fix: Use relative paths for local modules.
import { ImageDisplayHandle } from './components/ImageDisplay';
import { ToolSelector } from './components/ToolSelector';

// A simple history hook for undo/redo
const useHistory = <T,>(initialState: T) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: React.SetStateAction<T>, overwrite = false) => {
    const newState = typeof action === 'function' ? (action as (prevState: T) => T)(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedHistory = history.slice(0, index + 1);
      setHistory([...updatedHistory, newState]);
      setIndex(index + 1);
    }
  };

  const undo = () => index > 0 && setIndex(index - 1);
  const redo = () => index < history.length - 1 && setIndex(index + 1);

  return [history[index], setState, undo, redo, index > 0, index < history.length - 1, setHistory, setIndex] as const;
};


function App() {
  const [image, setImage, undoImage, redoImage, canUndo, canRedo, setImageHistory, setImageIndex] = useHistory<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Adjustments>(initialAdjustments);
  const [selectedTool, setSelectedTool] = useState<Tool>('ai');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const imageDisplayRef = useRef<ImageDisplayHandle>(null);


  const handleUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result, true); // Overwrite history with new image
      setOriginalImage(result);
      setAdjustments(initialAdjustments);
      setVideoUrl(null);
      setSelectedTool('ai');
    };
    reader.readAsDataURL(file);
  }, [setImage]);

  const handleDownload = useCallback(() => {
    if (imageDisplayRef.current) {
      const dataUrl = imageDisplayRef.current.getCanvasWithFilters();
      if (dataUrl) {
        downloadImage(dataUrl);
      }
    }
  }, []);
  
  const handleHistoryReset = useCallback(() => {
    if (originalImage) {
      setImageHistory([originalImage]);
      setImageIndex(0);
      setAdjustments(initialAdjustments);
      setVideoUrl(null);
    }
  }, [originalImage, setImageHistory, setImageIndex]);


  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-200 font-sans">
      <Header
        onUpload={handleUpload}
        onDownload={handleDownload}
        onReset={handleHistoryReset}
        hasImage={!!image}
        onUndo={undoImage}
        onRedo={redoImage}
        canUndo={canUndo}
        canRedo={canRedo}
      >
        <ToolSelector
            selectedTool={selectedTool}
            onSelectTool={setSelectedTool}
            hasImage={!!image}
        />
      </Header>
      <main className="flex-1 flex overflow-hidden">
        <Editor
          image={image}
          setImage={setImage}
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          selectedTool={selectedTool}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          loadingMessage={loadingMessage}
          setLoadingMessage={setLoadingMessage}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          originalImage={originalImage}
          imageDisplayRef={imageDisplayRef}
          onUpload={handleUpload}
        />
      </main>
    </div>
  );
}

export default App;