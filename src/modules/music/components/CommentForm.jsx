// File: src/modules/music/components/CommentForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const CommentForm = ({ onSubmit, isLoading }) => {
    const { user, isAuthenticated } = useAuth(); // Thêm isAuthenticated
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
        setContent('');
    };

    // START-CHANGE: Hiển thị thông báo nếu chưa đăng nhập
    if (!isAuthenticated) {
        return (
            <div className="mt-4 p-4 text-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-slate-600 dark:text-slate-400">
                    <Link to="/login" className="font-semibold text-cyan-500 hover:underline">Đăng nhập</Link> để tham gia bình luận.
                </p>
            </div>
        );
    }
    // END-CHANGE

    return (
        <form onSubmit={handleSubmit} className="flex items-start gap-4 mt-4">
            <img
                src={user.avatarPath ? `${API_BASE_URL}${user.avatarPath}` : `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-music-500 focus:border-music-500 transition"
                    rows="2"
                />
                <div className="flex justify-end mt-2">
                    <Button type="submit" disabled={!content.trim() || isLoading} isLoading={isLoading}>
                        <Send size={16} className="mr-2" /> Gửi
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;