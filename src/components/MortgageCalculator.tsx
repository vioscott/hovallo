import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface MortgageCalculatorProps {
    propertyPrice: number;
    className?: string;
}

export function MortgageCalculator({ propertyPrice, className = '' }: MortgageCalculatorProps) {
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);

    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;

    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment using amortization formula
    const monthlyPayment = monthlyRate === 0
        ? loanAmount / numberOfPayments
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Estimate property tax (1.2% annually) and insurance (0.5% annually)
    const monthlyPropertyTax = (propertyPrice * 0.012) / 12;
    const monthlyInsurance = (propertyPrice * 0.005) / 12;

    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance;
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    return (
        <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Mortgage Calculator</h3>
            </div>

            <div className="space-y-6">
                {/* Down Payment */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Down Payment</label>
                        <span className="text-sm font-semibold text-gray-900">
                            {downPaymentPercent}% (₦{downPayment.toLocaleString()})
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Interest Rate */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                        <span className="text-sm font-semibold text-gray-900">{interestRate}%</span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="15"
                        step="0.5"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Loan Term */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Loan Term</label>
                        <span className="text-sm font-semibold text-gray-900">{loanTerm} years</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="30"
                        step="5"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Results */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</div>
                        <div className="text-3xl font-bold text-blue-600">
                            ₦{Math.round(totalMonthlyPayment).toLocaleString()}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Principal & Interest</span>
                            <span className="font-medium text-gray-900">₦{Math.round(monthlyPayment).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Property Tax (est.)</span>
                            <span className="font-medium text-gray-900">₦{Math.round(monthlyPropertyTax).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Insurance (est.)</span>
                            <span className="font-medium text-gray-900">₦{Math.round(monthlyInsurance).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between">
                            <span>Loan Amount</span>
                            <span>₦{loanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Payment</span>
                            <span>₦{Math.round(totalPayment).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Interest</span>
                            <span>₦{Math.round(totalInterest).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
                * This is an estimate. Actual rates and payments may vary.
            </p>
        </div>
    );
}
