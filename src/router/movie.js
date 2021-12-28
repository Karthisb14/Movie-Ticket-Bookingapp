const express = require('express')
const movieapp = require('../models/usermodel')

const router = new express.Router()

router.post('/movieapp/signup', async(req, res) => {
    const Newaccount = new movieapp(req.body)

    try{
        await Newaccount.save()
        res.status(201).send(Newaccount)

    }catch(e){
        res.status(400).send(e)
    }

})

router.post('/movieapp/login', async(req, res) => {
    try{
        const movielogin = await movieapp.findbyCredentials(req.body.email, req.body.password)
    
        if(!movielogin){
            res.send({error: 'Invalid details'})
        }

        res.send({movielogin})
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router