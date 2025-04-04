import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiChevronDown, 
  FiChevronUp, 
  FiSearch, 
  FiDownload 
} from 'react-icons/fi';

const ManageHomeAdds = () => {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Base URL for API requests
  const baseURL = 'http://localhost:8001';

  useEffect(() => {
    fetchApartments();
  }, []);

  // Apply search whenever search term changes
  useEffect(() => {
    applySearch();
  }, [searchTerm, apartments]);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/apartments`);
      
      const apartmentsData = response.data?.data || response.data || [];
      const data = Array.isArray(apartmentsData) ? apartmentsData : [];
      
      setApartments(data);
      setFilteredApartments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching apartments:', err);
      setError('Failed to fetch apartments: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const applySearch = () => {
    let result = apartments;

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(apt => 
        (apt.title?.toLowerCase().includes(searchTermLower)) ||
        (apt.description?.toLowerCase().includes(searchTermLower))
      );
    }

    setFilteredApartments(result);
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/images/default-image.jpg'; 
    }
    
    let url;
    
    if (imagePath.startsWith('http')) {
      url = imagePath;
    }
    else if (imagePath.startsWith('/homeimg')) {
      url = `${baseURL}${imagePath}`;
    }
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

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = () => {
    const sortableItems = [...filteredApartments];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (sortConfig.key === 'price' || sortConfig.key === 'area') {
          // Handle numeric sorting
          const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue) || 0;
          const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue) || 0;
          return sortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
        } else {
          // Handle string sorting
          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableItems;
  };

  const getSortIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'ascending' ? 
        <FiChevronUp className="inline-block ml-1" /> : 
        <FiChevronDown className="inline-block ml-1" />;
    }
    return null;
  };

  const generatePDFReport = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText('Apartment Listings Report', {
      x: 50,
      y: height - 50,
      size: 18,
      font,
      color: rgb(0, 0, 0)
    });

    // Table headers
    const headers = ['Title', 'Price', 'Area', 'Bedrooms', 'Bathrooms'];
    const data = filteredApartments.map(apt => [
      apt.title || 'N/A',
      `$${apt.price?.toLocaleString() || 'N/A'}`,
      `${apt.area || 'N/A'} sq ft`,
      apt.bedrooms || 'N/A',
      apt.bathrooms || 'N/A'
    ]);

    let yOffset = height - 100;
    
    // Draw headers
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: 50 + index * 120,
        y: yOffset,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2)
      });
    });

    yOffset -= 20;

    // Draw data rows
    data.forEach(row => {
      row.forEach((cell, index) => {
        page.drawText(cell, {
          x: 50 + index * 120,
          y: yOffset,
          size: 10,
          font,
          color: rgb(0, 0, 0)
        });
      });
      yOffset -= 20;
    });

    // Summary statistics
    const stats = {
      totalListings: filteredApartments.length,
      totalValue: filteredApartments.reduce((sum, apt) => sum + (parseFloat(apt.price) || 0), 0),
      avgPrice: filteredApartments.reduce((sum, apt) => sum + (parseFloat(apt.price) || 0), 0) / filteredApartments.length,
    };

    page.drawText('Summary Statistics', {
      x: 50,
      y: yOffset - 30,
      size: 14,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Total Listings: ${stats.totalListings}`, {
      x: 50,
      y: yOffset - 50,
      size: 10,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Total Value: $${stats.totalListings ? stats.totalValue.toLocaleString() : 0}`, {
      x: 50,
      y: yOffset - 70,
      size: 10,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Average Price: $${stats.totalListings ? stats.avgPrice.toLocaleString() : 0}`, {
      x: 50,
      y: yOffset - 90,
      size: 10,
      font,
      color: rgb(0, 0, 0)
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'apartment_listings_report.pdf';
    link.click();
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
        <h1 className="text-2xl font-bold">Manage Apartments</h1>
        <div className="flex space-x-2">
          <button 
            onClick={generatePDFReport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center shadow-md transition-colors"
          >
            <FiDownload className="mr-2" /> Generate Report
          </button>
          <Link 
            to="/avhome" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center shadow-md transition-colors"
          >
            <FiPlus className="mr-2" /> Add New Apartment
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search apartments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 border rounded-md"
          />
          <FiSearch className="absolute left-2 top-3 text-gray-400" />
        </div>
      </div>

      {filteredApartments.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg shadow">
          <div className="text-xl mb-4">
            No apartment listings found.
          </div>
          <Link 
            to="/add-apartment" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <FiPlus className="mr-2" /> Add Your First Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Image
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('title')}
                  >
                    Title {getSortIcon('title')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('price')}
                  >
                    Price {getSortIcon('price')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('area')}
                  >
                    Area {getSortIcon('area')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('bedrooms')}
                  >
                    Bed {getSortIcon('bedrooms')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('bathrooms')}
                  >
                    Bath {getSortIcon('bathrooms')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedItems().map((apartment) => {
                  const hasImages = apartment.images && apartment.images.length > 0;
                  const imageUrl = hasImages ? getImageUrl(apartment.images[0]) : '/images/default-image.jpg';
                  const imageKey = hasImages ? `${apartment._id}-${apartment.images[0]}` : null;
                  const hasImageError = imageKey ? imageErrors[imageKey] : false;

                  return (
                    <tr key={apartment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                          <img 
                            src={hasImageError ? '/images/default-image.jpg' : imageUrl}
                            alt={apartment.title || 'Apartment'} 
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(apartment._id, apartment.images[0])}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {apartment.title || 'Untitled'}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {apartment.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          ${typeof apartment.price === 'number' ? apartment.price.toLocaleString() : apartment.price || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {apartment.area || 'N/A'} sq ft
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {apartment.bedrooms || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {apartment.bathrooms || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/editavhome/${apartment._id}`}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors"
                            title="Edit"
                          >
                            <FiEdit />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(apartment)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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