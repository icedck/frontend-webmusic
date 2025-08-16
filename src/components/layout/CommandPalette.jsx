import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Search } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, navigationCommands }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const { currentTheme } = useDarkMode();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleAction = (command) => {
        if (command.action) {
            command.action();
        } else {
            navigate(command.href);
        }
        handleClose();
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            handleClose();
        }
    };

    const filteredCommands = searchTerm
        ? navigationCommands.filter(command =>
            command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (command.category && command.category.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : navigationCommands;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands.length > 0 && filteredCommands[activeIndex]) {
                    handleAction(filteredCommands[activeIndex]);
                } else {
                    handleSearchSubmit();
                }
            } else if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, filteredCommands, searchTerm]);

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/20 backdrop-blur-sm" onClick={handleClose}>
            <div
                className="relative w-full max-w-xl rounded-xl shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center p-4 border-b border-gray-200/70 dark:border-gray-700/70">
                    <Search className={`w-5 h-5 mr-3 ${currentTheme.textSecondary}`} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm trang, bài hát, playlist..."
                        className={`w-full bg-transparent outline-none ${currentTheme.text} placeholder-gray-500 dark:placeholder-gray-400`}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setActiveIndex(0); }}
                    />
                </div>
                <ul className="p-2 max-h-[400px] overflow-y-auto">
                    {searchTerm && filteredCommands.length === 0 ? (
                        <li className={`p-4 text-center ${currentTheme.textSecondary}`}>
                            Không tìm thấy trang. Nhấn Enter để tìm kiếm "{searchTerm}"
                        </li>
                    ) : (
                        filteredCommands.map((command, index) => (
                            <li key={command.name}>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleAction(command); }}
                                    className={`flex items-center justify-between p-3 rounded-lg text-sm transition-colors w-full text-left ${currentTheme.text} ${index === activeIndex ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center">
                                        <command.icon className="w-5 h-5 mr-3" />
                                        <span>{command.name}</span>
                                    </div>
                                    {command.category && <span className={`text-xs px-2 py-1 rounded-md ${currentTheme.textSecondary} bg-black/5 dark:bg-white/5`}>{command.category}</span>}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CommandPalette;