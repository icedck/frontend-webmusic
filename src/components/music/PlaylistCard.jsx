import React from 'react';
// Bỏ import Link vì không còn dùng nữa
import { Play } from 'lucide-react';

const PlaylistCard = ({ playlist }) => {
    return (
        // Thay thế thẻ <Link> bằng thẻ <div>
        // Thêm `cursor-pointer` để người dùng biết có thể click vào
        <div className="block group cursor-pointer">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
                <img src={playlist.imageUrl} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play size={28} className="ml-1" />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <h3 className="font-semibold truncate">{playlist.title}</h3>
                <p className="text-sm text-slate-400 truncate">{playlist.description}</p>
            </div>
        </div>
    );
};

export default PlaylistCard;