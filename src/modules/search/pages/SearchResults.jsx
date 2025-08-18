import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { musicService } from '../../music/services/musicService';
import SongCard from '../../../components/music/SongCard';
import SongListItem from '../../../components/music/SongListItem';
import PlaylistCard from '../../../components/music/PlaylistCard';
import ArtistCard from '../../../components/music/ArtistCard';
import Button from '../../../components/common/Button';
import { useAudio } from '../../../hooks/useAudio';
import { toast } from 'react-toastify';

const SkeletonGrid = ({ CardComponent, count = 5 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className={`aspect-square bg-slate-200 dark:bg-slate-800 ${CardComponent === ArtistCard ? 'rounded-full' : 'rounded-lg'}`}></div>
                <div className="h-4 mt-2 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 mt-1 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

const SkeletonList = ({ count = 5 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                <div className="w-6 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
        ))}
    </div>
);

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { playSong } = useAudio();

    const [songs, setSongs] = useState({ content: [], pageInfo: {} });
    const [playlists, setPlaylists] = useState({ content: [], pageInfo: {} });
    const [singers, setSingers] = useState({ content: [], pageInfo: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const [songsRes, playlistsRes, singersRes] = await Promise.all([
                    musicService.searchSongs(query, 0, 5),
                    musicService.searchPlaylists(query, 0, 5),
                    musicService.searchSingers(query, 0, 5),
                ]);

                if (songsRes.success) setSongs(songsRes.data);
                if (playlistsRes.success) setPlaylists(playlistsRes.data);
                if (singersRes.success) setSingers(singersRes.data.content ? { content: singersRes.data.content, pageInfo: singersRes.data.pageInfo } : { content: singersRes.data, pageInfo: {} });

            } catch (error) {
                toast.error("Lỗi khi tìm kiếm. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handlePlaySong = (song, list) => {
        playSong(song, list);
    };

    if (!query) {
        return <div className="text-center py-10">
            <h1 className="text-2xl font-bold">Tìm kiếm</h1>
            <p className="text-slate-500 dark:text-slate-400">Vui lòng nhập từ khóa để tìm kiếm.</p>
        </div>;
    }

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold">Kết quả tìm kiếm cho "{query}"</h1>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Bài hát</h2>
                {loading ? <SkeletonList /> : (
                    songs.content?.length > 0 ? (
                        <div className="space-y-2">
                            {songs.content.map((song, index) => 
                                <SongListItem 
                                    key={song.id} 
                                    song={song} 
                                    index={index}
                                    onPlay={() => handlePlaySong(song, songs.content)} 
                                />
                            )}
                        </div>
                    ) : <p>Không tìm thấy bài hát nào.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Playlists</h2>
                {loading ? <SkeletonGrid CardComponent={PlaylistCard} /> : (
                    playlists.content?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {playlists.content.map(p => <PlaylistCard key={p.id} playlist={p} />)}
                        </div>
                    ) : <p>Không tìm thấy playlist nào.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Nghệ sĩ</h2>
                {loading ? <SkeletonGrid CardComponent={ArtistCard} /> : (
                    singers.content?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {singers.content.map(artist => <ArtistCard key={artist.id} artist={{...artist, imageUrl: `${import.meta.env.VITE_API_BASE_URL}${artist.avatarPath}`}} />)}
                        </div>
                    ) : <p>Không tìm thấy nghệ sĩ nào.</p>
                )}
            </section>
        </div>
    );
};

export default SearchResults;