import { Link } from 'react-router-dom';
import { BedIcon, BathIcon, SquareIcon } from 'lucide-react';
import { StoredProperty } from '../utils/storage';

interface PropertyCardProps {
  property: StoredProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      {/* Image Container with Overlay */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-lg backdrop-blur-sm bg-opacity-95">
          ₦{property.price.toLocaleString()}
        </div>
        {/* Property Type Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-lg text-xs font-medium capitalize shadow-md">
          {property.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.city}, {property.state}
        </p>

        {/* Property Features */}
        <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            <BedIcon className="w-4 h-4" />
            <span className="font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            <BathIcon className="w-4 h-4" />
            <span className="font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            <SquareIcon className="w-4 h-4" />
            <span className="font-medium">{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}