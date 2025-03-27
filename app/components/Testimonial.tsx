import React from 'react';
import { StarIcon, UserIcon } from './Icons';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
}

const Testimonial = ({ quote, author, position }: TestimonialProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4 flex">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{quote}"</p>
      <div className="flex items-center">
        <div className="ml-4">
          <UserIcon />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{author}</h4>
          <p className="text-gray-600 text-sm">{position}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial; 