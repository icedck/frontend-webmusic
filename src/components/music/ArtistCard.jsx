// src/components/music/ArtistCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ArtistCard = ({ artist }) => {
    return (
        <Link to={`/artist/${artist.id}`} className="block group text-center">
            <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="mt-4 font-semibold truncate">{artist.name}</h3>
        </Link>
    );
};

export default ArtistCard;