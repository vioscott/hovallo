import React from 'react';
// import { MortgageCalculator } from '../components/MortgageCalculator';

export function MortgagePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                        <p className="text-lg text-gray-600 mb-2">
                            Mortgage Calculator
                        </p>
                        <p className="text-gray-500">
                            We're working on bringing you a comprehensive mortgage calculator to help estimate your monthly payments.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Check back soon for this feature!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Original mortgage calculator implementation (commented out for future use)
/*
export function MortgagePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Estimate Your Monthly Payments</h1>
                    <p className="text-lg text-gray-600">
                        Use our mortgage calculator to understand your potential monthly payments, including principal, interest, taxes, and insurance.
                    </p>
                </div>

                <MortgageCalculator propertyPrice={50000000} />
            </div>
        </div>
    );
}
*/
