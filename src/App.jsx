import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/layout/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Login, Register, Profile } from './modules/auth';
import ChangePassword from './modules/auth/pages/ChangePassword';
import ForgotPassword from './modules/auth/pages/ForgotPassword';
import MusicDiscoveryPage from './pages/MusicDiscoveryPage';
import { UserManagement, SingerManagement, SongManagementAdmin, CreateSongAdmin, EditSongAdmin, SubmissionManagement } from './modules/admin';
import { SongManagement, PlaylistManagement, SongDetail } from './modules/music';
import { CreatorDashboard, MySubmissions, SongSubmission } from './modules/creator';
import MyPublishedSongs from './modules/creator/pages/MyPublishedSongs';
import SubmissionDetail from './modules/creator/pages/SubmissionDetail';
import { PremiumUpgrade, TransactionHistory } from './modules/premium';
import { SearchResults } from './modules/search';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, useDarkMode } from './hooks/useDarkMode.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import { AudioProvider } from './hooks/useAudio.jsx';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
    const { isDarkMode } = useDarkMode();

    return (
        <>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Main Application Layout */}
                    <Route element={<DashboardLayout />}>
                        {/* SỬA LỖI: Đổi trang chủ về URL gốc */}
                        <Route path="/" element={<MusicDiscoveryPage />} />
                        {/* SỬA LỖI: Thêm điều hướng từ /dashboard về / để đảm bảo link cũ hoạt động */}
                        <Route path="/dashboard" element={<Navigate to="/" replace />} />

                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/song/:songId" element={<SongDetail />} />

                        {/* Protected Routes (cần đăng nhập) */}
                        <Route element={<ProtectedRoute />}>
                            {/* General User Routes */}
                            <Route path="/songs" element={<SongManagement />} />
                            <Route path="/playlists" element={<PlaylistManagement />} />
                            <Route path="/premium" element={<PremiumUpgrade />} />
                            <Route path="/transactions" element={<TransactionHistory />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/change-password" element={<ChangePassword />} />

                            {/* Admin Routes */}
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/singers" element={<SingerManagement />} />
                            <Route path="/admin/songs" element={<SongManagementAdmin />} />
                            <Route path="/admin/songs/new" element={<CreateSongAdmin />} />
                            <Route path="/admin/songs/edit/:songId" element={<EditSongAdmin />} />
                            <Route path="/admin/submissions" element={<SubmissionManagement />} />

                            {/* Creator Routes */}
                            <Route path="/creator" element={<CreatorDashboard />} />
                            <Route path="/creator/my-library" element={<MyPublishedSongs />} />
                            <Route path="/creator/my-submissions" element={<MySubmissions />} />
                            <Route path="/creator/my-submissions/:submissionId" element={<SubmissionDetail />} />
                            <Route path="/creator/submission/new" element={<SongSubmission />} />
                            <Route path="/creator/submission/edit/:submissionId" element={<SongSubmission />} />
                        </Route>
                    </Route>

                    {/* SỬA LỖI: Điều hướng các link không tồn tại về trang chủ mới */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Tooltip id="global-tooltip" style={{ backgroundColor: isDarkMode ? 'rgb(6, 182, 212)' : 'rgb(8, 145, 178)', color: "#FFFFFF", borderRadius: "8px" }} opacity={1} offset={10}/>
            </Router>
            <ToastContainer autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable={false} pauseOnHover={false} theme={isDarkMode ? "dark" : "light"} position="bottom-right" />
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AudioProvider>
                    <AppContent />
                </AudioProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;