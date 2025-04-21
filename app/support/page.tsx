export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Need help? Contact our support team at <a href="mailto:support@smartrisk.co.il" className="text-blue-600 hover:underline">support@smartrisk.co.il</a>
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">How do I start a new assessment?</h3>
            <p>Navigate to the dashboard and click on the "New Assessment" button to begin.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">How long does an analysis take?</h3>
            <p>Most analyses are completed within a few minutes after submission.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Can I update my assessment?</h3>
            <p>Yes, you can edit your assessment details at any time before requesting analysis.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 