const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const logger = require('../logging');
const generateAvatar = require('silhouettejs').generateAvatar;

const router = express.Router();

router.get('/', auth, async (req, res) => {
  // Fetch user details
  try {
    const user = await User.findOne({ _id: req.user._id});
    if(!user){
      return res.status(400).send({ error: 'User does not exist.' })
    }
    logger.info(`${user.email} just fetched their information.`)
    return res.status(201).send({ user });
  } catch (error) {
    console.log('Catched error');
    logger.danger(error);
    res.status(400).send({ error: 'Something weird happened.' });
  }
})

router.post('/', async (req, res) => {
  // Create a new user
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).send({ error: 'Some fields are missing.' });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: generateAvatar(req.body.name),
    });
    await user.save();
    const token = await user.generateAuthToken();
    logger.info(`${req.body.name} just registered.`)
    res.status(201).send({ user, token });
  } catch (error) {
    console.log('Catched error');
    logger.danger(error);
    res.status(400).send({ error: 'User already exists.' });
  }
});

//Login a registered user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      logger.danger('Somebody just tried to login with wrong credentials.')
      return res.status(401).send({ error: 'Incorrect credentials.' });
    }
    const token = await user.generateAuthToken();
    logger.info(`${email} just logged in.`)
    res.send({ token });
  } catch (error) {
    console.log(error);
    logger.danger(error);
    res.status(400).send({ error });
  }
});

router.post('/change-password', auth, async (req, res) => {
  // Find the user
  try {
    if (!req.body.password) {
      return res.status(400).send('Invalid request');
    }
    User.findOne({ _id: req.user._id }).exec(async (err, user) => {
      if (err) console.log(err);
      if (!user) {
        logger.danger('Somebody tried to change the password of non-existent user.')
        return res.status(400).send('User not found.');
      }
      user.password = req.body.password;
      logger.info(`${req.user._id} just changed their password.`)
      await user.save();
      return res.status(200).send({ status: 'Password changed successfully.' });
    });
  } catch (err) {
    logger.danger(err);
    res.status(400).send({ err });
  }
});

module.exports = router;
