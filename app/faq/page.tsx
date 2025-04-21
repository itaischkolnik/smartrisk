export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">What is SmartRisk?</h2>
          <p className="text-gray-600">
            SmartRisk is an AI-powered business risk assessment platform that helps entrepreneurs and businesses evaluate and understand potential risks in their ventures.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">How does the assessment process work?</h2>
          <p className="text-gray-600">
            The assessment process involves filling out a comprehensive questionnaire about your business, uploading relevant documents, and receiving an AI-generated analysis of potential risks and opportunities.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">How accurate are the assessments?</h2>
          <p className="text-gray-600">
            Our assessments are based on advanced AI analysis of your provided information, industry data, and market trends. While they provide valuable insights, they should be used as one of many tools in your decision-making process.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Is my data secure?</h2>
          <p className="text-gray-600">
            Yes, we take data security seriously. All data is encrypted and stored securely. We never share your information with third parties without your explicit consent.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Can I update my assessment later?</h2>
          <p className="text-gray-600">
            Yes, you can update your assessment information at any time and request a new analysis to get the most current risk assessment.
          </p>
        </div>
      </div>
    </div>
  );
} 