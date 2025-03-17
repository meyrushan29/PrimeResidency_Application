const Voter = require('../models/Voters');

// Function to generate unique Voter ID in the format VID-2029-<UniqueNumber>
const generateVoterId = () => {
  // Get current timestamp and extract last 6 digits to create a unique number
  const timestamp = Date.now().toString().slice(-6); // Extract last 6 digits from timestamp
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Random 4-digit number
  
  return `VID-2029-${timestamp}${randomSuffix}`; // Voter ID in the format VID-2029-<UniqueNumber>
};

// Handle Voter Registration
const registerVoter = async (req, res) => {
  try {
    const { name, email, houseId } = req.body;
    const photo = req.file ? req.file.path : null; // Save photo if provided

    // Always use our custom voter ID generation function, don't rely on any other ID generation
    const voterId = generateVoterId();
    const registrationDate = new Date();

    // Create new voter document with our custom voter ID
    const newVoter = new Voter({
      voterId, // This will be in format VID-2029-XXXXXXXX
      name,
      email,
      houseId,
      photo,
      verified: false,
      registrationDate,
    });

    // Save to the database
    await newVoter.save();

    return res.status(200).json({
      message: 'Voter registration successful!',
      voter: newVoter,
    });
  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(500).json({
      message: 'An error occurred during voter registration.',
      error,
    });
  }
};

module.exports = { registerVoter };