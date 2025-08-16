import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/music/HeroSlider';
import PlaylistCard from '../components/music/PlaylistCard';
import SongCard from '../components/music/SongCard';
import ArtistCard from '../components/music/ArtistCard';
import { musicService } from '../modules/music/services/musicService';
import { toast } from 'react-toastify';
import { useAudio } from '../hooks/useAudio';

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

const SkeletonGrid = ({ items = 5, type = 'default' }) => (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${items} gap-x-6 gap-y-8`}>
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="space-y-2 animate-pulse">
                <div className={`aspect-square bg-slate-800 ${type === 'artist' ? 'rounded-full' : 'rounded-lg'}`}></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);


const MusicDiscoveryPage = () => {
    const { playSong } = useAudio();
    const [topSongs, setTopSongs] = useState([]);
    const [topPlaylists, setTopPlaylists] = useState([]);
    const [recentSongs, setRecentSongs] = useState([]);
    const [recentPlaylists, setRecentPlaylists] = useState([]);
    const [mostLikedSongs, setMostLikedSongs] = useState([]);
    const [mostLikedPlaylists, setMostLikedPlaylists] = useState([]);
    const [topSingers, setTopSingers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            setLoading(true);
            try {
                const [
                    topSongsRes,
                    topPlaylistsRes,
                    recentSongsRes,
                    recentPlaylistsRes,
                    mostLikedSongsRes,
                    mostLikedPlaylistsRes,
                    topSingersRes
                ] = await Promise.all([
                    musicService.getTopSongs(5),
                    musicService.getTopListenedPlaylists(),
                    musicService.getRecentSongs(5),
                    musicService.getRecentPlaylists(5),
                    musicService.getMostLikedSongs(5),
                    musicService.getMostLikedPlaylists(5),
                    musicService.getTopSingers(5)
                ]);

                if (topSongsRes.success) setTopSongs(topSongsRes.data);
                if (topPlaylistsRes.success) setTopPlaylists(topPlaylistsRes.data);
                if (recentSongsRes.success) setRecentSongs(recentSongsRes.data);
                if (recentPlaylistsRes.success) setRecentPlaylists(recentPlaylistsRes.data);
                if (mostLikedSongsRes.success) setMostLikedSongs(mostLikedSongsRes.data);
                if (mostLikedPlaylistsRes.success) setMostLikedPlaylists(mostLikedPlaylistsRes.data);
                if (topSingersRes.success) setTopSingers(topSingersRes.data);

            } catch (error) {
                toast.error("Không thể tải dữ liệu trang chủ.");
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);

    const handlePlaySongFromList = (songToPlay, songList) => {
        playSong(songToPlay, songList);
    };

    return (
        <div className="space-y-16">
            <HeroSlider />

            <Section title="Playlist Nghe Nhiều">
                {loading ? <SkeletonGrid items={5} /> : topPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {topPlaylists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
                    </div>
                ) : <p className="text-slate-400">Không có playlist nào để hiển thị.</p>}
            </Section>

            <Section title="Bài hát nghe nhiều">
                {loading ? <SkeletonGrid items={5} /> : topSongs.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {topSongs.map(song => <SongCard key={song.id} song={song} onPlay={() => handlePlaySongFromList(song, topSongs)} />)}
                    </div>
                ) : <p className="text-slate-400">Không có bài hát nào để hiển thị.</p>}
            </Section>

            <Section title="Mới Phát Hành">
                {loading ? <SkeletonGrid items={5} /> : recentSongs.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {recentSongs.map(song => <SongCard key={song.id} song={song} onPlay={() => handlePlaySongFromList(song, recentSongs)} />)}
                    </div>
                ) : <p className="text-slate-400">Không có bài hát mới nào để hiển thị.</p>}
            </Section>

            <Section title="Playlist Mới">
                {loading ? <SkeletonGrid items={5} /> : recentPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {recentPlaylists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
                    </div>
                ) : <p className="text-slate-400">Không có playlist mới nào để hiển thị.</p>}
            </Section>

            <Section title="Được Yêu Thích Nhất">
                {loading ? <SkeletonGrid items={5} /> : mostLikedSongs.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {mostLikedSongs.map(song => <SongCard key={song.id} song={song} onPlay={() => handlePlaySongFromList(song, mostLikedSongs)} />)}
                    </div>
                ) : <p className="text-slate-400">Không có bài hát nào được yêu thích để hiển thị.</p>}
            </Section>

            <Section title="Playlist Được Yêu Thích">
                {loading ? <SkeletonGrid items={5} /> : mostLikedPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {mostLikedPlaylists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
                    </div>
                ) : <p className="text-slate-400">Không có playlist nào được yêu thích để hiển thị.</p>}
            </Section>

            <Section title="Nghệ sĩ nổi bật">
                {loading ? <SkeletonGrid items={5} type="artist" /> : topSingers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                        {topSingers.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
                    </div>
                ) : <p className="text-slate-400">Không có nghệ sĩ nào để hiển thị.</p>}
            </Section>

            <Section title="#WebMusicChart" />

            <Footer />
        </div>
    );
};

export default MusicDiscoveryPage;