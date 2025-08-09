// src/modules/premium/components/PremiumUpsellCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { Star } from 'lucide-react';

const PremiumUpsellCard = () => {
    return (
        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-cyan-500 to-blue-600">
            <div className="flex items-center mb-3">
                <Star className="w-6 h-6 mr-2 text-yellow-300" />
                <h3 className="text-xl font-bold">Mở Khóa Premium</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">
                Nghe nhạc không quảng cáo, chất lượng cao nhất và tận hưởng nhiều đặc quyền khác.
            </p>
            <Link to="/premium">
                <Button
                    variant="secondary"
                    className="w-full !bg-white/20 hover:!bg-white/30 !text-white backdrop-blur-lg"
                >
                    Nâng cấp ngay
                </Button>
            </Link>
        </div>
    );
};

export default PremiumUpsellCard;