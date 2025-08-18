import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useDarkMode } from "../../../hooks/useDarkMode";

const DescriptionBox = ({ description }) => {
  const { currentTheme } = useDarkMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  // Sử dụng useLayoutEffect để đo đạc DOM ngay sau khi render
  useLayoutEffect(() => {
    const element = contentRef.current;
    if (element) {
      // So sánh chiều cao thực tế của nội dung với chiều cao hiển thị
      const hasOverflow = element.scrollHeight > element.clientHeight;
      setIsOverflowing(hasOverflow);
    }
  }, [description]); // Chạy lại khi mô tả thay đổi

  if (!description) {
    return null; // Không hiển thị gì nếu không có mô tả
  }

  return (
    <div
      className={`${currentTheme.bgCard} p-6 rounded-xl border ${currentTheme.border} transition-all duration-300`}
    >
      <h2 className={`text-xl font-bold mb-4 ${currentTheme.text}`}>Mô tả</h2>
      <div className="relative">
        <p
          ref={contentRef}
          className={`${
            currentTheme.textSecondary
          } whitespace-pre-wrap transition-all duration-300 ${
            !isExpanded ? "line-clamp-5" : "" // Cắt bớt còn 5 dòng khi chưa mở rộng
          }`}
        >
          {description}
        </p>

        {/* Chỉ hiển thị nút "Xem thêm" nếu nội dung thực sự bị cắt bớt */}
        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`mt-3 font-semibold text-cyan-500 hover:text-cyan-400`}
          >
            {isExpanded ? "Ẩn bớt" : "Xem thêm"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DescriptionBox;
