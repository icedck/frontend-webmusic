import React from 'react';
import ReactDOM from 'react-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { X } from 'lucide-react';

const Modal = ({
                 isOpen,
                 onClose,
                 title,
                 children,
                 showCloseButton = true,
                 size = 'md',
                 footer = null,
                 className = ''
               }) => {
  const { currentTheme } = useDarkMode();

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return ReactDOM.createPortal(
      <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
      >
        {/* Backdrop */}
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all duration-300"
            onClick={onClose}
            aria-hidden="true"
        />

        {/* Modal Content */}
        <div
            className={`
              relative w-full ${sizes[size]} transform transition-all duration-300
              flex flex-col shadow-2xl shadow-slate-900/50
              ${currentTheme.bgCard} backdrop-blur-xl
              border border-white/10 dark:border-slate-700/50
              rounded-3xl overflow-hidden
              ${className}
            `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
              <div className="relative px-8 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/60 to-transparent dark:from-slate-800/60" />
                <div className="relative flex items-center justify-between">
                  {title && (
                      <h3 id="modal-title" className={`text-2xl font-semibold ${currentTheme.text} tracking-tight`}>
                        {title}
                      </h3>
                  )}
                  {showCloseButton && (
                      <button
                          onClick={onClose}
                          className="w-10 h-10 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <X className="w-5 h-5" />
                      </button>
                  )}
                </div>
              </div>
          )}

          {/* Content */}
          <div className="px-8 py-6 overflow-y-auto max-h-[70vh]">
            {children}
          </div>

          {/* Footer */}
          {footer && (
              <div className="relative px-8 py-6 border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/30">
                {footer}
              </div>
          )}
        </div>
      </div>,
      document.body
  );
};

export default Modal;