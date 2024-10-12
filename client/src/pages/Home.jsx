import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api-url.com' 
  : 'http://localhost:5000'; // For local development

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch offer listings
        const offerRes = await fetch(`${API_BASE_URL}/api/listing/get?offer=true&limit=4`);
        if (!offerRes.ok) throw new Error('Failed to fetch offer listings');
        const offerData = await offerRes.json();
        setOfferListings(offerData);

        // Fetch rent listings
        const rentRes = await fetch(`${API_BASE_URL}/api/listing/get?type=rent&limit=4`);
        if (!rentRes.ok) throw new Error('Failed to fetch rent listings');
        const rentData = await rentRes.json();
        setRentListings(rentData);

        // Fetch sale listings
        const saleRes = await fetch(`${API_BASE_URL}/api/listing/get?offer=true&limit=4`);
        if (!saleRes.ok) throw new Error('Failed to fetch sale listings');
        const saleData = await saleRes.json();
        setSaleListings(saleData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>Destination</span>
          <br />
          with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          KeyVista serves as your ultimate online destination, expertly designed to transform the real estate journey. 
          <br />
          Whether you aim to purchase, sell, or lease properties, KeyVista offers a vast array of listings tailored to meet your unique preferences.
        </div>
        <Link
          to={'/search'}
          style={{ color: '#ff0062' }}  // Add inline style for color
          className='text-xs sm:text-sm font-bold hover:underline'
        >
          Let's perfect begin...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='h-[500px]'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link
                className='text-sm hover:underline'
                style={{ color: '#ff0062' }}  // Add inline style for color
                to={'/search?type=sale'}
              >
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
