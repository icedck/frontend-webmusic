import React from 'react';
import HeroSlider from '../components/music/HeroSlider';
import PlaylistCard from '../components/music/PlaylistCard';
import ArtistCard from '../components/music/ArtistCard';
import ChartList from '../components/music/ChartList';
import SongCard from '../components/music/SongCard';

// Dữ liệu giả lập với URL ảnh đã được sửa lại để hiển thị đúng
const mockData = {
    recentlyPlayed: [
        { id: 'rp1', title: 'Lofi Chillin', description: 'Thư giãn cùng...', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/a/9/7/5/a9754415de0321a43a752ac237d1d29c.jpg' },
        { id: 'rp2', title: 'EDM Party', description: 'Đốt cháy năng lượng...', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/5/7/c/c57c6b7579f18361b1e9b25e7b233e1c.jpg' },
        { id: 'rp3', title: 'Acoustic Yêu Đời', description: 'Cảm nhận sự mộc mạc...', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/e/a/f/7/eaf7562696c739504a799a72b9a78530.jpg' },
        { id: 'rp4', title: 'V-Pop Hits 2024', description: 'Những bản hit đình đám nhất.', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/f/7/4/cf74c33d79f0523d4205d8f781146747.jpg' },
        { id: 'rp5', title: 'Nhạc Phim Bất Hủ', description: 'Sống lại khoảnh khắc.', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/0/1/9/a/019a738ab7336186411585a498a44b90.jpg' },
    ],
    newReleases: [
        { id: 'song1', title: 'War and Peace', artist: 'Thai VG, Suboi', releaseDate: 'Hôm qua', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/9/c/0/2/9c0245a98bd32a6a685b331092822a91.jpg' },
        { id: 'song2', title: 'Every Girl You\'ve Ever...', artist: 'Miley Cyrus, Naomi', releaseDate: 'Hôm qua', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/7/c/0/5/7c0591f1146777271954b42337d622f1.jpg' },
        { id: 'song3', title: 'rằng thì là mà', artist: 'Ngot Doll', releaseDate: '2 ngày trước', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/f/b/8/c/fb8c60432325350c6db00b14e3046755.jpg' },
        { id: 'song4', title: 'Chung Hành Trình Nào Là...', artist: 'SUNV, DANZ, anhtrasax', releaseDate: '2 ngày trước', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/b/8/c/b/b8cb404c0429a33486e902b7879b699e.jpg' },
        { id: 'song5', title: 'Ký Ức Của Mẹ', artist: 'Văn Mai Hương', releaseDate: 'Hôm qua', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/0/6/5/d/065d0705f442f65a11c81881c0023758.jpg' },
        { id: 'song6', title: 'WANTCHU', artist: 'keshi', releaseDate: 'Hôm qua', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/9/4/0/d/940dc76ba61d821262d1d3346b5d8363.jpg' },
        { id: 'song7', title: 'Kiếp Sau Văn Ta Người Việt Nam', artist: 'Thiên Dương', releaseDate: '2 ngày trước', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/a/f/d/8/afd8a1651752c1303250559e3852f86f.jpg' },
        { id: 'song8', title: 'Người Bình Thường Kẻ Nặng Lòng', artist: 'Noo Phước Thịnh', releaseDate: 'Hôm qua', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/5/2/c/c/52cc70830700d8929e7104b2b0f44929.jpg' },
    ],
    top100: [
        { id: 't1', title: 'Top 100 Nhạc Trẻ', description: 'Những bản hit hot nhất', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/2/6/3/9/2639a7139257713247271957c2438573.jpg' },
        { id: 't2', title: 'Top 100 Pop US-UK', description: 'Nghe ngay hit Âu Mỹ', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/f/3/2/e/f32e729a8a7c293677372d621508244e.jpg' },
        { id: 't3', title: 'Top 100 Nhạc Hàn', description: 'Đỉnh cao K-Pop', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/7/1/4/3/7143015f868c2e64673323080e4610e7.jpg' },
        { id: 't4', title: 'Top 100 Nhạc Điện Tử', description: 'Sôi động cùng EDM', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/b/0/3/0/b030bbf92cfdfe57a2c75a770334a171.jpg' },
        { id: 't5', title: 'Top 100 Nhạc Phim', description: 'Giai điệu bất hủ', imageUrl: 'https://photo-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/0/1/9/a/019a738ab7336186411585a498a44b90.jpg' },
    ],
    chart: [
        { id: 'c1', title: 'Chúng ta của tương lai', artist: 'Sơn Tùng M-TP', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/7/4/3/1/74318c5200b3969e78287a1a238622c7.jpg', color: '#3b82f6' }, // Blue
        { id: 'c2', title: 'Từng Quen', artist: 'Wren Evans', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/a/d/4/1/ad41bfbe8525b6ce8276b05593108d43.jpg', color: '#4ade80' }, // Green
        { id: 'c3', title: 'À Lôi', artist: 'Double2T', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/a/e/4/eae413e0c03fff717711d8d8a7c21345.jpg', color: '#f87171' }, // Red
        { id: 'c4', title: 'Ngày Mai Người Ta Lấy Chồng', artist: 'Thành Đạt', imageUrl: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/c/b/a/b/cbab45f25ef2f3276cc13c0b3d874534.jpg', color: '#a855f7' }, // Purple (dự phòng)
    ],
    graphData: [
        {name: '17:00', c1: 40, c2: 24, c3: 31},
        {name: '18:00', c1: 30, c2: 13, c3: 42},
        {name: '19:00', c1: 45, c2: 50, c3: 25},
        {name: '20:00', c1: 32, c2: 43, c3: 51},
        {name: '21:00', c1: 44, c2: 61, c3: 39},
        {name: '22:00', c1: 52, c2: 38, c3: 43},
        {name: '23:00', c1: 65, c2: 43, c3: 55},
        {name: '00:00', c1: 58, c2: 51, c3: 60},
    ],
    partners: [
        { name: 'Sony Music', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sony_Music_logo.svg/1200px-Sony_Music_logo.svg.png' },
        { name: 'Universal Music Group', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Universal_Music_Group_logo.svg/1200px-Universal_Music_Group_logo.svg.png' },
        { name: 'Warner Music Group', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Warner_Music_Group_logo.svg/1200px-Warner_Music_Group_logo.svg.png' },
    ],
};

const Section = ({ title, viewAllLink = "#", children }) => (
    <section className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <a href={viewAllLink} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Tất cả</a>
        </div>
        {children}
    </section>
);

const Footer = () => (
    <footer className="mt-20 pt-12 border-t border-slate-800 text-slate-400 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-full lg:col-span-2">
                <h4 className="font-bold text-white mb-4">Đối tác âm nhạc</h4>
                <div className="flex items-center gap-6">
                    {mockData.partners.map(p => (
                        <img key={p.name} src={p.logoUrl} alt={p.name} className="h-6 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition" />
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4">Về WebMusic</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
                    <li><a href="#" className="hover:text-white">Điều khoản</a></li>
                    <li><a href="#" className="hover:text-white">Bảo mật</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4">Hỗ trợ</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
                    <li><a href="#" className="hover:text-white">Báo cáo vi phạm</a></li>
                    <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4">Kết nối</h4>
                {/* Thêm các icon mạng xã hội ở đây */}
            </div>
        </div>
        <p className="mt-12 text-center text-xs">&copy; 2024 WebMusic. All Rights Reserved.</p>
    </footer>
);

const MusicDiscoveryPage = () => {
    return (
        <div className="space-y-16">
            <HeroSlider />

            <Section title="Nghe Gần Đây">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                    {mockData.recentlyPlayed.map(p => <PlaylistCard key={p.id} playlist={p} />)}
                </div>
            </Section>

            <Section title="Mới Phát Hành">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {mockData.newReleases.map(song => <SongCard key={song.id} song={song} />)}
                </div>
            </Section>

            <Section title="#WebMusicChart">
                <ChartList chartData={mockData.chart} graphData={mockData.graphData} />
            </Section>

            <Section title="Top 100">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                    {mockData.top100.map(p => <PlaylistCard key={p.id} playlist={p} />)}
                </div>
            </Section>

            <Section title="Tâm Trạng Cuối Tuần">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                    {mockData.recentlyPlayed.slice().reverse().map(p => <PlaylistCard key={p.id} playlist={p} />)}
                </div>
            </Section>

            <Footer />
        </div>
    );
};

export default MusicDiscoveryPage;