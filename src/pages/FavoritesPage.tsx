import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';
import { storage, StoredProperty } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { PropertyCard } from '../components/PropertyCard';

export function FavoritesPage() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<StoredProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                setLoading(true);
                const userFavorites = await storage.getUserFavorites(user.id);
                setFavorites(userFavorites);
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-red-600 fill-current" />
                    <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No favorites yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start exploring properties and save your favorites!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6">
                            You have {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
