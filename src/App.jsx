import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/layout/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Login, Register, Profile } from './modules/auth';
import ForgotPassword from './modules/auth/pages/ForgotPassword';
import MusicDiscoveryPage from './pages/MusicDiscoveryPage';
import { UserManagement, SingerManagement, SongManagementAdmin, CreateSongAdmin, EditSongAdmin, SubmissionManagement } from './modules/admin';
import { SongManagement, PlaylistManagement, SongDetail } from './modules/music';
import { CreatorDashboard, MySubmissions, SongSubmission } from './modules/creator';
import SubmissionDetail from './modules/creator/pages/SubmissionDetail'; // THÊM IMPORT
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
                    <Route path="/" element={<LandingPage />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<MusicDiscoveryPage />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/song/:songId" element={<SongDetail />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/songs" element={<SongManagement />} />
                            <Route path="/playlists" element={<PlaylistManagement />} />
                            <Route path="/premium" element={<PremiumUpgrade />} />
                            <Route path="/transactions" element={<TransactionHistory />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/singers" element={<SingerManagement />} />
                            <Route path="/admin/songs" element={<SongManagementAdmin />} />
                            <Route path="/admin/songs/new" element={<CreateSongAdmin />} />
                            <Route path="/admin/songs/edit/:songId" element={<EditSongAdmin />} />
                            <Route path="/admin/submissions" element={<SubmissionManagement />} />
                            <Route path="/creator" element={<CreatorDashboard />} />
                            <Route path="/creator/my-submissions" element={<MySubmissions />} />
                            <Route path="/creator/my-submissions/:submissionId" element={<SubmissionDetail />} />
                            <Route path="/creator/submission/new" element={<SongSubmission />} />
                            <Route path="/creator/submission/edit/:submissionId" element={<SongSubmission />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
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