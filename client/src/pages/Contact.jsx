import React from 'react';

export default function Contact({ isDarkMode }) {
  return (
    <div className={`py-20 px-4 max-w-6xl mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        Contact Us
      </h1>
      <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
        We value your feedback and inquiries. Please reach out to us through the following channels:
      </p>
      <ul className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'} list-disc list-inside`}>
        <li><strong>Email:</strong> support@keyvista.com</li>
        <li><strong>Phone:</strong> +1 (555) 012-3456</li>
        <li><strong>Address:</strong> 123 KeyVista Street, Bandra, Maharastra, India</li>
      </ul>
      <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Follow Us</h2>
      <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
        Stay updated with our latest news and announcements by following us on social media.
      </p>
      <ul className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'} list-disc list-inside`}>
        <li><strong>Facebook:</strong>keyvista.facebook.com</li>
        <li><strong>Twitter:</strong> keyvista.twitter.com</li>
        <li><strong>Instagram:</strong> keyvista.instagram.com</li>
      </ul>
    </div>
  );
}
