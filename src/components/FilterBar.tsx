import React from 'react';
interface FilterBarProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  searchLocation: string;
  onLocationChange: (location: string) => void;
}
export function FilterBar({
  selectedType,
  onTypeChange,
  maxPrice,
  onMaxPriceChange,
  searchLocation,
  onLocationChange
}: FilterBarProps) {
  return <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select value={selectedType} onChange={e => onTypeChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price: ${maxPrice.toLocaleString()}/mo
          </label>
          <input type="range" min="0" max="5000" step="100" value={maxPrice} onChange={e => onMaxPriceChange(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input type="text" placeholder="Search by location..." value={searchLocation} onChange={e => onLocationChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>
    </div>;
}