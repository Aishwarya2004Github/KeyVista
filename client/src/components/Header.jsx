import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import './Header.css'; // Adjust the path if necessary

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark', !isDarkMode); // Apply dark class to body
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
<header 
  className={`shadow-md ${isDarkMode ? 'bg-slate-200' : ''}`} 
  style={{ backgroundColor: isDarkMode ? '#ff6b93' : '#ff6b93' }} // Light gray background for light mode
>

      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/' className='flex items-center'>
          <img 
            src='/k.png' // Correct path for logo in the public folder
            alt='KeyVista Logo' 
            className='mr-2 h-12 w-14' // Adjust height and width as needed
          />
          <h1 className={`font-bold text-sm sm:text-xl flex flex-wrap ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Key</span>
            <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Vista</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className={`p-3 rounded-lg flex items-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
        >
          <input
            type='text'
            placeholder='Search...'
            className={`bg-transparent focus:outline-none w-24 sm:w-64 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className={`${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className={`hidden sm:inline ${isDarkMode ? 'text-white' : 'text-slate-700'} hover:underline`}>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className={`hidden sm:inline ${isDarkMode ? 'text-white' : 'text-slate-700'} hover:underline`}>
              About
            </li>
          </Link>
          <Link to='/purpose'>
            <li className={`hidden sm:inline ${isDarkMode ? 'text-white' : 'text-slate-700'} hover:underline`}>
              Purpose
            </li>
          </Link>
          <Link to='/contact'>
            <li className={`hidden sm:inline ${isDarkMode ? 'text-white' : 'text-slate-700'} hover:underline`}>
              Contact
            </li>
          </Link>
          <button onClick={toggleTheme} className={`text-slate-700 hover:underline ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          {/* Fullscreen Toggle Button */}
          <button onClick={toggleFullscreen} className={`text-slate-700 hover:underline ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
            {document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className={` ${isDarkMode ? 'text-white' : 'text-slate-700'} hover:underline`}> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
