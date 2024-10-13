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
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const formDataToUpload = new FormData();

      for (let i = 0; i < files.length; i++) {
        formDataToUpload.append('images', files[i]);
      }

      try {
        const res = await fetch('https://keyvista.onrender.com/api/uploads', {
          method: 'POST',
          body: formDataToUpload,
        });
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Unexpected response: ${text}`);
        }
        const data = await res.json();

        if (res.ok && data.success) {
          // Assuming the API returns an array of image URLs
          setFormData((prevData) => ({
            ...prevData,
            imageUrls: [...prevData.imageUrls, ...data.imageUrls], // Append new image URLs
          }));
          setImageUploadError(false);
        } else {
          setImageUploadError(data.message || 'Image upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error); // Log the error for debugging
        setImageUploadError('Image upload failed due to a network error');
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { ...formData, avatar: formData.avatar || currentUser.avatar };
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
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
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
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
            type='text'
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
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-4'>
            <input
              type='number'
              placeholder='Regular Price'
              className='border p-3 rounded-lg'
              id='regularPrice'
              required
              onChange={handleChange}
              value={formData.regularPrice}
            />
            {formData.offer && (
              <input
                type='number'
                placeholder='Discount Price'
                className='border p-3 rounded-lg'
                id='discountPrice'
                required
                onChange={handleChange}
                value={formData.discountPrice}
              />
            )}
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <label className='cursor-pointer'>
            <span className='border border-dashed border-gray-500 p-10 rounded-lg flex flex-col justify-center items-center'>
              <span className='text-lg'>Upload Images (Max 6)</span>
              <span className='text-gray-400'>{uploading ? 'Uploading...' : 'Click to upload'}</span>
              <input
                type='file'
                multiple
                className='hidden'
                onChange={(e) => setFiles(e.target.files)}
              />
            </span>
          </label>
          {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
          <button
            onClick={handleImageSubmit}
            className='bg-blue-600 text-white p-3 rounded-lg'>
            Upload Images
          </button>
          <div className='grid grid-cols-2 gap-2'>
            {formData.imageUrls.map((url, index) => (
              <div key={index} className='relative'>
                <img src={url} alt='Uploaded' className='w-full h-32 object-cover rounded-lg' />
                <button
                  className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1'
                  onClick={() => handleRemoveImage(index)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
      {error && <p className='text-red-500'>{error}</p>}
      <button
        onClick={handleSubmit}
        className='bg-green-600 text-white p-3 rounded-lg mt-5'>
        {loading ? 'Creating...' : 'Create Listing'}
      </button>
    </main>
  );
}
