import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="card p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800 text-rtl">{title}</h3>
      <p className="text-gray-600 text-rtl leading-relaxed">{description}</p>
      
      <div className="mt-6 inline-block">
        <a href="#" className="text-primary font-medium flex items-center text-rtl hover:text-primary-dark transition-all">
          <span>מידע נוסף</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FeatureCard; 