import React from 'react';
import HeroSlider from '../components/music/HeroSlider';
import PlaylistCard from '../components/music/PlaylistCard';
import ArtistCard from '../components/music/ArtistCard';
import ChartList from '../components/music/ChartList';

const mockData = {
    newReleases: [
        { id: '1', title: 'Lofi Chillin\'', description: 'Thư giãn cùng những giai điệu lofi.', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80' },
        { id: '2', title: 'V-Pop Hits 2024', description: 'Những bản hit đình đám nhất.', imageUrl: 'https://images.unsplash.com/photo-1588691689932-424b6b64aca4?w=400&q=80' },
        { id: '3', title: 'Acoustic Yêu Đời', description: 'Cảm nhận sự mộc mạc.', imageUrl: 'https://images.unsplash.com/photo-1499415474443-511a84f3b793?w=400&q=80' },
        { id: '4', title: 'EDM Party', description: 'Đốt cháy năng lượng.', imageUrl: 'https://images.unsplash.com/photo-1516223725371-87ae4d98446b?w=400&q=80' },
        { id: '5', title: 'Nhạc Phim Bất Hủ', description: 'Sống lại khoảnh khắc.', imageUrl: 'https://images.unsplash.com/photo-1511300977462-7f24b0b14798?w=400&q=80' },
    ],
    topArtists: [
        { id: '1', name: 'Sơn Tùng M-TP', imageUrl: 'https://via.placeholder.com/200/4F46E5/FFFFFF?text=ST' },
        { id: '2', name: 'MONO', imageUrl: 'https://via.placeholder.com/200/D946EF/FFFFFF?text=MO' },
        { id: '3', name: 'Hoàng Thùy Linh', imageUrl: 'https://via.placeholder.com/200/F59E0B/FFFFFF?text=HTL' },
        { id: '4', name: 'GREY D', imageUrl: 'https://via.placeholder.com/200/06B6D4/FFFFFF?text=GD' },
        { id: '5', name: 'tlinh', imageUrl: 'https://via.placeholder.com/200/EF4444/FFFFFF?text=TL' },
    ],
    chart: [
        { id: 'c1', title: 'Chúng ta của tương lai', artist: 'Sơn Tùng M-TP', imageUrl: 'https://via.placeholder.com/100/A78BFA/FFFFFF?text=C1' },
        { id: 'c2', title: 'Từng Quen', artist: 'Wren Evans', imageUrl: 'https://via.placeholder.com/100/F472B6/FFFFFF?text=C2' },
        { id: 'c3', title: 'À Lôi', artist: 'Double2T', imageUrl: 'https://via.placeholder.com/100/60A5FA/FFFFFF?text=C3' },
        { id: 'c4', title: 'Ngày Mai Người Ta Lấy Chồng', artist: 'Thành Đạt', imageUrl: 'https://via.placeholder.com/100/FBBF24/FFFFFF?text=C4' },
    ]
};

const Section = ({ title, children, viewAllLink = "#" }) => (
    <section className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <a href={viewAllLink} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Xem tất cả</a>
        </div>
        {children}
    </section>
);

const MusicDiscoveryPage = () => {
    return (
        <div className="space-y-12">
            <HeroSlider />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Section title="Mới Phát Hành">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {mockData.newReleases.slice(0, 4).map(p => <PlaylistCard key={p.id} playlist={p} />)}
                        </div>
                    </Section>
                </div>
                <div className="lg:col-span-1">
                    <Section title="#WebMusicChart">
                        <div className="bg-slate-800/20 p-4 rounded-xl">
                            <ChartList chartData={mockData.chart} />
                        </div>
                    </Section>
                </div>
            </div>

            <Section title="Nghệ Sĩ Nổi Bật">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {mockData.topArtists.map(artist => (
                        <ArtistCard key={artist.id} artist={artist} />
                    ))}
                </div>
            </Section>

            <Section title="Tâm Trạng & Hoạt Động">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                    {mockData.newReleases.slice().reverse().map(playlist => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default MusicDiscoveryPage;