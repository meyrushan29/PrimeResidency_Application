const express = require('express');
const router = express.Router();
const { createPoll, getPolls, votePoll } = require('../controller/pollController');

router.post('/create', createPoll);
router.get('/', getPolls);
router.post('/vote', votePoll);

module.exports = router;

