import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Thiết lập một timeout để cập nhật giá trị đã debounce sau một khoảng thời gian
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Chỉ chạy lại effect nếu giá trị hoặc delay thay đổi

    return debouncedValue;
}