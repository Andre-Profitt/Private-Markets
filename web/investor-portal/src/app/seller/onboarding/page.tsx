'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

type ShareType = 'COMMON' | 'PREFERRED' | 'OPTIONS';

interface HoldingData {
  shareType: ShareType;
  quantity: number;
  grantDate: string;
  proofFile?: File;
}

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [holdingData, setHoldingData] = useState<HoldingData>({
    shareType: 'COMMON',
    quantity: 0,
    grantDate: '',
  });

  const [consent, setConsent] = useState({
    ownsShares: false,
    understandsRisk: false,
    agreesToTerms: false,
  });

  const handleHoldingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHoldingData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHoldingData(prev => ({
        ...prev,
        proofFile: e.target.files![0],
      }));
    }
  };

  const handleConsentChange = (field: keyof typeof consent) => {
    setConsent(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!holdingData.shareType || !holdingData.quantity || !holdingData.grantDate)) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!consent.ownsShares || !consent.understandsRisk || !consent.agreesToTerms) {
      setError('You must agree to all terms to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Submit holding data to backend
      // For now, just redirect to dashboard
      console.log('Submitting holding data:', holdingData);
      console.log('Consent:', consent);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/seller/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Progress bar */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-gray-900">Seller Onboarding</h2>
              <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            {/* Step 1: Holdings Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Holdings Information</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Tell us about the shares you own in {user?.company || 'your company'}
                  </p>
                </div>

                <div>
                  <label htmlFor="shareType" className="block text-sm font-medium text-gray-700">
                    Share Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="shareType"
                    name="shareType"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={holdingData.shareType}
                    onChange={handleHoldingChange}
                  >
                    <option value="COMMON">Common Stock</option>
                    <option value="PREFERRED">Preferred Stock</option>
                    <option value="OPTIONS">Stock Options</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Number of Shares <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="10000"
                    value={holdingData.quantity || ''}
                    onChange={handleHoldingChange}
                  />
                </div>

                <div>
                  <label htmlFor="grantDate" className="block text-sm font-medium text-gray-700">
                    Grant Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="grantDate"
                    name="grantDate"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={holdingData.grantDate}
                    onChange={handleHoldingChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The date when these shares were granted to you
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Upload Proof */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Proof of Ownership</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Please upload documentation that proves your ownership of these shares
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documentation
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                  {holdingData.proofFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {holdingData.proofFile.name}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Examples: Option agreement, cap table screenshot, grant letter
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Consent */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Terms and Consent</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Please review and agree to the following terms
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="ownsShares"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={consent.ownsShares}
                        onChange={() => handleConsentChange('ownsShares')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="ownsShares" className="font-medium text-gray-700">
                        I legally own these shares
                      </label>
                      <p className="text-gray-500">
                        I confirm that I am the legal owner of the shares I am listing and have the right to sell them.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="understandsRisk"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={consent.understandsRisk}
                        onChange={() => handleConsentChange('understandsRisk')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="understandsRisk" className="font-medium text-gray-700">
                        I understand this is not tax or legal advice
                      </label>
                      <p className="text-gray-500">
                        I acknowledge that the platform does not provide tax, legal, or financial advice and I should consult with my own advisors.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreesToTerms"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={consent.agreesToTerms}
                        onChange={() => handleConsentChange('agreesToTerms')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreesToTerms" className="font-medium text-gray-700">
                        I agree to the platform terms and conditions
                      </label>
                      <p className="text-gray-500">
                        I have read and agree to the platform's terms of service and privacy policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous
                </button>
              )}
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Completing...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}