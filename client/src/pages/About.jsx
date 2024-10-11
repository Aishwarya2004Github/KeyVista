import React from 'react';

export default function About({ isDarkMode }) {
  return (
    <div className={`py-20 px-4 max-w-6xl mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        About KeyVista
      </h1>
      <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
        KeyVista is dedicated to enhancing the relationship between the government and its citizens by offering a digital platform that simplifies access to services and information. Our mission is to empower users by providing them with the necessary tools and resources to make informed decisions regarding government services and real estate opportunities.
      </p>
      <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Our Values</h2>
      <ul className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'} list-disc list-inside`}>
        <li><strong>Transparency:</strong> We believe in open communication and clear information regarding government services.</li>
        <li><strong>Accessibility:</strong> Our platform is designed to be user-friendly for all citizens.</li>
        <li><strong>Community Focus:</strong> We prioritize the needs of our community in every decision we make.</li>
        <li><strong>Innovation:</strong> We strive to implement the latest technologies to improve service delivery.</li>
      </ul>
    </div>
  );
}
