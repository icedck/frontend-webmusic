import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import Button from '../common/Button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const NotificationDropdown = ({
                                  notifications,
                                  loading,
                                  onClose,
                                  onMarkAsRead,
                                  onMarkAllAsRead,
                                  onLoadMore,
                                  hasMore,
                              }) => {
    return (
        <div className="absolute top-full right-0 mt-2 w-80 md:w-96 rounded-xl shadow-lg border backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between p-3 border-b border-slate-200/70 dark:border-slate-700/70">
                <h3 className="font-semibold">Thông báo</h3>
                <Button variant="link" size="sm" onClick={onMarkAllAsRead}>
                    Đánh dấu đã đọc tất cả
                </Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 && !loading && (
                    <p className="text-center text-slate-500 py-8">Bạn không có thông báo nào.</p>
                )}

                {notifications.map((notif) => (
                    <Link
                        key={notif.id}
                        to={notif.link}
                        onClick={() => {
                            if (!notif.isRead) onMarkAsRead(notif.id);
                            onClose();
                        }}
                        className="flex items-start gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {!notif.isRead && (
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0"></div>
                        )}
                        <div className={`flex-grow ${notif.isRead ? 'pl-5' : ''}`}>
                            <p className="text-sm" dangerouslySetInnerHTML={{ __html: notif.message }}></p>
                            <span className="text-xs text-cyan-600 dark:text-cyan-400">
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                            </span>
                        </div>
                    </Link>
                ))}

                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                )}

                {hasMore && !loading && (
                    <div className="p-2">
                        <Button variant="outline" className="w-full" onClick={onLoadMore}>Xem thêm</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;