import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadIcon, XIcon } from 'lucide-react';
import { storage, StoredProperty } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function EditListingPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingProperty, setLoadingProperty] = useState(true);
    const [property, setProperty] = useState<StoredProperty | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        currency: 'NGN',
        address: '',
        city: '',
        state: '',
        zip: '',
        type: 'apartment',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        description: '',
        images: [] as string[]
    });

    useEffect(() => {
        const loadProperty = async () => {
            if (!id) return;

            setLoadingProperty(true);
            const prop = await storage.getProperty(id);

            if (!prop) {
                alert('Property not found');
                navigate('/dashboard');
                return;
            }

            // Check if user owns this property
            if (user && prop.userId !== user.id && user.role !== 'admin') {
                alert('You do not have permission to edit this property');
                navigate('/dashboard');
                return;
            }

            setProperty(prop);
            setFormData({
                title: prop.title,
                price: prop.price.toString(),
                currency: prop.currency,
                address: prop.address,
                city: prop.city,
                state: prop.state,
                zip: prop.zip,
                type: prop.type,
                bedrooms: prop.bedrooms.toString(),
                bathrooms: prop.bathrooms.toString(),
                sqft: prop.sqft.toString(),
                description: prop.description,
                images: prop.images
            });
            setLoadingProperty(false);
        };

        loadProperty();
    }, [id, user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Mock image upload - in real app would upload to S3/Supabase
        const newImage = `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`;
        setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }));
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !id) return;

        setLoading(true);

        try {
            await storage.updateProperty(id, {
                title: formData.title,
                type: formData.type as any,
                price: Number(formData.price),
                currency: formData.currency,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                sqft: Number(formData.sqft),
                description: formData.description,
                images: formData.images.length > 0 ? formData.images : [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
                ]
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating property:', error);
            alert('Failed to update listing');
        } finally {
            setLoading(false);
        }
    };

    if (loadingProperty) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading property...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Modern Downtown Apartment"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                    <select
                                        name="type"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="condo">Condo</option>
                                        <option value="studio">Studio</option>
                                        <option value="office">Office</option>
                                        <option value="land">Land</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (per month)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">₦</span>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Location</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Street Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.zip}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Property Details</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sq Ft</label>
                                    <input
                                        type="number"
                                        name="sqft"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.sqft}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Photos</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                        <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Add Photo</span>
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
