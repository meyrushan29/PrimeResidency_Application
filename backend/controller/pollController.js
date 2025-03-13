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
