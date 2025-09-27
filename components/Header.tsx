import React, { useRef } from 'react';
import { Button } from './common/Button';
import { DownloadIcon, RedoIcon, ResetIcon, UndoIcon, UploadIcon, WandIcon } from './icons';

interface HeaderProps {
  onUpload: (file: File) => void;
  onDownload: () => void;
  onReset: () => void;
  hasImage: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  onUpload, 
  onDownload, 
  onReset, 
  hasImage,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // Reset the input value to allow uploading the same file again
    if (e.target) {
        e.target.value = '';
    }
  };

  return (
    <header className="flex-shrink-0 bg-zinc-950/70 backdrop-blur-sm border-b border-zinc-800 px-4 py-3 flex items-center justify-between z-20 animate-fade-in shadow-lg">
      <div className="flex items-center space-x-4 w-1/4">
        <WandIcon className="h-7 w-7 text-cyan-400" />
        <h1 className="text-xl font-bold text-zinc-100 tracking-wider">Studio Ảnh AI</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>

      <div className="flex items-center justify-end space-x-2 w-1/4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        
        {hasImage ? (
          <>
            <Button onClick={handleUploadClick} variant="secondary" title="Tải ảnh mới lên">
              <UploadIcon className="h-5 w-5" />
            </Button>
            <Button onClick={onUndo} variant="secondary" title="Hoàn tác" disabled={!canUndo}>
              <UndoIcon className="h-5 w-5" />
            </Button>
            <Button onClick={onRedo} variant="secondary" title="Làm lại" disabled={!canRedo}>
              <RedoIcon className="h-5 w-5" />
            </Button>
            <Button onClick={onReset} variant="secondary" title="Đặt lại tất cả thay đổi">
              <ResetIcon className="h-5 w-5" />
            </Button>
            <Button onClick={onDownload} variant="primary" title="Tải xuống ảnh đã chỉnh sửa">
              <DownloadIcon className="h-5 w-5 mr-2" />
              Tải xuống
            </Button>
          </>
        ) : (
            <Button onClick={handleUploadClick} variant="primary">
                <UploadIcon className="h-5 w-5 mr-2"/>
                Tải ảnh lên
            </Button>
        )}
      </div>
    </header>
  );
};