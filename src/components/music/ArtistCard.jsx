import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ArtistCard = ({ artist }) => {
    const imageUrl = artist.avatarPath ? `${API_BASE_URL}${artist.avatarPath}` : 'https://via.placeholder.com/150';

    return (
        <Link to={`/singer/${artist.id}`} className="block group text-center">
            <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <LazyLoadImage 
                    src={imageUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover" 
                    effect="blur"
                    loading="lazy"
                    placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+"
                />
            </div>
            <h3 className="mt-4 font-semibold truncate">{artist.name}</h3>
        </Link>
    );
};

export default ArtistCard;