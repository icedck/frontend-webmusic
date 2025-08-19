import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { Search, Eye, Loader2 } from "lucide-react";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Pagination from "../../../components/common/Pagination";
import { useDarkMode } from "../../../hooks/useDarkMode";

const CreatorManagement = () => {
  const { currentTheme } = useDarkMode();
  const [creators, setCreators] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const fetchCreators = useCallback(
    async (page, search) => {
      setLoading(true);
      try {
        const response = await adminService.getCreators(
          page,
          pageInfo.size,
          search
        );
        if (response.success) {
          setCreators(response.data.content);
          setPageInfo(response.data.pageInfo);
        } else {
          toast.error(
            response.message || "Không thể tải danh sách nhà phát triển."
          );
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    },
    [pageInfo.size]
  );

  useEffect(() => {
    fetchCreators(0, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchCreators]);

  const handlePageChange = (newPage) => {
    fetchCreators(newPage, debouncedSearchTerm);
  };

  const from =
    pageInfo.totalElements > 0 ? pageInfo.page * pageInfo.size + 1 : 0;
  const to = Math.min(
    (pageInfo.page + 1) * pageInfo.size,
    pageInfo.totalElements
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
          Quản lý Nhà phát triển
        </h1>
        <p className={`mt-2 ${currentTheme.textSecondary}`}>
          Xem và quản lý thông tin các nhà phát triển (Creator) trong hệ thống.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div
        className={`${currentTheme.bgCard} rounded-xl overflow-hidden border ${currentTheme.border}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${currentTheme.bg}`}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}
                >
                  Nhà phát triển
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}
                >
                  Email
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}
                >
                  Số điện thoại
                </th>
                <th
                  className={`px-6 py-3 text-center text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}
                >
                  Số bài hát
                </th>
                <th
                  className={`px-6 py-3 text-center text-xs font-medium ${currentTheme.textSecondary} uppercase tracking-wider`}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody
              className={`${currentTheme.bgCard} divide-y divide-gray-200 dark:divide-gray-700`}
            >
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-500" />
                  </td>
                </tr>
              ) : creators.length > 0 ? (
                creators.map((creator) => (
                  <tr key={creator.id} className={`hover:${currentTheme.bg}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      {creator.displayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {creator.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {creator.phoneNumber || "Chưa cập nhật"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500 dark:text-slate-400">
                      {creator.approvedSongCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <Link
                        to={`/admin/creators/${creator.id}`}
                        data-tooltip-id="global-tooltip"
                        data-tooltip-content="Xem chi tiết"
                      >
                        <Button variant="ghost" size="icon">
                          <Eye className="h-5 w-5 text-cyan-500" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-slate-500 dark:text-slate-400"
                  >
                    Không tìm thấy nhà phát triển nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hiển thị {from} - {to} trên {pageInfo.totalElements} nhà phát triển
          </p>
          <Pagination
            currentPage={pageInfo.page}
            totalPages={pageInfo.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CreatorManagement;
