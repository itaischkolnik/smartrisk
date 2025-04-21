export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Understanding Business Risk Assessment</h2>
            <p className="text-gray-600 mb-4">
              Learn about the key factors that influence business risk and how to mitigate them effectively.
            </p>
            <div className="text-sm text-gray-500">
              Coming soon
            </div>
          </div>
        </article>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Financial Analysis Best Practices</h2>
            <p className="text-gray-600 mb-4">
              Discover the essential metrics and methods for conducting thorough financial analysis.
            </p>
            <div className="text-sm text-gray-500">
              Coming soon
            </div>
          </div>
        </article>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Market Research Strategies</h2>
            <p className="text-gray-600 mb-4">
              Explore effective techniques for analyzing market conditions and opportunities.
            </p>
            <div className="text-sm text-gray-500">
              Coming soon
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 