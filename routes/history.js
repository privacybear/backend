const express = require('express');
const History = require('../models/History');
const auth = require('../middleware/auth');
const logger = require('../logging');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  // Create a new user
  try {
    History.find({ user: req.user._id })
      .limit(15)
      .sort({ timestamp: 'desc' })
      .exec(async (err, history) => {
        if (!history)
          return res
            .status(200)
            .send({ error: 'Theres no history available for the user.' });
        return res.json({ records: history.length, history: history });
      });
  } catch (error) {
    console.log('Catched error');
    logger.danger(error);
    res.status(400).send({ error: 'Something went wrong.' });
  }
});

router.get('/:site', auth, async (req, res) => {
  // Create a new user
  try {
    History.find({ user: req.user._id, site: req.params.site })
      .sort({ timestamp: 'desc' })
      .exec(async (err, history) => {
        if (!history)
          return res
            .status(200)
            .send({ error: 'Theres no history available for the website.' });
        return res.json({ records: history.length, history: history });
      });
  } catch (error) {
    console.log('Catched error');
    logger.danger(error);
    res.status(400).send({ error: 'Something went wrong.' });
  }
});

router.post('/add', auth, async (req, res) => {
  //Login a registered user
  try {
    const { site, url, permissions } = req.body;
    const history = new History({
      user: req.user._id,
      site: site,
      url: url,
      permissions: permissions,
      timestamp: new Date().getTime(),
    });
    await history.save();
    return res
      .status(200)
      .send({ status: 'Record created successfully', history: history });
  } catch (error) {
    console.log(error);
    logger.danger(error);
    res.status(400).send({ error });
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    History.findOneAndDelete({ user: req.user._id, _id: req.params.id }).exec(
      async (err, history) => {
        if (err) return res.send({ err });
        if (!history)
          return res
            .status(400)
            .send({ error: 'No record found for that ID.' });
        
        logger.danger(`User: ${req.user._id}, deleted resource ${req.params.id}.`)
        return res
          .status(200)
          .send({ status: 'History deleted successfully.' });
          
      }
    );
  } catch (error) {
    console.log(error);
    logger.danger(error);
    return res.status(400).send({ error });
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    History.deleteMany({ user: req.user._id }).exec(async (err, history) => {
      if (err) return res.status(400).send({ err });

      logger.danger(`User: ${req.user._id}, deleted all resources.`)
      return res
        .status(200)
        .send({ status: 'Deleted all records successfully.' });
    });
  } catch (err) {
    console.log(err);
    logger.danger(err);
    return res.status(400).send({ err });
  }
});

module.exports = router;
