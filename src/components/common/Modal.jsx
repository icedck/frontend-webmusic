import React from 'react';
import ReactDOM from 'react-dom'; // <<< THÊM IMPORT NÀY
import { useDarkMode } from '../../hooks/useDarkMode';
import { X } from 'lucide-react'; // Sử dụng icon từ Lucide cho nhất quán

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

  // <<< SỬ DỤNG ReactDOM.createPortal >>>
  // Component Modal sẽ được render vào `document.body`
  return ReactDOM.createPortal(
      <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
      >
        {/* Backdrop */}
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
        />

        {/* Nội dung Modal */}
        <div
            className={`
          relative w-full ${sizes[size]} transform transition-all
          flex flex-col rounded-xl shadow-2xl
          ${currentTheme.bgCard} ${currentTheme.border} border
          ${className}
        `}
            onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
              <div className={`px-6 py-4 ${currentTheme.border} border-b flex items-center justify-between flex-shrink-0`}>
                {title && (
                    <h3 id="modal-title" className={`text-lg font-semibold ${currentTheme.text}`}>
                      {title}
                    </h3>
                )}
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full ${currentTheme.textSecondary} hover:${currentTheme.bgHover}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                )}
              </div>
          )}

          {/* Content (cho phép cuộn nếu nội dung dài) */}
          <div className="px-6 py-5 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
              <div className={`px-6 py-4 ${currentTheme.border} border-t flex-shrink-0`}>
                {footer}
              </div>
          )}
        </div>
      </div>,
      document.body // <<< Nơi mà Portal sẽ render component vào
  );
};

export default Modal;