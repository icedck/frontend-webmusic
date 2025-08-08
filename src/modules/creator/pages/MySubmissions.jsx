import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submissionService } from '../services/submissionService';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import ConfirmationModal from '../../../components/common/ConfirmationModal'; // <<< THÊM IMPORT
import { PlusCircle, Music, Search, Filter, Edit, Trash2 } from 'lucide-react'; // <<< THÊM IMPORT
import { toast } from 'react-toastify'; // <<< THÊM IMPORT

const StatusBadge = ({ status }) => {
  const { currentTheme } = useDarkMode();
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    REVIEWING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  };

  return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
            {status}
        </span>
  );
};

const MySubmissions = () => {
  const { currentTheme } = useDarkMode();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // <<< THÊM STATE CHO MODAL >>>
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const pagedData = await submissionService.getMySubmissions();

      if (pagedData && Array.isArray(pagedData.content)) {
        setSubmissions(pagedData.content);
      } else {
        setError("Dữ liệu trả về không hợp lệ.");
        setSubmissions([]);
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách yêu cầu.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // <<< THÊM CÁC HÀM XỬ LÝ VIỆC RÚT LẠI YÊU CẦU >>>
  const openWithdrawModal = (id) => {
    setSelectedSubmissionId(id);
    setIsModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setSelectedSubmissionId(null);
    setIsModalOpen(false);
  };

  const handleWithdrawConfirm = async () => {
    if (!selectedSubmissionId) return;

    setIsDeleting(true);
    try {
      await submissionService.withdrawSubmission(selectedSubmissionId);
      toast.success("Đã rút lại yêu cầu thành công!");
      // Cập nhật lại danh sách trên UI bằng cách lọc bỏ submission đã xóa
      setSubmissions(prev => prev.filter(sub => sub.id !== selectedSubmissionId));
      closeWithdrawModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi rút lại yêu cầu.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
          </div>
      );
    }

    if (error) {
      return <div className={`text-center py-10 ${currentTheme.bgCard} rounded-lg`}><p className="text-red-500">{error}</p></div>;
    }

    if (submissions.length === 0) {
      return (
          <div className={`text-center py-16 ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
            <Music className={`w-16 h-16 mx-auto ${currentTheme.textSecondary}`} />
            <h3 className={`mt-4 text-xl font-semibold ${currentTheme.text}`}>Không tìm thấy yêu cầu nào</h3>
            <p className={`mt-2 text-sm ${currentTheme.textSecondary}`}>Bạn chưa gửi yêu cầu đăng bài hát nào.</p>
            <Link to="/creator/submission/new" className="mt-6 inline-block">
              <Button>Tạo yêu cầu mới</Button>
            </Link>
          </div>
      );
    }

    return (
        <div className={`overflow-x-auto ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${currentTheme.bg}`}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên bài hát</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày gửi</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Hành động</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {submissions.map((submission) => (
                <tr key={submission.id} className={`hover:${currentTheme.bgHover}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{submission.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(submission.submissionDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={submission.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* <<< SỬA ĐỔI: Thêm các nút hành động >>> */}
                    <div className="flex items-center justify-end space-x-4">
                      {submission.status === 'PENDING' ? (
                          <>
                            <Link to={`/creator/submission/edit/${submission.id}`} className="text-music-500 hover:text-music-600">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => openWithdrawModal(submission.id)} className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                      ) : (
                          <span className={`text-xs ${currentTheme.textSecondary}`}>Đã xử lý</span>
                      )}
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
    );
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Yêu cầu đăng bài hát</h1>
            <p className={`mt-2 ${currentTheme.textSecondary}`}>Quản lý các bài hát bạn đã gửi.</p>
          </div>
          <Link to="/creator/submission/new">
            <Button className="flex items-center space-x-2">
              <PlusCircle className="w-5 h-5" />
              <span>Tạo yêu cầu mới</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`} />
            <Input placeholder="Tìm kiếm theo tên bài hát..." className="pl-10" />
          </div>
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`} />
            <select className={`pl-10 pr-4 py-2 border rounded-lg ${currentTheme.bg} ${currentTheme.border} appearance-none`}>
              <option>Tất cả</option>
              <option>Đang chờ</option>
              <option>Đã duyệt</option>
              <option>Bị từ chối</option>
            </select>
          </div>
        </div>

        {renderContent()}

        {/* <<< THÊM MODAL VÀO CUỐI COMPONENT >>> */}
        <ConfirmationModal
            isOpen={isModalOpen}
            onClose={closeWithdrawModal}
            onConfirm={handleWithdrawConfirm}
            title="Xác nhận Rút lại Yêu cầu"
            message="Bạn có chắc chắn muốn rút lại yêu cầu này không? Hành động này không thể hoàn tác."
            confirmText="Đồng ý Rút lại"
            isLoading={isDeleting}
        />
      </div>
  );
};

export default MySubmissions;