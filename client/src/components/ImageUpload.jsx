import React, { useState } from 'react';

const ImageUpload = () => {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            const res = await fetch('https://keyvista.onrender.com/api/uploads', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setUploadedImages(data.imageUrls);
                setImageUploadError(false);
            } else {
                setImageUploadError(data.message || 'Image upload failed');
            }
        } catch (error) {
            setImageUploadError('Image upload failed');
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleImageSubmit}>
                <input type="file" multiple onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {imageUploadError && <p>{imageUploadError}</p>}
            {uploadedImages.length > 0 && (
                <div>
                    <h3>Uploaded Images:</h3>
                    {uploadedImages.map((url, index) => (
                        <img key={index} src={url} alt={`Uploaded ${index}`} width="100" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
