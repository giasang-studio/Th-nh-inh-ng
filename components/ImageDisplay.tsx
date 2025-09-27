
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Adjustments } from '../types';
import { UploadIcon } from './icons';

interface ImageDisplayProps {
  image: string | null;
  adjustments: Adjustments;
  isMasking: boolean;
  brushSize: number;
  videoUrl: string | null;
  onUpload: (file: File) => void;
}

export interface ImageDisplayHandle {
  getCanvasWithFilters: () => string | null;
  getMask: () => string | null;
  clearMask: () => void;
}

export const ImageDisplay = forwardRef<ImageDisplayHandle, ImageDisplayProps>(
  ({ image, adjustments, isMasking, brushSize, videoUrl, onUpload }, ref) => {
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    const draw = (e: MouseEvent) => {
        if (!isDrawing.current || !isMasking) return;
        const canvas = maskCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        ctx.beginPath();
        if (lastPos.current) {
            ctx.moveTo(lastPos.current.x, lastPos.current.y);
        } else {
            ctx.moveTo(x,y);
        }
        ctx.lineTo(x, y);
        ctx.stroke();
        lastPos.current = { x, y };
    };
    
    useEffect(() => {
        const handleMouseUp = () => {
            isDrawing.current = false;
            lastPos.current = null;
        };
        const handleMouseMove = (e: MouseEvent) => draw(e);

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isMasking]);

    useEffect(() => {
      const canvas = mainCanvasRef.current;
      const container = containerRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !container || !maskCanvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
    
      if (image) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;
        img.onload = () => {
          imageRef.current = img;
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          maskCanvas.width = img.naturalWidth;
          maskCanvas.height = img.naturalHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
      } else {
        imageRef.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, [image]);

    useEffect(() => {
        const maskCtx = maskCanvasRef.current?.getContext('2d');
        if (maskCtx) {
            maskCtx.strokeStyle = 'rgba(255, 0, 255, 1)';
            maskCtx.lineWidth = brushSize;
            maskCtx.lineCap = 'round';
            maskCtx.lineJoin = 'round';
        }
    }, [brushSize]);

    useImperativeHandle(ref, () => ({
      getCanvasWithFilters: () => {
        if (!imageRef.current) return null;
        const canvas = document.createElement('canvas');
        const img = imageRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.filter = `brightness(${adjustments.brightness / 100}) contrast(${adjustments.contrast / 100}) saturate(${adjustments.saturate / 100}) sepia(${adjustments.sepia / 100}) grayscale(${adjustments.grayscale / 100}) invert(${adjustments.invert / 100}) hue-rotate(${adjustments.hueRotate}deg)`;
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/png');
      },
      getMask: () => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return null;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = maskCanvas.width;
        tempCanvas.height = maskCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return null;

        // Create a black background
        tempCtx.fillStyle = 'black';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the magenta mask in white
        tempCtx.drawImage(maskCanvas, 0, 0);
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Check if mask is empty
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const hasDrawing = Array.from(imageData.data).some(channel => channel !== 0);
        if (!hasDrawing) return null;

        return tempCanvas.toDataURL('image/png');
      },
      clearMask: () => {
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          const ctx = maskCanvas.getContext('2d');
          ctx?.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        }
      },
    }));

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isMasking || e.button !== 0) return;
        isDrawing.current = true;
        
        const canvas = maskCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        lastPos.current = { x, y };
        
        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const filterStyle: React.CSSProperties = {
        filter: `
            brightness(${adjustments.brightness / 100})
            contrast(${adjustments.contrast / 100})
            saturate(${adjustments.saturate / 100})
            sepia(${adjustments.sepia / 100})
            grayscale(${adjustments.grayscale / 100})
            invert(${adjustments.invert / 100})
            hue-rotate(${adjustments.hueRotate}deg)
        `,
    };

    return (
      <div 
        ref={containerRef} 
        className="flex-1 flex items-center justify-center bg-zinc-900/80 p-4 relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {image ? (
          <div className="relative flex items-center justify-center" style={{width: '100%', height: '100%'}}>
            {videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
            ) : (
                <div style={{...filterStyle, position: 'relative', width: '100%', height: '100%'}}>
                    <canvas ref={mainCanvasRef} className="max-w-full max-h-full object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <canvas 
                        ref={maskCanvasRef}
                        onMouseDown={handleMouseDown}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain ${isMasking ? 'cursor-crosshair' : 'pointer-events-none'}`}
                        style={{ filter: "opacity(0.5)" }}
                    />
                </div>
            )}
          </div>
        ) : (
          <div className="text-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-2xl w-full h-full flex flex-col items-center justify-center">
            <UploadIcon className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400">Tải ảnh lên</h3>
            <p className="text-sm">Kéo và thả tệp vào đây</p>
          </div>
        )}
      </div>
    );
  }
);
