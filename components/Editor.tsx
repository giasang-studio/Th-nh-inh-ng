
import React, { useState } from 'react';
import { Adjustments, Tool } from '../types';
import { ImageDisplay, ImageDisplayHandle } from './ImageDisplay';
import { ControlPanel } from './ControlPanel';

interface EditorProps {
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
    originalImage: string | null;
    imageDisplayRef: React.RefObject<ImageDisplayHandle>;
    onUpload: (file: File) => void;
}

export const Editor: React.FC<EditorProps> = (props) => {
    const [isMasking, setIsMasking] = useState(false);
    const [brushSize, setBrushSize] = useState(30);

    return (
        <>
            <ImageDisplay 
                image={props.image} 
                adjustments={props.adjustments}
                isMasking={isMasking}
                brushSize={brushSize}
                videoUrl={props.videoUrl}
                ref={props.imageDisplayRef}
                onUpload={props.onUpload}
            />
            <ControlPanel 
                {...props}
                isMasking={isMasking}
                setIsMasking={setIsMasking}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
            />
        </>
    );
};
