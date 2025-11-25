import React, { useEffect, useMemo, useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { FilterBar } from '../components/FilterBar';
import { storage, StoredProperty } from '../utils/storage';
export function PropertiesPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [searchLocation, setSearchLocation] = useState('');
  const [properties, setProperties] = useState<StoredProperty[]>([]);
  useEffect(() => {
    setProperties(storage.getProperties());
  }, []);
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesType = selectedType === 'all' || property.type === selectedType;
      const matchesPrice = property.price <= maxPrice;
      const matchesLocation = searchLocation === '' || property.location.toLowerCase().includes(searchLocation.toLowerCase());
      return matchesType && matchesPrice && matchesLocation;
    });
  }, [properties, selectedType, maxPrice, searchLocation]);
  return <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Browse Properties
        </h1>

        <FilterBar selectedType={selectedType} onTypeChange={setSelectedType} maxPrice={maxPrice} onMaxPriceChange={setMaxPrice} searchLocation={searchLocation} onLocationChange={setSearchLocation} />

        {filteredProperties.length === 0 ? <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria.
            </p>
          </div> : <>
            <p className="text-gray-600 mb-6">
              Showing {filteredProperties.length}{' '}
              {filteredProperties.length === 1 ? 'property' : 'properties'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => <PropertyCard key={property.id} property={property} />)}
            </div>
          </>}
      </div>
    </div>;
}