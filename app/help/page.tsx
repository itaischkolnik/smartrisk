import React from 'react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Help Center
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">
            Need help with SmartRisk? Our support team is here to assist you.
          </p>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Support</h2>
            <p className="text-gray-600">
              Email us at: <a href="mailto:support@smartrisk.co.il" className="text-blue-600 hover:text-blue-800">support@smartrisk.co.il</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 