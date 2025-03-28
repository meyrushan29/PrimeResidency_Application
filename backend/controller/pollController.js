const Poll = require('../models/Polls');

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || options.length < 2) {
      return res.status(400).json({ message: 'Poll must have a question and at least 2 options' });
    }

    const formattedOptions = options.map(option => ({ option, votes: 0 }));

    const poll = new Poll({ question, options: formattedOptions });
    await poll.save();

    res.status(201).json({ message: 'Poll created successfully', poll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all polls
exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Vote on a poll
exports.votePoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    if (!pollId || !optionId) {
      return res.status(400).json({ message: 'Poll ID and Option ID are required' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const optionIndex = poll.options.findIndex(opt => opt._id.toString() === optionId);
    if (optionIndex === -1) return res.status(404).json({ message: 'Option not found' });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.status(200).json({ message: 'Vote cast successfully', poll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Controller function to handle deleting a poll
exports.deletePoll = async (req, res) => {
  try {
    const { pollId } = req.params; // Get pollId from URL parameters
    
    // Find the poll and delete it
    const poll = await Poll.findByIdAndDelete(pollId);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' }); // If no poll is found, send 404
    }

    res.status(200).json({ message: 'Poll deleted successfully' }); // Respond with success
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete poll' }); // Handle error
  }
};


// Update an existing poll
exports.updatePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { question, options } = req.body;

    // Validation checks
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ 
        message: 'Poll must have a question and at least 2 options' 
      });
    }

    // Find the poll by ID
    const poll = await Poll.findById(pollId);
    
    // Check if poll exists
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Update poll question
    poll.question = question;

    // Handle options update
    // If existing options have votes, preserve vote count
    const updatedOptions = options.map(newOption => {
      // Try to find a matching existing option
      const existingOption = poll.options.find(
        opt => opt.option.toLowerCase() === newOption.toLowerCase()
      );

      // If found, keep its existing vote count
      if (existingOption) {
        return { 
          option: newOption, 
          votes: existingOption.votes 
        };
      }

      // If new option, start with 0 votes
      return { 
        option: newOption, 
        votes: 0 
      };
    });

    // Update poll options
    poll.options = updatedOptions;

    // Save the updated poll
    await poll.save();

    res.status(200).json({ 
      message: 'Poll updated successfully', 
      poll 
    });
  } catch (error) {
    console.error('Poll update error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};