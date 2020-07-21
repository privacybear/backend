const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const generateAvatar = require('silhouettejs').generateAvatar;

const router = express.Router()

router.post('/', async (req, res) => {
    // Create a new user
    try {
        if(!req.body.name || !req.body.email || !req.body.password){
            return res.status(400).send({error: 'Some fields are missing.'})
        }
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar: generateAvatar(req.body.name)
        })
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        console.log('Catched error')
        res.status(400).send({error: "User already exists."})
    }
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Incorrect credentials.'})
        }
        const token = await user.generateAuthToken()
        res.send({ token })
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }

})

router.post('/change-password', auth, async (req, res) => {
    // Find the user
    try{
        if(!req.body.password){
            return res.status(400).send('Invalid request')
        }
        User.findOne({_id: req.user._id}).exec(async (err, user) => {
            if(err) console.log(err);
            if(!user){
                return res.status(400).send('User not found.')
            }
            user.password = req.body.password;
            await user.save();
            return res.status(200).send({status: 'Password changed successfully.'})
        })
        
    } catch(err) {
        res.status(400).send({err})
    }
})

module.exports = router