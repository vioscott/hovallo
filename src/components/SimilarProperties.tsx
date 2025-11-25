import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { storage, StoredProperty } from '../utils/storage';
import { PropertyCard } from './PropertyCard';

interface SimilarPropertiesProps {
    propertyId: string;
    className?: string;
}

export function SimilarProperties({ propertyId, className = '' }: SimilarPropertiesProps) {
    const [properties, setProperties] = useState<StoredProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            setLoading(true);
            const similar = await storage.getSimilarProperties(propertyId, 4);
            setProperties(similar);
            setLoading(false);
        };
        fetchSimilar();
    }, [propertyId]);

    if (loading) {
        return (
            <div className={`${className}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (properties.length === 0) {
        return null;
    }

    return (
        <div className={`${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Similar Properties</h2>
                <Link
                    to="/properties"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
                >
                    View all
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}
