import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const ManageHomeAdds = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Base URL for API requests
  const baseURL = 'http://localhost:8001';

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/apartments`);
      
      // Handle different response structures
      const apartmentsData = response.data?.data || response.data || [];
      const data = Array.isArray(apartmentsData) ? apartmentsData : [];
      
      console.log('Apartments data:', data);
      
      // Log image paths for debugging
      data.forEach(apt => {
        if (apt.images && apt.images.length > 0) {
          console.log(`Apartment ${apt._id} images:`, apt.images);
        }
      });
      
      setApartments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching apartments:', err);
      setError('Failed to fetch apartments: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const handleDeleteClick = (apartment) => {
    setApartmentToDelete(apartment);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!apartmentToDelete) return;
    
    try {
      await axios.delete(`${baseURL}/api/apartments/${apartmentToDelete._id}`);
      setApartments(apartments.filter(apt => apt._id !== apartmentToDelete._id));
      setDeleteModalOpen(false);
      setApartmentToDelete(null);
    } catch (err) {
      console.error('Error deleting apartment:', err);
      setError('Failed to delete apartment: ' + (err.message || 'Unknown error'));
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setApartmentToDelete(null);
  };

  // Function to correctly format image URLs from MongoDB
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/images/default-image.jpg'; // Default image in case of error
    }
    
    let url;
    
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      url = imagePath;
    }
    // If the image path starts with '/homeimg', construct the full URL
    else if (imagePath.startsWith('/homeimg')) {
      url = `${baseURL}${imagePath}`;
    }
    // For paths not starting with '/' and no 'http', construct the full URL
    else {
      url = `${baseURL}/homeimg/apartments/${imagePath}`;
    }
    
    return url;
  };

  const handleImageError = (aptId, imgPath) => {
    console.error(`Failed to load image for apartment ${aptId}, path: ${imgPath}`);
    setImageErrors(prev => ({
      ...prev,
      [`${aptId}-${imgPath}`]: true
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading apartments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
        <button 
          onClick={fetchApartments} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Manage Apartment Listings
        </h1>
        <Link 
          to="/add-apartment" 
          className="flex items-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          <FiPlus className="mr-2" /> Add New Listing
        </Link>
      </div>

      {apartments.length === 0 ? (
        <div className="bg-gray-100 p-8 text-center rounded">
          <div className="text-xl mb-4">
            No apartment listings found.
          </div>
          <Link 
            to="/add-apartment" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apartment) => {
            const hasImages = apartment.images && apartment.images.length > 0;
            const imageUrl = hasImages ? getImageUrl(apartment.images[0]) : '/images/default-image.jpg'; // Fallback image
            const imageKey = hasImages ? `${apartment._id}-${apartment.images[0]}` : null;
            const hasImageError = imageKey ? imageErrors[imageKey] : false;

            return (
              <div key={apartment._id} className="border rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48 bg-gray-200">
                  <div className="w-full h-full">
                    <img 
                      src={hasImageError ? '/images/default-image.jpg' : imageUrl}
                      alt={apartment.title || 'Apartment'} 
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(apartment._id, apartment.images[0])}
                    />
                  </div>
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {apartment.title || 'Untitled'}
                  </h2>
                  <div className="flex justify-between mb-2">
                    <div className="font-bold text-green-600">
                      ${typeof apartment.price === 'number' ? apartment.price.toLocaleString() : apartment.price || 'N/A'}
                    </div>
                    <div className="text-gray-600">
                      {apartment.area || 'N/A'} sq ft
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      {apartment.bedrooms || 'N/A'} {apartment.bedrooms === '1' ? 'Bedroom' : 'Bedrooms'}
                    </div>
                    <div className="flex items-center">
                      {apartment.bathrooms || 'N/A'} {apartment.bathrooms === '1' ? 'Bathroom' : 'Bathrooms'}
                    </div>
                  </div>
                   <p className="text-gray-600 mb-4 line-clamp-3">
                    {apartment.description || 'No description'}
                  </p>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/edit-apartment/${apartment._id}`}
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FiEdit className="mr-1" /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(apartment)}
                      className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6">
              Are you sure you want to delete "{apartmentToDelete?.title || 'this apartment'}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomeAdds;
