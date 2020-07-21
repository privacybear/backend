const express = require('express');
const Block = require('../models/Blocked');
const auth = require('../middleware/auth');
const logger = require('../logging');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try{
        Block.find({ user: req.user._id }).exec(async (err, blocked) => {
            if(err) return res.status(400).send({err});
            if(!blocked) return res.status(400).send({status: "No blocked sites found."})
    
            logger.log(`User ${req.user._id} fetched blocked sites.`);
    
            return res.status(200).send({records: blocked.length, blocked: blocked});
        })
    } catch(error){
        logger.danger(error);
        return res.status(400).send(error);
    }
});

router.post('/add', auth, async (req, res) => {
    try{
        const { site, url, permissions } = req.body;
        Block.findOne({ user: req.user._id, url: url}).exec(async (err, block) => {
            if(block) return res.status(400).send({status: 'A record for that URL already exists.'})
        })
        const blocked = new Block({
            user: req.user._id,
            site: site,
            url: url,
            permissions: permissions,
            timestamp: new Date().getTime(),
        });

        await blocked.save();
        return res
            .status(200)
            .send({status: 'Record created successfully.', blocked: blocked});

    } catch(error){
        logger.danger(error);
        return res.status(400).send(error);
    }
})

router.post('/change-permissions/:id', auth, async(req, res) => {
    try{
        if(!req.body.permissions){
            return res.status(400).send({error: "You have to provide something to update."})
        }
        Block.findOneAndUpdate(req.params.id, { permissions: req.body.permissions }).exec(async (err, result) => {
            if(err) return res.status(400).send({err});
            return res.status(200).send(result);
        })
    } catch(error){
        logger.danger(error);
        res.status(400).send(error);
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
      Block.findOneAndDelete({ user: req.user._id, _id: req.params.id }).exec(
        async (err, block) => {
          if (err) return res.send({ err });
          if (!block)
            return res
              .status(400)
              .send({ error: 'No record found for that ID.' });
          
          logger.danger(`User: ${req.user._id}, deleted blocked resource ${req.params.id}.`)
          return res
            .status(200)
            .send({ status: 'Blocked record deleted successfully.' });
            
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
      Block.deleteMany({ user: req.user._id }).exec(async (err, block) => {
        if (err) return res.status(400).send({ err });
  
        logger.danger(`User: ${req.user._id}, deleted all blocked resources.`)
        return res
          .status(200)
          .send({ status: 'Deleted all blocked records successfully.' });
      });
    } catch (err) {
      console.log(err);
      logger.danger(err);
      return res.status(400).send({ err });
    }
  });

module.exports = router;