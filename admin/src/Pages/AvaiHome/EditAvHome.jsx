import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditApartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = 'http://localhost:8001';

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    furnished: false,
    view: '',
    description: '',
    images: []
  });

  const [originalImages, setOriginalImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch apartment data
  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseURL}/api/apartments/${id}`);
        
        // Handle different response structures
        const apartmentData = response.data?.data || response.data;
        
        if (!apartmentData) {
          throw new Error('No apartment data found');
        }
        
        console.log('Fetched apartment data:', apartmentData);
        
        // Update form data with fetched apartment details
        setFormData({
          title: apartmentData.title || '',
          price: apartmentData.price || '',
          area: apartmentData.area || '',
          bedrooms: apartmentData.bedrooms || '',
          bathrooms: apartmentData.bathrooms || '',
          furnished: apartmentData.furnished || false,
          view: apartmentData.view || '',
          description: apartmentData.description || '',
          images: [] // We'll handle images separately
        });
        
        // Process existing images
        if (apartmentData.images && apartmentData.images.length > 0) {
          const imageUrls = apartmentData.images.map(imagePath => {
            // Construct proper URL for each image
            return {
              path: imagePath,
              url: getImageUrl(imagePath)
            };
          });
          
          setOriginalImages(imageUrls);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching apartment data:', err);
        setLoadError(err.message || 'Failed to load apartment data');
        setIsLoading(false);
      }
    };
    
    fetchApartmentData();
  }, [id]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  // Function to correctly format image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/images/default-image.jpg';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else if (imagePath.startsWith('/homeimg')) {
      return `${baseURL}${imagePath}`;
    } else {
      return `${baseURL}/homeimg/apartments/${imagePath}`;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Create preview URLs for the new images
      const newPreviewImages = files.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewImages]);
      
      // Store the actual files
      setNewImages([...newImages, ...files]);
    }
  };

  const removeNewImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedImages = [...newImages];
    
    // Release the object URL to free memory
    URL.revokeObjectURL(previewImages[index]);
    
    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);
    
    setPreviewImages(updatedPreviews);
    setNewImages(updatedImages);
  };

  const removeOriginalImage = (index) => {
    const updatedOriginalImages = [...originalImages];
    const imageToDelete = updatedOriginalImages[index];
    
    // Add this image path to the list of images to delete on the server
    setImagesToDelete([...imagesToDelete, imageToDelete.path]);
    
    // Remove from original images array
    updatedOriginalImages.splice(index, 1);
    setOriginalImages(updatedOriginalImages);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.price) errors.price = "Price is required";
    if (!formData.area) errors.area = "Area is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    
    // Check if we'll have at least 3 images after the update
    const totalImagesAfterUpdate = originalImages.length + newImages.length;
    if (totalImagesAfterUpdate < 3) errors.images = "At least 3 images are required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a FormData object for the update
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add each new image file
      newImages.forEach(image => {
        submitData.append('newImages', image);
      });
      
      // Add the image paths to keep (original images that weren't deleted)
      submitData.append('existingImages', JSON.stringify(originalImages.map(img => img.path)));
      
      // Add the image paths to delete
      submitData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      
      console.log('Submitting updated data:', {
        formData: Object.fromEntries(submitData),
        existingImages: originalImages.map(img => img.path),
        imagesToDelete
      });
      
      const response = await axios.put(`${baseURL}/api/apartments/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        alert('Apartment listing updated successfully!');
        navigate('/manageaddhome'); // Redirect to the management page
      } else {
        alert(`Error: ${response.data.error || 'Failed to update listing'}`);
      }
    } catch (error) {
      console.error('Error updating apartment:', error);
      alert('Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading apartment data...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {loadError}
        </div>
        <button 
          onClick={() => navigate('/manage-apartments')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Apartment Management
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Apartment Listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-blue-800">Update Listing</h2>
          <p className="text-sm text-blue-600">
            Editing: {formData.title} - LKR {Number(formData.price || 0).toLocaleString()}/month
          </p>
        </div>
        
        {/* Required Fields Notice */}
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <p className="text-sm text-yellow-700">Fields marked with an asterisk (*) are required.</p>
        </div>
        
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR/month) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-2 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
          </div>
        </div>
        
        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft) *</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={`w-full p-2 border ${formErrors.area ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {formErrors.area && <p className="mt-1 text-xs text-red-500">{formErrors.area}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
            <select
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
            <select
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700">Amenities</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="furnished"
              name="furnished"
              checked={formData.furnished}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="furnished" className="ml-2 block text-sm text-gray-700">
              Fully Furnished
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
            <input
              type="text"
              name="view"
              value={formData.view}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full p-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Describe the property..."
            required
          ></textarea>
          {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
        </div>
        
        {/* Existing Images */}
        {originalImages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-md font-medium text-gray-700">Current Images</h3>
            <div className="flex flex-wrap gap-4">
              {originalImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt="Current Image"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeOriginalImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-gray-700">New Images</h3>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex flex-wrap gap-4">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt="New Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApartment;
