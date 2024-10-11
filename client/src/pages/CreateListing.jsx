import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(null);
      const formDataToUpload = new FormData();

      Array.from(files).forEach((file) => {
        formDataToUpload.append('images', file);
      });

      try {
        const res = await fetch('https://keyvista.onrender.com/api/uploads', {
          method: 'POST',
          body: formDataToUpload,
        });

        const data = await res.json();

        if (data.success) {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...data.imageUrls], // assuming API returns image URLs
          }));
        } else {
          setImageUploadError(data.message || 'Image upload failed');
        }
      } catch (error) {
        setImageUploadError('Image upload failed');
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    
    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (type === 'number' || type === 'text' || type === 'textarea') {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      return setError('You must upload at least one image');
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      return setError('Discount price must be lower than regular price');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://keyvista.onrender.com/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((id) => (
              <div className='flex gap-2' key={id}>
                <input
                  type='checkbox'
                  id={id}
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.type === id || formData[id]}
                />
                <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
              </div>
            ))}
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className='flex flex-col gap-2'>
            {formData.imageUrls.map((imageUrl, index) => (
              <div key={index} className='relative'>
                <img src={imageUrl} alt={`Listing Image ${index + 1}`} className='h-40 w-full object-cover rounded-lg' />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full'
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <input
            type='file'
            accept='image/*'
            className='border p-3 rounded-lg'
            onChange={(e) => setFiles(e.target.files)}
            multiple
          />
          <button onClick={handleImageSubmit} className='bg-blue-500 text-white p-2 rounded-lg'>
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
          {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
          {error && <p className='text-red-500'>{error}</p>}
          <button type='submit' className='bg-green-500 text-white p-2 rounded-lg'>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </main>
  );
}
