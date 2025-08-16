// File: src/modules/music/components/LikeButton.jsx
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // Import Link

export const LikeButton = ({
                               initialIsLiked,
                               initialLikeCount,
                               onToggleLike,
                               showCount = true,
                               size = 20,
                           }) => {
    // START-CHANGE: Thay user bằng isAuthenticated để kiểm tra đăng nhập
    const { isAuthenticated } = useAuth();
    // END-CHANGE
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setIsLiked(initialIsLiked);
        setLikeCount(initialLikeCount);
    }, [initialIsLiked, initialLikeCount]);

    const handleLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // START-CHANGE: Kiểm tra isAuthenticated
        if (!isAuthenticated) {
            toast.info('Bạn cần đăng nhập để thực hiện chức năng này.');
            // Thay vì openLoginModal, chúng ta có thể điều hướng hoặc không làm gì cả
            return;
        }
        // END-CHANGE

        if (isProcessing) return;
        setIsProcessing(true);

        const originalLikedState = isLiked;
        const originalLikeCount = likeCount;

        setIsLiked(!originalLikedState);
        setLikeCount(originalLikedState ? originalLikeCount - 1 : originalLikeCount + 1);

        try {
            await onToggleLike();
        } catch (error) {
            setIsLiked(originalLikedState);
            setLikeCount(originalLikeCount);
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    // START-CHANGE: Vô hiệu hóa nút nếu chưa đăng nhập
    const isDisabled = isProcessing || !isAuthenticated;
    const buttonClassName = `flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 transition-colors duration-200 ${
        !isAuthenticated ? 'cursor-default' : 'hover:text-red-500 dark:hover:text-red-400'
    } ${isDisabled ? 'opacity-60' : ''}`;
    // END-CHANGE

    return (
        <button
            onClick={handleLikeClick}
            disabled={isDisabled}
            className={buttonClassName}
            title={!isAuthenticated ? "Đăng nhập để thích" : (isLiked ? "Bỏ thích" : "Thích")}
        >
            <Heart
                size={size}
                className={`transition-all ${
                    isLiked && isAuthenticated ? 'text-red-500 fill-current' : 'text-current'
                }`}
            />
            {showCount && <span>{likeCount.toLocaleString('vi-VN')}</span>}
        </button>
    );
};