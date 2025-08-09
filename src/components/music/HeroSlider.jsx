import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Play } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const slides = [
    { id: 1, title: 'Top Hits Việt Nam', description: 'Những ca khúc được nghe nhiều nhất tuần qua', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', link: '/playlist/1' },
    { id: 2, title: 'Album Mới: "22"', description: 'Khám phá album đầu tay của MONO', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', link: '/album/2' },
    { id: 3, title: 'Indie Discovery', description: 'Làn gió mới cho tâm hồn bạn', imageUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80', link: '/playlist/3' },
];

const HeroSlider = () => {
    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation]}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                navigation={true}
                className="h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full group">
                            <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                            {/* <<< NÚT PLAY ĐÃ ĐƯỢC THIẾT KẾ LẠI HOÀN TOÀN TẠI ĐÂY >>> */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                <div className={`
                                    w-20 h-20 bg-transparent rounded-full flex items-center justify-center text-white 
                                    border-2 border-cyan-400/80 group-hover:border-cyan-400
                                    scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 
                                    transition-all duration-300 ease-in-out
                                `}>
                                    <Play size={40} className="ml-2 fill-white" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                                <p className="text-lg opacity-90 mb-6">{slide.description}</p>
                                <Link to={slide.link}>
                                    <Button size="lg"><Play className="w-5 h-5 mr-2" /> Nghe ngay</Button>
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;