const express = require('express');
const router = express.Router();
const { 
  createPoll, 
  getPolls, 
  votePoll, 
  deletePoll,
  updatePoll  // Import the new update controller function
} = require('../controller/pollController');

// Existing routes
router.post('/create', createPoll);
router.get('/', getPolls);
router.post('/vote', votePoll);
router.delete('/:pollId', deletePoll);

// New update route
router.put('/:pollId', updatePoll);

module.exports = router;