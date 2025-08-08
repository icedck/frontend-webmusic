import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';
import { PlusCircle } from 'lucide-react';
import { useDarkMode } from '../../../hooks/useDarkMode';

const SongManagement = () => {
    const { isCreator } = useAuth();
    const { currentTheme } = useDarkMode();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Thư viện bài hát</h1>
                    <p className={`mt-2 ${currentTheme.textSecondary}`}>
                        Khám phá và quản lý các bài hát.
                    </p>
                </div>
                {isCreator() && (
                    <Link to="/creator/submission/new">
                        <Button className="flex items-center space-x-2">
                            <PlusCircle className="w-5 h-5" />
                            <span>Tạo yêu cầu mới</span>
                        </Button>
                    </Link>
                )}
            </div>

            <div className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border}`}>
                <p className={`${currentTheme.text}`}>
                    Phần hiển thị danh sách bài hát sẽ được phát triển sau.
                </p>
            </div>
        </div>
    );
};

export default SongManagement;