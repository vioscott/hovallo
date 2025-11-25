import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { storage, StoredProperty } from '../utils/storage';
import { PlusCircleIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react';
export function UserDashboardPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<StoredProperty[]>([]);
  useEffect(() => {
    if (user) {
      const userProps = storage.getUserProperties(user.id);
      setProperties(userProps);
    }
  }, [user]);
  const handleDelete = (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      storage.deleteProperty(propertyId);
      setProperties(properties.filter(p => p.id !== propertyId));
    }
  };
  return <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <Link to="/post" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircleIcon className="w-5 h-5" />
            Post New Property
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              My Properties
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {properties.length} total listings
            </p>
          </div>

          {properties.length === 0 ? <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircleIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by posting your first property listing.
              </p>
              <Link to="/post" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <PlusCircleIcon className="w-5 h-5" />
                Post Property
              </Link>
            </div> : <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map(property => <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&q=80'} alt={property.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.bedrooms} bed • {property.bathrooms}{' '}
                              bath
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        ${property.price.toLocaleString()}/mo
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {property.location}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => navigate(`/properties/${property.id}`)} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(property.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>}
        </div>
      </div>
    </div>;
}