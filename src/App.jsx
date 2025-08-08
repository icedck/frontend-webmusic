import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/layout/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Login, Register } from './modules/auth';
import Dashboard from './pages/Dashboard';
import { UserManagement, SingerManagement, SongManagementAdmin, CreateSongAdmin, EditSongAdmin, SubmissionManagement } from './modules/admin';
import { SongManagement, PlaylistManagement, SongDetail } from './modules/music';
import { CreatorDashboard, MySubmissions, SongSubmission } from './modules/creator';
import { PremiumUpgrade, TransactionHistory } from './modules/premium';
import { SearchResults } from './modules/search';
import ProfileLayout from './modules/auth/pages/ProfileLayout';
import { Profile, ChangePassword } from './modules/auth';
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

                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/songs" element={<SongManagement />} />
                            <Route path="/song/:songId" element={<SongDetail />} />
                            <Route path="/playlists" element={<PlaylistManagement />} />
                            <Route path="/premium" element={<PremiumUpgrade />} />
                            <Route path="/transactions" element={<TransactionHistory />} />
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/singers" element={<SingerManagement />} />
                            <Route path="/admin/songs" element={<SongManagementAdmin />} />
                            <Route path="/admin/songs/new" element={<CreateSongAdmin />} />
                            <Route path="/admin/songs/edit/:songId" element={<EditSongAdmin />} />
                            <Route path="/admin/submissions" element={<SubmissionManagement />} />
                            <Route path="/creator" element={<CreatorDashboard />} />
                            <Route path="/creator/my-submissions" element={<MySubmissions />} />
                            <Route path="/creator/submission/new" element={<SongSubmission />} />
                            <Route path="/creator/submission/edit/:submissionId" element={<SongSubmission />} />
                            <Route path="/profile" element={<ProfileLayout />}>
                                <Route index element={<Profile />} />
                                <Route path="password" element={<ChangePassword />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Tooltip id="global-tooltip" style={{ backgroundColor: "#7c3aed", color: "#FFFFFF", borderRadius: "8px" }} opacity={1} offset={10} />
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