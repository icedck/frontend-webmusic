import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, File, Image as ImageIcon, X } from 'lucide-react';

const FileUpload = ({ label, accept, onFileChange, previewType = 'icon', existingFileUrl = null, fileName = '' }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(existingFileUrl);
    const [currentFileName, setCurrentFileName] = useState(fileName);
    const inputRef = useRef(null);

    useEffect(() => {
        setPreview(existingFileUrl);
        setCurrentFileName(fileName);
    }, [existingFileUrl, fileName]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setCurrentFileName(selectedFile.name);
            onFileChange(selectedFile);
            if (previewType === 'image' && selectedFile.type.startsWith('image/')) {
                const newPreviewUrl = URL.createObjectURL(selectedFile);
                setPreview(newPreviewUrl);
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
        setCurrentFileName('');
        onFileChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const renderPreview = () => {
        if (previewType === 'image' && preview) {
            return <img src={preview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />;
        }
        return file?.type.startsWith('image/') || currentFileName.match(/\.(jpg|jpeg|png|gif)$/i) ?
            <ImageIcon className="w-10 h-10 text-slate-500" /> :
            <File className="w-10 h-10 text-slate-500" />;
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
            {!file && !currentFileName ? (
                <div
                    onClick={() => inputRef.current?.click()}
                    className="relative block w-full rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-8 text-center hover:border-music-500 dark:hover:border-music-400 cursor-pointer transition-colors"
                >
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <span className="mt-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">Kéo thả hoặc nhấn để chọn file</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{accept}</span>
                    <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="sr-only" />
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                    <div className="flex items-center gap-4 min-w-0">
                        {renderPreview()}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{currentFileName}</p>
                            {file && <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                        </div>
                    </div>
                    <button type="button" onClick={handleRemoveFile} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;