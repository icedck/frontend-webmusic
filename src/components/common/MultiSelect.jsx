import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const MultiSelect = ({ label, options, selected, onChange, placeholder = "Chọn..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (optionId) => {
        if (selected.includes(optionId)) {
            onChange(selected.filter(id => id !== optionId));
        } else {
            onChange([...selected, optionId]);
        }
    };

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOptions = options.filter(option => selected.includes(option.id));

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
            <div onClick={() => setIsOpen(!isOpen)} className={`w-full p-2 border rounded-lg flex items-center justify-between cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}>
                <span className={`flex-grow ${selected.length > 0 ? '' : 'text-slate-400'}`}>
                    {selected.length > 0 ? `${selected.length} đã chọn` : placeholder}
                </span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>

            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedOptions.map(option => (
                        <div key={option.id} className="flex items-center bg-music-100 dark:bg-music-900/50 text-music-800 dark:text-music-200 text-sm font-medium px-2 py-1 rounded-md">
                            <span>{option.name}</span>
                            <X size={14} className="ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelect(option.id); }} />
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <div className={`absolute z-10 w-full mt-1 border rounded-lg shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full p-2 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-200'}`}
                    />
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <li key={option.id} onClick={() => handleSelect(option.id)} className={`p-2 cursor-pointer flex items-center justify-between ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                                <span>{option.name}</span>
                                {selected.includes(option.id) && <Check size={16} className="text-music-500" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;