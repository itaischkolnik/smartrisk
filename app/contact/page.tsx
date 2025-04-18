import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Contact Us
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 text-center mb-6">
            Our contact page is currently under construction. For any inquiries, please email us at:
          </p>
          <div className="text-center">
            <a
              href="mailto:contact@smartrisk.co.il"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              contact@smartrisk.co.il
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 