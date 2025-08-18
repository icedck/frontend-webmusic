// File: src/modules/music/components/CommentForm.jsx
import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../../components/common/Button";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "../../../components/common/Avatar";

const CommentForm = ({ onSubmit, isLoading }) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const COMMENT_MAX_LENGTH = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-4 p-4 text-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p className="text-slate-600 dark:text-slate-400">
          <Link
            to="/login"
            className="font-semibold text-cyan-500 hover:underline"
          >
            Đăng nhập
          </Link>{" "}
          để tham gia bình luận.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4 mt-4">
      <Avatar user={user} className="w-10 h-10" />

      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          rows="2"
          maxLength={COMMENT_MAX_LENGTH}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {content.length} / {COMMENT_MAX_LENGTH}
          </p>
          <Button
            type="submit"
            disabled={!content.trim() || isLoading}
            isLoading={isLoading}
          >
            <Send size={16} className="mr-2" /> Gửi
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
