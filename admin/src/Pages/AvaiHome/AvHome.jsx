import React, { useState, useEffect } from 'react';

export const AvHome = () => {
  const [formData, setFormData] = useState({
    title: '2-Bedroom Apartment',
    price: '150000',
    area: '1200',
    bedrooms: '2',
    bathrooms: '2',
    furnished: true,
    view: 'City View',
    description: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
      // Create preview URLs for the images
      const newPreviewImages = files.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewImages]);
      
      // Store the actual files in the form data
      setFormData(prevData => ({
        ...prevData,
        images: [...prevData.images, ...files]
      }));
    }
  };

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedImages = [...formData.images];
    
    // Release the object URL to free memory
    URL.revokeObjectURL(previewImages[index]);
    
    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);
    
    setPreviewImages(updatedPreviews);
    setFormData(prevData => ({
      ...prevData,
      images: updatedImages
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.price) errors.price = "Price is required";
    if (!formData.area) errors.area = "Area is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (formData.images.length < 3) errors.images = "At least 3 images are required";
    
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
      // Create a FormData object for file uploads
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add each image file to FormData with the correct field name
      formData.images.forEach((image, index) => {
        submitData.append('images', image); // Use 'images' as the field name to match backend
      });
      
      console.log('Submitting form data:', Object.fromEntries(submitData));
      
      const response = await fetch('http://localhost:8001/api/apartments', {
        method: 'POST',
        body: submitData,
        // Don't set Content-Type header with FormData
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Listing created successfully!');
        
        // Reset form after successful submission
        setFormData({
          title: '',
          price: '',
          area: '',
          bedrooms: '1',
          bathrooms: '1',
          furnished: false,
          view: '',
          description: '',
          images: []
        });
        
        // Clear preview images
        previewImages.forEach(url => URL.revokeObjectURL(url));
        setPreviewImages([]);
      } else {
        alert(`Error: ${data.error || 'Failed to create listing'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Apartment Listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-blue-800">Listing Details</h2>
          <p className="text-sm text-blue-600">Current listing: {formData.title} - LKR {Number(formData.price || 0).toLocaleString()}/month</p>
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
        
        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Images * (Min. 3 images required)
          </label>
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className={`block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 ${formErrors.images ? 'border border-red-500 rounded-md' : ''}`}
          />
          <p className="text-xs text-gray-500">
            Upload at least 3 high-quality images of your property (JPEG, PNG format, max 5MB each)
          </p>
          {formErrors.images && <p className="mt-1 text-xs text-red-500">{formErrors.images}</p>}
          
          {/* Image Preview */}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Image Previews</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {formData.images.length} {formData.images.length === 1 ? 'image' : 'images'} selected
                {formData.images.length < 3 && ' (minimum 3 required)'}
              </p>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting || formData.images.length < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting || formData.images.length < 3}
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvHome;