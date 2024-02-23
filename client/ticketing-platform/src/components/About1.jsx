import React from 'react';

const About1 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="max-w-6xl mx-auto p-8 flex items-center justify-between">
        {/* Left Side - Header and Small Writing */}
        <div className="w-1/2 pr-8">
          <h2 className="text-4xl font-bold text-blue-500 mb-4">About Us</h2>
          <p className="text-gray-700 mb-6">Customizable Ticket Event Pages.</p>
          <p className="text-sm text-gray-500">Founded in 2024, SwftT is dedicated to providing innovative solutions for event hosts worldwide.</p>
        </div>

        {/* Right Side - Flexbox for Images */}
        <div className="w-1/2 overflow-hidden">
          <div className="flexbox-container hover:translate-y-[-10px] transition-transform">
            {/* You can add your images here */}
            <img src="image1.jpg" alt="Image 1" className="w-1/2 h-full object-cover" />
            <img src="image2.jpg" alt="Image 2" className="w-1/2 h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};


export default About1;