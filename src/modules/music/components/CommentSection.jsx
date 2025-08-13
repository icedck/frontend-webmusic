import React, { useState, useEffect, useCallback } from 'react';
import { musicService } from '../services/musicService';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { toast } from 'react-toastify';
import { MessageCircle } from 'lucide-react';

const CommentSection = ({ commentableId, commentableType }) => {
    const [comments, setComments] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 5, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = useCallback(async (page = 0) => {
        setIsLoading(true);
        try {
            const response = await musicService.getComments(commentableType, commentableId, { page, size: pageInfo.size });
            if (response.success) {
                setComments(prev => page === 0 ? response.data.content : [...prev, ...response.data.content]);
                setPageInfo(response.data.pageInfo);
            }
        } catch (error) {
            toast.error("Không thể tải bình luận.");
        } finally {
            setIsLoading(false);
        }
    }, [commentableId, commentableType, pageInfo.size]);

    useEffect(() => {
        if (commentableId) {
            fetchComments(0);
        }
    }, [commentableId, fetchComments]);

    const handleCommentSubmit = async (content) => {
        setIsSubmitting(true);
        try {
            const response = await musicService.createComment(commentableType, commentableId, { content });
            if (response.success) {
                setComments(prev => [response.data, ...prev]);
                toast.success("Đã gửi bình luận!");
            } else {
                toast.error(response.message || "Gửi bình luận thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShowMore = () => {
        if (pageInfo.page < pageInfo.totalPages - 1) {
            fetchComments(pageInfo.page + 1);
        }
    };

    return (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/50">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle size={22} />
                Bình luận
            </h2>
            <CommentForm onSubmit={handleCommentSubmit} isLoading={isSubmitting} />
            <div className="mt-8">
                <CommentList
                    comments={comments}
                    onShowMore={handleShowMore}
                    hasMore={pageInfo.page < pageInfo.totalPages - 1}
                    isLoadingMore={isLoading && pageInfo.page > 0}
                />
                {isLoading && pageInfo.page === 0 && <p className="text-center">Đang tải...</p>}
            </div>
        </div>
    );
};

export default CommentSection;