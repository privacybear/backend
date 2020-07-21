const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const logger = require('../logging/logger');

router.get('/', async (req, res) => {
  logger.log('Yohoooo')
  logger.danger('OH SHIT')
  res.send('Hey 👋');
});

router.get('/ok', auth, async (req, res) => {
  logger.warn('Accessed the Ok route.')
  res.send(req.user);
});

module.exports = router;
