import React, { useState, useEffect } from 'react';

const EditOwner = () => {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch owner data when the component mounts
  useEffect(() => {
    const fetchOwnersData = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/owners'); // Replace with your API URL
        const data = await response.json();

        if (data.success) {
          setOwners(data.owners); // Assuming the owners data is in data.owners
        } else {
          alert('Failed to fetch owners data.');
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
        alert('Failed to fetch owner data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnersData();
  }, []); // Empty dependency array to run once when the component mounts

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner List</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">First Name</th>
              <th className="px-4 py-2 text-left">Last Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Residence Number</th>
              <th className="px-4 py-2 text-left">Member Count</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Profile Photo</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.length > 0 ? (
              owners.map(owner => (
                <tr key={owner.residenceNum} className="border-b">
                  <td className="px-4 py-2">{owner.firstName}</td>
                  <td className="px-4 py-2">{owner.lastName}</td>
                  <td className="px-4 py-2">{owner.age}</td>
                  <td className="px-4 py-2">{owner.residenceNum}</td>
                  <td className="px-4 py-2">{owner.memberCount}</td>
                  <td className="px-4 py-2">{owner.startDate}</td>
                  <td className="px-4 py-2">{owner.endDate}</td>
                  <td className="px-4 py-2">
                    <img
                      src={owner.profilePhoto ? URL.createObjectURL(owner.profilePhoto) : ''}
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => alert(`Edit details of ${owner.firstName} ${owner.lastName}`)} 
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-2 text-center">No owners found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EditOwner;

