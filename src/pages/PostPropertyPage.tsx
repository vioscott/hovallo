import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { storage, StoredProperty } from '../utils/storage';
import { UploadIcon, XIcon } from 'lucide-react';
export function PostPropertyPage() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment' as 'house' | 'apartment' | 'condo' | 'studio' | 'office',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    description: '',
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: ''
  });
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImageFiles([...imageFiles, ...newImages].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProperty: StoredProperty = {
      id: `prop-${Date.now()}`,
      userId: user!.id,
      title: formData.title,
      type: formData.type,
      price: Number(formData.price),
      location: formData.location,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      sqft: Number(formData.sqft),
      description: formData.description,
      images: imageFiles.length > 0 ? imageFiles : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      createdAt: new Date().toISOString()
    };
    storage.addProperty(newProperty);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  if (submitted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Posted!
          </h2>
          <p className="text-gray-600">
            Your listing is now live. Redirecting to dashboard...
          </p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Post a Property
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to list your property.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Photos (up to 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" disabled={imageFiles.length >= 5} />
                <label htmlFor="image-upload" className={`cursor-pointer ${imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </label>
              </div>

              {imageFiles.length > 0 && <div className="grid grid-cols-5 gap-3 mt-4">
                  {imageFiles.map((image, index) => <div key={index} className="relative group">
                      <img src={image} alt={`Upload ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>)}
                </div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., Modern Downtown Apartment" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select name="type" required value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="studio">Studio</option>
                  <option value="office">Office</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Price ($) *
                </label>
                <input type="number" name="price" required value={formData.price} onChange={handleChange} placeholder="2400" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g., Downtown, Seattle" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input type="number" name="bedrooms" required min="0" value={formData.bedrooms} onChange={handleChange} placeholder="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input type="number" name="bathrooms" required min="0" step="0.5" value={formData.bathrooms} onChange={handleChange} placeholder="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet *
                </label>
                <input type="number" name="sqft" required value={formData.sqft} onChange={handleChange} placeholder="1200" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea name="description" required rows={5} value={formData.description} onChange={handleChange} placeholder="Describe your property, its features, and amenities..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input type="text" name="contactName" required value={formData.contactName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Phone *
                  </label>
                  <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} placeholder="(555) 123-4567" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors">
              Post Property
            </button>
          </div>
        </form>
      </div>
    </div>;
}