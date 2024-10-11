import React from 'react';

export default function Purpose({ isDarkMode }) {
  return (
    <div className={`py-20 px-4 max-w-6xl mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        Purpose of KeyVista
      </h1>
      <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
        KeyVista aims to provide a comprehensive digital platform for citizens to access essential government services, real estate listings, and resources. The website serves as a centralized hub to facilitate transparent communication between the government, property owners, and the public, enabling users to:
      </p>
      <ul className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'} list-disc list-inside`}>
        <li>
          <strong>Access Government Services:</strong> Streamline the process of accessing government services, including applications for permits, licenses, and other official documents.
        </li>
        <li>
          <strong>Real Estate Listings:</strong> Browse and search for properties available for rent or sale, with detailed information such as BHK specifications, whether they are furnished, and other essential features.
        </li>
        <li>
          <strong>Owner Details:</strong> Provide potential renters or buyers with essential contact information for property owners and agents to facilitate direct communication.
        </li>
        <li>
          <strong>Profile Management:</strong> Allow users to create and update their profiles, manage property listings, and track inquiries related to their properties.
        </li>
        <li>
          <strong>Information Repository:</strong> Offer a reliable source of information about government programs, policies, real estate guidelines, and community resources, ensuring that citizens are well-informed about their rights and responsibilities.
        </li>
        <li>
          <strong>Community Engagement:</strong> Foster community involvement by providing platforms for feedback, suggestions, and discussions on local issues and initiatives, promoting a participatory governance model.
        </li>
        <li>
          <strong>E-Government Solutions:</strong> Implement innovative e-governance solutions that enhance efficiency, reduce bureaucracy, and provide citizens with timely updates on service delivery.
        </li>
        <li>
          <strong>Support and Resources:</strong> Equip users with resources such as FAQs, guides, and contact information for various departments and real estate services to facilitate problem-solving and support.
        </li>
        <li>
          <strong>Accessibility:</strong> Ensure that all citizens, regardless of their background or abilities, can easily navigate and utilize the services offered on the platform.
        </li>
      </ul>
      <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Vision</h2>
      <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
        Our vision is to create a digital ecosystem that empowers citizens, promotes transparency, and enhances the overall quality of life in the community. Through KeyVista, we strive to bridge the gap between the government, property owners, and its citizens, making governance and property management more accessible and responsive to the needs of the public.
      </p>
    </div>
  );
}
