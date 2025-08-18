import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/music/HeroSlider";
import PlaylistCard from "../components/music/PlaylistCard";
import SongCard from "../components/music/SongCard";
import ArtistCard from "../components/music/ArtistCard";
import { musicService } from "../modules/music/services/musicService";
import { toast } from "react-toastify";
import { useAudio } from "../hooks/useAudio";
import { Music, Facebook, Instagram, Youtube, Play } from "lucide-react";

// --- START: MODIFIED COMPONENT ---
const Section = ({ title, viewAllLink = "#", onPlayAll, children }) => (
    <section className="space-y-6">
      <div className="group relative flex items-center justify-between">
        {/* Left side: Title and Play Button */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {title}
          </h2>
          {onPlayAll && (
              <button
                  onClick={onPlayAll}
                  className="flex items-center justify-center w-10 h-10 bg-slate-700/80 hover:bg-slate-600/80 rounded-full text-white
                     opacity-0 group-hover:opacity-100
                     transform scale-75 group-hover:scale-100
                     transition-all duration-300 ease-in-out"
                  aria-label={`Phát tất cả ${title}`}
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={`Phát tất cả`}
              >
                <Play size={20} className="ml-0.5" />
              </button>
          )}
        </div>

        {/* Right side: "View All" link */}
        <Link
            to={viewAllLink}
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Tất cả
        </Link>
      </div>
      {children}
    </section>
);
// --- END: MODIFIED COMPONENT ---

const Footer = () => {
  return (
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-16 text-sm">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-full lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-800 dark:text-white">
                WebMusic
              </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Đây là dự án được phát triển bởi các học viên tại trung tâm
                CodeGym Hà Nội. Sản phẩm phi thương mại nhằm mục đích học tập và
                trau dồi kỹ năng.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Về WebMusic
              </h4>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                <li>
                  <Link
                      to="/about"
                      className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link
                      to="/terms"
                      className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Điều khoản
                  </Link>
                </li>
                <li>
                  <Link
                      to="/privacy"
                      className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Bảo mật
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Hỗ trợ
              </h4>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                <li>
                  <Link
                      to="/help"
                      className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link
                      to="/report"
                      className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Báo cáo vi phạm
                  </Link>
                </li>
                <li>
                  <Link
                      to="/contact"
                      className="hover:text-slate-900 dark:hover:text-white"
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Kết nối
              </h4>
            </div>
          </div>
          <p className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} WebMusic. All Rights Reserved.
          </p>
        </div>
      </footer>
  );
};

const SkeletonGrid = ({ items = 5, type = "default" }) => (
    <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${items} gap-x-6 gap-y-8`}
    >
      {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="space-y-2 animate-pulse">
            <div
                className={`aspect-square bg-slate-800 ${
                    type === "artist" ? "rounded-full" : "rounded-lg"
                }`}
            ></div>
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
          topSingersRes,
        ] = await Promise.all([
          musicService.getTopSongs(5),
          musicService.getTopListenedPlaylists(),
          musicService.getRecentSongs(5),
          musicService.getRecentPlaylists(5),
          musicService.getMostLikedSongs(5),
          musicService.getMostLikedPlaylists(5),
          musicService.getTopSingers(5),
        ]);

        if (topSongsRes.success) setTopSongs(topSongsRes.data);
        if (topPlaylistsRes.success) setTopPlaylists(topPlaylistsRes.data);
        if (recentSongsRes.success) setRecentSongs(recentSongsRes.data);
        if (recentPlaylistsRes.success)
          setRecentPlaylists(recentPlaylistsRes.data);
        if (mostLikedSongsRes.success)
          setMostLikedSongs(mostLikedSongsRes.data);
        if (mostLikedPlaylistsRes.success)
          setMostLikedPlaylists(mostLikedPlaylistsRes.data);
        if (topSingersRes.success) setTopSingers(topSingersRes.data);
      } catch (error)
      {
        toast.error("Không thể tải dữ liệu trang chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handlePlaySingleSong = (songToPlay) => {
    playSong(songToPlay, [songToPlay]);
  };

  const handlePlayAll = (songList) => {
    if (!songList || songList.length === 0) {
      toast.info("Không có bài hát nào trong danh sách này.");
      return;
    }
    playSong(songList[0], songList);
  };

  return (
      <div className="space-y-16">
        <HeroSlider />

        <Section title="Playlist Nghe Nhiều" viewAllLink="/playlists?category=top-listened">
          {loading ? (
              <SkeletonGrid items={5} />
          ) : topPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {topPlaylists.map((p) => (
                    <PlaylistCard key={p.id} playlist={p} />
                ))}
              </div>
          ) : (
              <p className="text-slate-400">Không có playlist nào để hiển thị.</p>
          )}
        </Section>

        <Section title="Bài hát nghe nhiều" viewAllLink="/all-songs?category=popular" onPlayAll={() => handlePlayAll(topSongs)}>
          {loading ? (
              <SkeletonGrid items={5} />
          ) : topSongs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {topSongs.map((song) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        onPlay={() => handlePlaySingleSong(song)}
                    />
                ))}
              </div>
          ) : (
              <p className="text-slate-400">Không có bài hát nào để hiển thị.</p>
          )}
        </Section>

        <Section title="Mới Phát Hành" onPlayAll={() => handlePlayAll(recentSongs)}>
          {loading ? (
              <SkeletonGrid items={5} />
          ) : recentSongs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {recentSongs.map((song) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        onPlay={() => handlePlaySingleSong(song)}
                    />
                ))}
              </div>
          ) : (
              <p className="text-slate-400">
                Không có bài hát mới nào để hiển thị.
              </p>
          )}
        </Section>

        <Section title="Playlist Mới" viewAllLink="/playlists?category=recent">
          {loading ? (
              <SkeletonGrid items={5} />
          ) : recentPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {recentPlaylists.map((p) => (
                    <PlaylistCard key={p.id} playlist={p} />
                ))}
              </div>
          ) : (
              <p className="text-slate-400">
                Không có playlist mới nào để hiển thị.
              </p>
          )}
        </Section>

        <Section title="Được Yêu Thích Nhất" onPlayAll={() => handlePlayAll(mostLikedSongs)}>
          {loading ? (
              <SkeletonGrid items={5} />
          ) : mostLikedSongs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {mostLikedSongs.map((song) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        onPlay={() => handlePlaySingleSong(song)}
                    />
                ))}
              </div>
          ) : (
              <p className="text-slate-400">
                Không có bài hát nào được yêu thích để hiển thị.
              </p>
          )}
        </Section>

        <Section title="Playlist Được Yêu Thích" viewAllLink="/playlists?category=most-liked">
          {loading ? (
              <SkeletonGrid items={5} />
          ) : mostLikedPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {mostLikedPlaylists.map((p) => (
                    <PlaylistCard key={p.id} playlist={p} />
                ))}
              </div>
          ) : (
              <p className="text-slate-400">
                Không có playlist nào được yêu thích để hiển thị.
              </p>
          )}
        </Section>

        <Section title="Nghệ sĩ nổi bật">
          {loading ? (
              <SkeletonGrid items={5} type="artist" />
          ) : topSingers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                {topSingers.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
          ) : (
              <p className="text-slate-400">Không có nghệ sĩ nào để hiển thị.</p>
          )}
        </Section>

        <Section title="#WebMusicChart" />

        <Footer />
      </div>
  );
};

export default MusicDiscoveryPage;