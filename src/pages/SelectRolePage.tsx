import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, Home } from 'lucide-react';

export function SelectRolePage() {
    const navigate = useNavigate();
    const { createProfile } = useAuth();
    const [name, setName] = useState('');
    const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord' | 'agent' | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            setError('Please select an account type');
            return;
        }

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);
        setError(null);

        const result = await createProfile(name.trim(), selectedRole);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Failed to create profile');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600">Tell us a bit about yourself to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Account Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            I am a...
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tenant Option */}
                            <button
                                type="button"
                                onClick={() => setSelectedRole('tenant')}
                                className={`p-6 border-2 rounded-xl transition-all ${selectedRole === 'tenant'
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${selectedRole === 'tenant' ? 'bg-blue-100' : 'bg-gray-100'
                                        }`}>
                                        <Home className={`w-8 h-8 ${selectedRole === 'tenant' ? 'text-blue-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Tenant</h3>
                                    <p className="text-sm text-gray-600">Looking for a place to rent</p>
                                </div>
                            </button>

                            {/* Professional Option */}
                            <button
                                type="button"
                                onClick={() => setSelectedRole('landlord')}
                                className={`p-6 border-2 rounded-xl transition-all ${selectedRole === 'landlord' || selectedRole === 'agent'
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${selectedRole === 'landlord' || selectedRole === 'agent' ? 'bg-blue-100' : 'bg-gray-100'
                                        }`}>
                                        <Building2 className={`w-8 h-8 ${selectedRole === 'landlord' || selectedRole === 'agent' ? 'text-blue-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Professional</h3>
                                    <p className="text-sm text-gray-600">Landlord or Real Estate Agent</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Professional Type Selection */}
                    {(selectedRole === 'landlord' || selectedRole === 'agent') && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Specify your role
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole('landlord')}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${selectedRole === 'landlord'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Building2 className="w-5 h-5 inline-block mr-2" />
                                    Landlord
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole('agent')}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${selectedRole === 'agent'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Users className="w-5 h-5 inline-block mr-2" />
                                    Agent
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !selectedRole || !name.trim()}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Creating Profile...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
