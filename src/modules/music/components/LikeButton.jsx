import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

export const LikeButton = ({
                               initialIsLiked,
                               initialLikeCount,
                               onToggleLike,
                               showCount = true,
                               size = 20,
                           }) => {
    const { user, openLoginModal } = useAuth();
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

        if (!user) {
            toast.info('Bạn cần đăng nhập để thực hiện chức năng này.');
            openLoginModal();
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        const originalLikedState = isLiked;
        const originalLikeCount = likeCount;

        // Optimistic UI update
        setIsLiked(!originalLikedState);
        setLikeCount(originalLikedState ? originalLikeCount - 1 : originalLikeCount + 1);

        try {
            await onToggleLike();
        } catch (error) {
            // Revert UI on failure
            setIsLiked(originalLikedState);
            setLikeCount(originalLikeCount);
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handleLikeClick}
            disabled={isProcessing}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Heart
                size={size}
                className={`transition-all ${
                    isLiked ? 'text-red-500 fill-current' : 'text-current'
                }`}
            />
            {showCount && <span>{likeCount.toLocaleString('vi-VN')}</span>}
        </button>
    );
};