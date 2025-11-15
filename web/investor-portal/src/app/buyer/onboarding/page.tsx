'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface AccreditationData {
  incomeQualified: boolean;
  netWorthQualified: boolean;
  registeredAdvisor: boolean;
  other: boolean;
  otherDescription: string;
  documentFile?: File;
}

export default function BuyerOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [investmentRange, setInvestmentRange] = useState('');
  const [accreditationData, setAccreditationData] = useState<AccreditationData>({
    incomeQualified: false,
    netWorthQualified: false,
    registeredAdvisor: false,
    other: false,
    otherDescription: '',
  });

  const [terms, setTerms] = useState({
    understandsIlliquid: false,
    understandsRisk: false,
    notRelyingOnAdvice: false,
  });

  const handleAccreditationChange = (field: keyof Omit<AccreditationData, 'otherDescription' | 'documentFile'>) => {
    setAccreditationData(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAccreditationData(prev => ({
        ...prev,
        documentFile: e.target.files![0],
      }));
    }
  };

  const handleTermsChange = (field: keyof typeof terms) => {
    setTerms(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !investmentRange) {
      setError('Please select your investment range');
      return;
    }
    if (currentStep === 2 && !Object.values(accreditationData).slice(0, 4).some(v => v)) {
      setError('Please select at least one accreditation qualification');
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
    if (!terms.understandsIlliquid || !terms.understandsRisk || !terms.notRelyingOnAdvice) {
      setError('You must agree to all terms to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Submit accreditation data to backend
      console.log('Investment Range:', investmentRange);
      console.log('Accreditation Data:', accreditationData);
      console.log('Terms:', terms);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/buyer/dashboard');
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
              <h2 className="text-lg font-medium text-gray-900">Investor Onboarding</h2>
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

            {/* Step 1: Investor Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Investor Profile</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Tell us about your investment preferences
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investor Type
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.investorType === 'INDIVIDUAL' && 'Individual Investor'}
                      {user?.investorType === 'FAMILY_OFFICE' && 'Family Office'}
                      {user?.investorType === 'FUND' && 'Investment Fund'}
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="investmentRange" className="block text-sm font-medium text-gray-700">
                    Typical Investment Range <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="investmentRange"
                    name="investmentRange"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={investmentRange}
                    onChange={(e) => setInvestmentRange(e.target.value)}
                  >
                    <option value="">Select range</option>
                    <option value="<100k">Less than $100,000</option>
                    <option value="100k-500k">$100,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value=">1m">Over $1,000,000</option>
                  </select>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> This platform is for accredited investors only. You will need to verify your accreditation status in the next step.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Accreditation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Accreditation Verification</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    I am an accredited investor because... (check all that apply)
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="incomeQualified"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={accreditationData.incomeQualified}
                        onChange={() => handleAccreditationChange('incomeQualified')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="incomeQualified" className="font-medium text-gray-700">
                        Income over $200k (or $300k joint) for 2 years
                      </label>
                      <p className="text-gray-500">
                        I have had individual income exceeding $200,000 (or $300,000 joint income with spouse) in each of the prior two years and expect the same this year.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="netWorthQualified"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={accreditationData.netWorthQualified}
                        onChange={() => handleAccreditationChange('netWorthQualified')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="netWorthQualified" className="font-medium text-gray-700">
                        Net worth over $1M excluding primary residence
                      </label>
                      <p className="text-gray-500">
                        I have a net worth exceeding $1 million, either individually or jointly with my spouse, excluding my primary residence.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="registeredAdvisor"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={accreditationData.registeredAdvisor}
                        onChange={() => handleAccreditationChange('registeredAdvisor')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="registeredAdvisor" className="font-medium text-gray-700">
                        Registered investment advisor
                      </label>
                      <p className="text-gray-500">
                        I am a registered investment advisor or qualified institutional buyer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="other"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={accreditationData.other}
                        onChange={() => handleAccreditationChange('other')}
                      />
                    </div>
                    <div className="ml-3 text-sm flex-1">
                      <label htmlFor="other" className="font-medium text-gray-700">
                        Other qualification
                      </label>
                      {accreditationData.other && (
                        <input
                          type="text"
                          className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Please describe"
                          value={accreditationData.otherDescription}
                          onChange={(e) => setAccreditationData(prev => ({ ...prev, otherDescription: e.target.value }))}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload supporting documentation (optional for now)
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
                          htmlFor="accreditation-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="accreditation-upload"
                            name="accreditation-upload"
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
                  {accreditationData.documentFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {accreditationData.documentFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Terms */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Terms and Acknowledgments</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Please review and acknowledge the following important information
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="understandsIlliquid"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={terms.understandsIlliquid}
                        onChange={() => handleTermsChange('understandsIlliquid')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="understandsIlliquid" className="font-medium text-gray-700">
                        I understand these are illiquid securities
                      </label>
                      <p className="text-gray-500">
                        Private market securities cannot be easily sold and may have holding periods of several years. There is no guarantee of liquidity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="understandsRisk"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={terms.understandsRisk}
                        onChange={() => handleTermsChange('understandsRisk')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="understandsRisk" className="font-medium text-gray-700">
                        I may lose my entire investment
                      </label>
                      <p className="text-gray-500">
                        Private securities are high-risk investments. The companies may fail and I could lose all invested capital.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notRelyingOnAdvice"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={terms.notRelyingOnAdvice}
                        onChange={() => handleTermsChange('notRelyingOnAdvice')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notRelyingOnAdvice" className="font-medium text-gray-700">
                        I am not relying on this platform for advice
                      </label>
                      <p className="text-gray-500">
                        This platform does not provide investment, tax, or legal advice. I will consult my own advisors and make my own investment decisions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Investing in private securities involves substantial risk. These investments are speculative, illiquid, and may result in total loss of capital.
                        </p>
                      </div>
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