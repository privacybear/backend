const express = require('express')
const User = require('../models/User')

const router = express.Router()

router.post('/', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        console.log('Catched error')
        res.status(400).send(error)
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

module.exports = router