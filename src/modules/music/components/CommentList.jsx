import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Button from '../../../components/common/Button';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const CommentList = ({ comments, currentUser, onDelete, onShowMore, hasMore, isLoadingMore }) => {
    const { isAdmin } = useAuth();

    if (comments.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Chưa có bình luận nào.</p>;
    }

    return (
        <div className="space-y-6">
            {comments.map(comment => {
                const canDelete = currentUser && (currentUser.id === comment.user.id || isAdmin());

                return (
                    <div key={comment.id} className="flex items-start gap-4 group">
                        <img
                            src={comment.user.avatarPath ? `${API_BASE_URL}${comment.user.avatarPath}` : `https://ui-avatars.com/api/?name=${comment.user.displayName}&background=random`}
                            alt={comment.user.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <p className="font-semibold text-gray-900 dark:text-white">{comment.user.displayName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
                                </p>
                            </div>
                            <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                        {canDelete && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(comment)}
                                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </Button>
                        )}
                    </div>
                );
            })}
            {hasMore && (
                <div className="text-center mt-6">
                    <Button variant="outline" onClick={onShowMore} isLoading={isLoadingMore}>
                        Xem thêm bình luận
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CommentList;