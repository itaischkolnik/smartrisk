import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          About SmartRisk
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">
            SmartRisk is an innovative platform designed to help organizations assess and manage their cybersecurity risks effectively. Our mission is to make cybersecurity risk assessment accessible, comprehensive, and actionable for businesses of all sizes.
          </p>
          <p className="text-gray-600">
            Our platform combines expert knowledge with advanced analytics to provide detailed insights into your organization's security posture, helping you make informed decisions about your cybersecurity investments and strategies.
          </p>
        </div>
      </div>
    </div>
  );
} 