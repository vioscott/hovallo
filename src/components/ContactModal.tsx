import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}
export function ContactModal({
  isOpen,
  onClose,
  propertyTitle,
  contactName,
  contactEmail,
  contactPhone
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 2000);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon className="w-6 h-6" />
        </button>

        {submitted ? <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Message Sent!
            </h3>
            <p className="text-gray-600">
              The property owner will contact you soon.
            </p>
          </div> : <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Contact Owner
            </h2>
            <p className="text-gray-600 mb-6">Interested in {propertyTitle}?</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Property Owner</p>
              <p className="font-semibold text-gray-900">{contactName}</p>
              <p className="text-sm text-gray-600">{contactEmail}</p>
              <p className="text-sm text-gray-600">{contactPhone}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input type="text" required value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input type="email" required value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone
                </label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({
              ...formData,
              phone: e.target.value
            })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({
              ...formData,
              message: e.target.value
            })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="I'm interested in this property..." />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </>}
      </div>
    </div>;
}