import React, { useRef, useEffect } from 'react';

const OtpInput = ({ value, onChange, onComplete, length = 6, error }) => {
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, e) => {
        const digit = e.target.value;
        if (!/^[0-9]$/.test(digit) && digit !== '') return;

        const newOtp = [...value];
        newOtp[index] = digit;
        const newOtpString = newOtp.join('');
        onChange(newOtpString);

        if (digit !== '' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtpString.length === length) {
            onComplete(newOtpString);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && value[index] === undefined && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength="1"
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-colors
                        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-music-500'}
                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-music-500/50`}
                />
            ))}
        </div>
    );
};

export default OtpInput;