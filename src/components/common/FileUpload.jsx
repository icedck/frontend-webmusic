import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({
                        onFileChange,
                        onFileSelect, // Prop cũ để tương thích ngược
                        previewType = 'none',
                        existingFileUrl = null,
                        className = '',
                        accept = 'audio/*, image/*',
                        placeholderText = 'Kéo thả file hoặc nhấn để chọn'
                    }) => {
    const [preview, setPreview] = useState(existingFileUrl);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        setPreview(existingFileUrl);
        if (existingFileUrl) {
            try {
                const url = new URL(existingFileUrl);
                setFileName(decodeURIComponent(url.pathname.split('/').pop()));
            } catch (e) {
                setFileName(existingFileUrl.split('/').pop());
            }
        } else {
            setFileName('');
        }
    }, [existingFileUrl]);

    // --- BẮT ĐẦU SỬA ĐỔI ---
    // Thêm useEffect để dọn dẹp URL object, tránh rò rỉ bộ nhớ
    useEffect(() => {
        // Hàm cleanup này sẽ được gọi khi component unmount hoặc khi `preview` thay đổi
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);
    // --- KẾT THÚC SỬA ĐỔI ---

    const handleFileChangeInternal = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFileName(file.name);
            if (previewType !== 'none') {
                const newPreviewUrl = URL.createObjectURL(file);
                setPreview(newPreviewUrl);
            }

            if (typeof onFileChange === 'function') {
                onFileChange(file);
            }
            else if (typeof onFileSelect === 'function') {
                onFileSelect(file);
            }
        }
    }, [onFileChange, onFileSelect, previewType]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChangeInternal,
        accept: accept.split(',').reduce((acc, type) => ({ ...acc, [type.trim()]: [] }), {}),
        multiple: false
    });

    const clearFile = (e) => {
        e.stopPropagation();
        setPreview(null);
        setFileName('');
        if (typeof onFileChange === 'function') {
            onFileChange(null);
        } else if (typeof onFileSelect === 'function') {
            onFileSelect(null);
        }
    };

    const renderPreview = () => {
        if (!preview) return null;

        // Ưu tiên hiển thị ảnh nếu previewType là image
        if (previewType === 'image') {
            return <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />;
        }
        if (previewType === 'audio' || (fileName && fileName.match(/\.(mp3|wav|ogg)$/i))) {
            return <audio controls src={preview} className="w-full" />;
        }
        // Fallback cho các loại file khác
        return <FileIcon className="w-12 h-12 text-slate-500" />;
    };

    return (
        <div {...getRootProps()} className={`relative flex flex-col items-center justify-center w-full h-48 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}
            ${className}`}>
            <input {...getInputProps()} />

            {preview ? (
                <div className="relative w-full h-full">
                    {renderPreview()}
                    <button onClick={clearFile} className="absolute top-2 right-2 p-1 bg-white/60 dark:bg-black/60 rounded-full hover:bg-red-500 hover:text-white transition-colors z-10">
                        <X size={16} />
                    </button>
                    {fileName && previewType !== 'image' && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs text-center truncate">
                            {fileName}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <UploadCloud className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm font-semibold">{placeholderText}</p>
                    <p className="text-xs">{accept.replace(/\/\*/g, '').replace(/,/g, ', ')}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;