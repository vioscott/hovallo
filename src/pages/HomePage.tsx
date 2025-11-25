import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, MessageCircleIcon, SearchIcon } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { storage, StoredProperty } from '../utils/storage';

export function HomePage() {
  const [properties, setProperties] = useState<StoredProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<StoredProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [bathrooms, setBathrooms] = useState<string>('all');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const allProperties = await storage.getProperties();
      const published = allProperties.filter(p => p.status === 'published');
      setProperties(published);
      setFilteredProperties(published);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (propertyType !== 'all') {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    // Bedrooms filter
    if (bedrooms !== 'all') {
      const minBedrooms = Number(bedrooms);
      filtered = filtered.filter(p => p.bedrooms >= minBedrooms);
    }

    // Bathrooms filter
    if (bathrooms !== 'all') {
      const minBathrooms = Number(bathrooms);
      filtered = filtered.filter(p => p.bathrooms >= minBathrooms);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, propertyType, priceRange, bedrooms, bathrooms, properties]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Discover amazing properties across Nigeria
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <AdvancedFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              propertyType={propertyType}
              onTypeChange={setPropertyType}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              bedrooms={bedrooms}
              onBedroomsChange={setBedrooms}
              bathrooms={bathrooms}
              onBathroomsChange={setBathrooms}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Search
              </h3>
              <p className="text-gray-600">
                Filter by type, price, and location to find exactly what you need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Posting
              </h3>
              <p className="text-gray-600">
                List your property in minutes with our simple form.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Direct Contact
              </h3>
              <p className="text-gray-600">
                Connect with owners and renters without any middleman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recent Properties
            </h2>
            <Link
              to="/properties"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 sm:h-56 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-4 pt-3">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-600 mb-4">No properties listed yet.</p>
              <Link
                to="/signup"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Be the first to post!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}