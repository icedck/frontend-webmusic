// File: src/modules/admin/pages/TagManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { adminService } from '../services/adminService';
import { toast } from 'react-toastify';
import CreateTagModal from '../components/CreateTagModal';
import UpdateTagModal from '../components/UpdateTagModal';
import { useDebounce } from '../../../hooks/useDebounce';
import Pagination from "../../../components/common/Pagination";

const PAGE_SIZE = 5;

const TagManagement = () => {
    const { currentTheme } = useDarkMode();
    const [tags, setTags] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: PAGE_SIZE
    });
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- START: ADDED FOR SEARCH ---
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    // --- END: ADDED FOR SEARCH ---

    const fetchTags = useCallback(async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await adminService.getTagsForAdmin(page, PAGE_SIZE, search);
            if (response.success && response.data) {
                setTags(Array.isArray(response.data.content) ? response.data.content : []);
                setPageInfo({
                    currentPage: response.data.pageInfo.page,
                    totalPages: response.data.pageInfo.totalPages,
                    totalElements: response.data.pageInfo.totalElements,
                    size: response.data.pageInfo.size
                });
            } else {
                toast.error(response.message || "Không thể tải danh sách tag.");
            }
        } catch (err) {
            toast.error("Đã xảy ra lỗi khi tải danh sách tag.");
        } finally {
            setLoading(false);
        }
    }, []);

    // --- START: MODIFIED EFFECT FOR SEARCH ---
    useEffect(() => {
        // Fetch tags when debounced search term changes, always go to page 0
        fetchTags(0, debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchTags]);
    // --- END: MODIFIED EFFECT FOR SEARCH ---

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        // Fetch again with the current search term
        fetchTags(pageInfo.currentPage, debouncedSearchTerm);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateModalOpen(false);
        toast.success("Cập nhật tag thành công!");
        fetchTags(pageInfo.currentPage, debouncedSearchTerm);
    };

    const handleDeleteClick = (tag) => {
        setSelectedTag(tag);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTag) return;
        setIsProcessing(true);
        try {
            const response = await adminService.deleteTag(selectedTag.id);
            if (response.success) {
                toast.success(response.message || "Xóa tag thành công!");
                setIsDeleteModalOpen(false);
                const newPage = tags.length === 1 && pageInfo.currentPage > 0 ? pageInfo.currentPage - 1 : pageInfo.currentPage;
                fetchTags(newPage, debouncedSearchTerm);
            } else {
                toast.error(response.message || "Xóa tag thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa tag.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            // Fetch new page with the current search term
            fetchTags(newPage, debouncedSearchTerm);
        }
    };

    const from = pageInfo.totalElements > 0 ? pageInfo.currentPage * pageInfo.size + 1 : 0;
    const to = Math.min((pageInfo.currentPage + 1) * pageInfo.size, pageInfo.totalElements);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Quản lý Tags</h1>
                    <p className={`mt-2 ${currentTheme.textSecondary}`}>Thêm, sửa, và quản lý các thể loại nhạc.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
                    <PlusCircle className="w-5 h-5" />
                    <span>Thêm Tag</span>
                </Button>
            </div>

            {/* --- START: ADDED SEARCH INPUT --- */}
            <div className="w-full sm:w-72">
                <Input
                    placeholder="Tìm kiếm theo tên tag..."
                    icon={<Search size={18} />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* --- END: ADDED SEARCH INPUT --- */}

            <div className={`overflow-x-auto ${currentTheme.bgCard} rounded-xl border ${currentTheme.border}`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${currentTheme.bg}`}>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên Tag</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Số bài hát</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading && <tr><td colSpan="4" className="text-center py-4">Đang tải...</td></tr>}
                    {!loading && tags.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-4">{debouncedSearchTerm ? `Không tìm thấy tag nào với từ khóa "${debouncedSearchTerm}"` : 'Không có dữ liệu.'}</td></tr>
                    )}
                    {!loading && tags.map((tag) => (
                        <tr key={tag.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{tag.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{tag.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tag.songCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => { setSelectedTag(tag); setIsUpdateModalOpen(true); }}>
                                    <Edit className="w-5 h-5 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(tag)} disabled={tag.songCount > 0}>
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Hiển thị {from} - {to} trên {pageInfo.totalElements} tag
                    </p>
                    <Pagination
                        currentPage={pageInfo.currentPage}
                        totalPages={pageInfo.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <CreateTagModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <UpdateTagModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                tag={selectedTag}
                onSuccess={handleUpdateSuccess}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xác nhận xóa tag`}
                message={`Bạn có chắc chắn muốn xóa tag "${selectedTag?.name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                variant="danger"
                isLoading={isProcessing}
            />
        </div>
    );
};

export default TagManagement;