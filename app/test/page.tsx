'use client';

import PageTemplate from '../components/PageTemplate';

export default function TestPage() {
  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Test Page</h1>
        <p className="text-center text-gray-600">This is a test page to check if the server is working.</p>
      </div>
    </PageTemplate>
  );
} 