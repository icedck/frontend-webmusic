import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/music/HeroSlider';
import PlaylistCard from '../components/music/PlaylistCard';
import { musicService } from '../modules/music/services/musicService';
import { toast } from 'react-toastify';

const Section = ({ title, viewAllLink = "#", children }) => (
    <section className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <Link to={viewAllLink} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Tất cả</Link>
        </div>
        {children}
    </section>
);

const Footer = () => {
    // Dữ liệu tĩnh cho Footer có thể giữ lại
    const partners = [
        { name: 'Sony Music', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sony_Music_logo.svg/1200px-Sony_Music_logo.svg.png' },
        { name: 'Universal Music Group', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Universal_Music_Group_logo.svg/1200px-Universal_Music_Group_logo.svg.png' },
        { name: 'Warner Music Group', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Warner_Music_Group_logo.svg/1200px-Warner_Music_Group_logo.svg.png' },
    ];

    return (
        <footer className="mt-20 pt-12 border-t border-slate-800 text-slate-400 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <div className="col-span-full lg:col-span-2">
                    <h4 className="font-bold text-white mb-4">Đối tác âm nhạc</h4>
                    <div className="flex items-center gap-6">
                        {partners.map(p => (
                            <img key={p.name} src={p.logoUrl} alt={p.name} className="h-6 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition" />
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Về WebMusic</h4>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="hover:text-white">Giới thiệu</Link></li>
                        <li><Link to="/terms" className="hover:text-white">Điều khoản</Link></li>
                        <li><Link to="/privacy" className="hover:text-white">Bảo mật</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Hỗ trợ</h4>
                    <ul className="space-y-2">
                        <li><Link to="/help" className="hover:text-white">Trung tâm trợ giúp</Link></li>
                        <li><Link to="/report" className="hover:text-white">Báo cáo vi phạm</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Liên hệ</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Kết nối</h4>
                </div>
            </div>
            <p className="mt-12 text-center text-xs">&copy; 2024 WebMusic. All Rights Reserved.</p>
        </footer>
    );
};

// Component Placeholder cho các section đang tải
const SkeletonGrid = ({ items = 5, type = 'playlist' }) => (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${items} gap-x-6 gap-y-8`}>
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="space-y-2 animate-pulse">
                <div className="aspect-square bg-slate-800 rounded-lg"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);


const MusicDiscoveryPage = () => {
    const [topPlaylists, setTopPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            setLoading(true);
            try {
                // Chỉ gọi API cho những phần đã có dữ liệu thật
                const topPlaylistsRes = await musicService.getTopListenedPlaylists();
                if (topPlaylistsRes.success) {
                    setTopPlaylists(topPlaylistsRes.data);
                }
            } catch (error) {
                toast.error("Không thể tải dữ liệu trang chủ.");
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);

    return (
        <div className="space-y-16">
            <HeroSlider />

            <Section title="Playlist Nghe Nhiều">
                {loading ? (
                    <SkeletonGrid items={5} />
                ) : topPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {topPlaylists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
                    </div>
                ) : (
                    <p className="text-slate-400">Không có playlist nào để hiển thị.</p>
                )}
            </Section>

            {/* Các section chưa có dữ liệu thật sẽ chỉ hiển thị đầu mục */}
            <Section title="Mới Phát Hành" />
            <Section title="#WebMusicChart" />

            <Footer />
        </div>
    );
};

export default MusicDiscoveryPage;