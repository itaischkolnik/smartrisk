import React from 'react';

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 ml-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Step; 