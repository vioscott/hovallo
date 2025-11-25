import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
    propertyId: string;
    className?: string;
}

export function FavoriteButton({ propertyId, className = '' }: FavoriteButtonProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isFavorited, setIsFavorited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            if (user) {
                const favorited = await storage.isFavorite(user.id, propertyId);
                setIsFavorited(favorited);
            }
        };
        checkFavorite();
    }, [user, propertyId]);

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorited) {
                await storage.removeFavorite(user.id, propertyId);
                setIsFavorited(false);
            } else {
                await storage.addFavorite(user.id, propertyId);
                setIsFavorited(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all hover:scale-110 ${isFavorited
                    ? 'bg-red-100 text-red-600'
                    : 'bg-white text-gray-400 hover:text-red-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart
                className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
            />
        </button>
    );
}
