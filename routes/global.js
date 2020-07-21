const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  res.send('Hey 👋');
});

router.get('/ok', auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
