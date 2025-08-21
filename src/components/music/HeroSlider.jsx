// frontend/src/components/music/HeroSlider.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Thumbs, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import Button from "../common/Button";
import { useAudio } from "../../hooks/useAudio";
import { musicService } from "../../modules/music/services/musicService";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "./HeroSlider.css";

// Cấu trúc dữ liệu mới, có thêm "type" và "songId"
const staticSlides = [
  {
    id: 1,
    type: 'link', // Loại slide này là một liên kết
    title: "Quốc Khánh 2 - 9",
    description: "Hòa mình vào khúc ca hào hùng của đất nước trong ngày Quốc khánh 2/9.",
    imageUrl: "/image-heroslide/banner2-9.png",
    link: "/search?q=vn",
  },
  {
    id: 2,
    type: 'play_song', // Loại slide này sẽ phát nhạc
    songId: 57, 
    title: "Viết Tiếp Câu Chuyện Hòa Bình",
    description: "Bản hit mới nhất đang dẫn đầu bảng xếp hạng dịp lễ.",
    imageUrl: "/image-heroslide/bannerVTCTHB.jpg",
  },
  {
    id: 3,
    type: 'link', // Loại slide này là một liên kết
    title: "Trở Thành Premium",
    description: "Nghe nhạc không quảng cáo, chất lượng cao nhất",
    imageUrl: "/image-heroslide/banner-premium.jpg",
    link: "/premium",
  },
];

const HeroSlider = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { playSong } = useAudio();
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const [loadingSongId, setLoadingSongId] = useState(null);

  // Hàm xử lý việc lấy và phát nhạc
  const handlePlaySong = async (songId) => {
    if (isLoadingSong) return;

    setIsLoadingSong(true);
    setLoadingSongId(songId);

    try {
      const response = await musicService.getSongById(songId);
      if (response.success) {
        // Phát bài hát, playlist chỉ có 1 bài này
        playSong(response.data, [response.data]);
      } else {
        toast.error(response.message || "Không thể tải thông tin bài hát.");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi tải bài hát.");
      console.error("Failed to fetch and play song:", error);
    } finally {
      setIsLoadingSong(false);
      setLoadingSongId(null);
    }
  };

  return (
    <div className="hero-slider-container flex gap-4 h-[400px]">
      {/* Main Slider Wrapper (Bên trái) */}
      <div className="main-slider-wrapper flex-1 min-w-0 rounded-2xl overflow-hidden">
        <Swiper
          modules={[Autoplay, Navigation, Thumbs, EffectFade]}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="h-full main-slider"
        >
          {staticSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full group">
                <LazyLoadImage 
                  src={slide.imageUrl} 
                  alt={slide.title} 
                  className="w-full h-full object-cover slide-image" 
                  effect="opacity"
                  loading="lazy"
                  placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent slide-overlay"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white slide-content">
                  <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
                  <p className="text-lg opacity-90 mb-4 max-w-md drop-shadow-md">{slide.description}</p>
                  
                  {/* Render nút bấm dựa trên type của slide */}
                  {slide.type === 'play_song' ? (
                    <Button
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      onClick={() => handlePlaySong(slide.songId)}
                      disabled={isLoadingSong}
                    >
                      {isLoadingSong && loadingSongId === slide.songId ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : null}
                      Nghe ngay
                    </Button>
                  ) : (
                    <Link to={slide.link}>
                      <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                        Khám phá ngay
                      </Button>
                    </Link>
                  )}

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails Slider Wrapper (Bên phải) */}
      <div className="thumbs-slider-wrapper hidden md:block w-[200px] flex-shrink-0 h-full">
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          loop={true}
          direction="vertical"
          spaceBetween={16}
          slidesPerView={3}
          watchSlidesProgress={true}
          className="h-full thumbs-slider"
        >
          {staticSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full rounded-xl overflow-hidden cursor-pointer relative group">
                 <LazyLoadImage 
                   src={slide.imageUrl} 
                   alt={slide.title} 
                   className="w-full h-full object-cover" 
                   effect="opacity"
                   loading="lazy"
                   placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+"
                 />
                 <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300"></div>
                 <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg drop-shadow-md">
                   {slide.title}
                 </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSlider;