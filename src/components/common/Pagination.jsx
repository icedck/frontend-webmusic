// File: src/components/common/Pagination.jsx
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 3,
}) => {
  if (totalPages <= 1) {
    return null; // Không hiển thị phân trang nếu chỉ có 1 trang hoặc không có trang nào
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - halfVisible + 1;
    let endPage = currentPage + halfVisible + 1;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxVisiblePages + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const PageButton = ({
    page,
    children,
    isDisabled = false,
    isActive = false,
  }) => {
    // Style chung cho tất cả các nút
    const baseClasses =
      "flex items-center justify-center h-8 font-medium transition-all duration-150 select-none";
    const numberButtonClasses = "w-8";
    const iconButtonClasses = "w-6";

    // --- BẮT ĐẦU SỬA ĐỔI ---
    // Style cho nút đang được chọn: nền gradient, chữ trắng, bo tròn
    const activeClasses =
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg";
    // --- KẾT THÚC SỬA ĐỔI ---

    // Style cho nút bị vô hiệu hóa
    const disabledClasses =
      "text-slate-400 dark:text-slate-600 cursor-not-allowed";

    // Style cho nút bình thường
    const inactiveClasses =
      "text-slate-700 dark:text-slate-300 hover:text-cyan-500 transform hover:scale-110 active:scale-95";

    let finalClasses = `${baseClasses} `;

    if (typeof children === "number") {
      finalClasses += `${numberButtonClasses} `;
    } else {
      finalClasses += `${iconButtonClasses} `;
    }

    if (isDisabled) {
      finalClasses += disabledClasses;
    } else if (isActive) {
      finalClasses += activeClasses;
    } else {
      finalClasses += inactiveClasses;
    }

    return (
      <button
        onClick={() => !isDisabled && onPageChange(page)}
        disabled={isDisabled}
        className={finalClasses}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {" "}
      {/* Tăng gap lên một chút */}
      {/* Nút về trang đầu */}
      <PageButton page={0} isDisabled={currentPage === 0}>
        <ChevronsLeft size={18} />
      </PageButton>
      {/* Nút lùi 1 trang */}
      <PageButton page={currentPage - 1} isDisabled={currentPage === 0}>
        <ChevronLeft size={18} />
      </PageButton>
      {/* Các nút số trang */}
      {pageNumbers.map((number) => (
        <PageButton
          key={number}
          page={number - 1}
          isActive={currentPage === number - 1}
        >
          {number}
        </PageButton>
      ))}
      {/* Nút tiến 1 trang */}
      <PageButton
        page={currentPage + 1}
        isDisabled={currentPage >= totalPages - 1}
      >
        <ChevronRight size={18} />
      </PageButton>
      {/* Nút đến trang cuối */}
      <PageButton
        page={totalPages - 1}
        isDisabled={currentPage >= totalPages - 1}
      >
        <ChevronsRight size={18} />
      </PageButton>
    </div>
  );
};

export default Pagination;
