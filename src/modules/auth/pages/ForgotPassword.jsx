import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../hooks/useDarkMode";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import OtpInput from "../../../components/common/OtpInput";
import { Music, Mail, Key, Lock, ArrowLeft } from "lucide-react";
import { authService } from "../services/authService.js";
import AuthBrandingPanel from "../components/AuthBrandingPanel";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { currentTheme } = useDarkMode();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Vui lòng nhập email của bạn.");
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Có lỗi xảy ra, hoặc email không tồn tại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = async (completedOtp) => {
    setError("");
    setLoading(true);
    try {
      await authService.verifyOtp({ email, otpCode: completedOtp });
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn."
      );
      setOtp(""); // Xóa OTP sai
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 32) {
      setError("Mật khẩu mới phải có từ 6 đến 32 ký tự!");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        otpCode: otp,
        newPassword,
      });
      navigate("/login", {
        replace: true,
        state: {
          successMessage:
            response.message ||
            "Đặt lại mật khẩu thành công! Vui lòng đăng nhập.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              Icon={Mail}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
            </Button>
          </form>
        );
      case 2:
        return (
          <div className="space-y-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              onComplete={handleOtpComplete}
              error={!!error}
            />
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-music-500 mx-auto"></div>
            )}
          </div>
        );
      case 3:
        return (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <Input
              label="Mật khẩu mới"
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự"
              Icon={Lock}
            />
            <Input
              label="Xác nhận mật khẩu mới"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              Icon={Lock}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  const getStepInfo = () => {
    switch (step) {
      case 1:
        return {
          title: "Quên Mật Khẩu",
          description: "Nhập email của bạn để nhận mã OTP.",
        };
      case 2:
        return {
          title: "Xác thực OTP",
          description: `Một mã OTP đã được gửi đến ${email}.`,
        };
      case 3:
        return {
          title: "Tạo Mật Khẩu Mới",
          description: "Mã OTP chính xác. Vui lòng nhập mật khẩu mới.",
        };
      default:
        return {};
    }
  };

  const { title, description } = getStepInfo();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AuthBrandingPanel />
      <div
        className={`w-full ${currentTheme.bg} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-md w-full">
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${currentTheme.text}`}>
              {title}
            </h2>
            <p className={`mt-2 ${currentTheme.textSecondary}`}>
              {description}
            </p>
          </div>
          <div
            className={`${currentTheme.bgCard} mt-8 p-8 rounded-xl shadow-lg ${currentTheme.border} border`}
          >
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm text-center mb-4">
                {error}
              </p>
            )}
            {renderStep()}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 text-sm font-medium ${currentTheme.textSecondary} hover:text-music-500`}
              >
                <ArrowLeft size={16} /> Quay lại trang Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
