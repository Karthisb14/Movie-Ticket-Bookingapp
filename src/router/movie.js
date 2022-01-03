const express = require('express')
const movieapp = require('../models/usermodel')
const movieticket = require('../models/ticket')
const moviedetails = require('../models/screen')
const seatbooking = require('../models/seat')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/movieapp/signup', async(req, res) => {

    const Newaccount = new movieapp(req.body)

    try{
        const token = await Newaccount.generateAuthToken()
        await Newaccount.save()
        res.status(201).send({Newaccount, token})

    }catch(e){
        res.status(400).send(e)
    }

})

router.post('/movieapp/login', async(req, res) => {
    
    try{
        const movielogin = await movieapp.findbyCredentials(req.body.email, req.body.password)
        const token = await movielogin.generateAuthToken()
        res.status(200).send({movielogin, token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/movieapp/logout', auth, async(req, res) => {
    try{
        req.movieappdetails.tokens = req.movieappdetails.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.movieappdetails.save()
        res.send({success:'Logout Successfully!'})

    }catch(e){
        res.status(500).send()

    }
})


router.get('/movieapp/movielist', auth, async(req,res) => {

    const moviesearch = await moviedetails.findOne({moviename: req.body.moviename})
    
    if(moviesearch){
        return res.status(200).send({moviesearch})
    }

    try{
      const movielist = await moviedetails.find()
      res.status(200).send({movielist})
    }catch(e){
       res.status(400).send(e)
    }

})


router.post('/movieapp/ticketbooking', auth, async(req, res) => {

    const loginaccount = req.movieappdetails

    if(loginaccount.role === 'admin'){
        return res.status(400).send({error:'Invalid details'})
    }

    const checkmovie = await moviedetails.findOne({moviename: req.body.moviename})

    if(!checkmovie){
        return res.status(400).send({error: 'No movie Found'})
    }
    
    if(checkmovie.ticketavailable === 0){
        return res.send({error: 'All Ticket has been SOLD OUT!'})
    }
    const ticketnew = checkmovie.ticketavailable - req.body.numberofseats
    const userticketbook = checkmovie.TicketPrice * req.body.numberofseats


    const ticketbook = new movieticket({
        moviename: req.body.moviename,
        numberofseats: req.body.numberofseats,
        owner: loginaccount._id,
        TotalAmount: userticketbook
    })

    const seatbook = new seatbooking({
        moviename: req.body.moviename,
        seatNumber: req.body.seatNumber,
        user_id: loginaccount._id
    })

    try{
        const ticketupdate = await moviedetails.findOneAndUpdate({moviename: req.body.moviename}, {ticketavailable: ticketnew}, {new: true})
        await ticketbook.save()
        await ticketupdate.save()
        await seatbook.save()
        res.send({success: 'your ticket is booked Successfully!', ticketbook})

    }catch(e){
        res.status(400).send(e)
    } 
})

router.patch('/movieapp/password', auth, async(req,res) => {

    const data = req.movieappdetails

    const value = await bcrypt.compare(req.body.password, data.password)

    if(value === true){
        res.send({error: 'same password not allowed!'})
    }

    const passwordhash = await bcrypt.hash(req.body.password, 8)

    try{
        const updatemoviepw = await movieapp.findOneAndUpdate({email:req.body.email}, {password: passwordhash}, {new: true})
        res.send(updatemoviepw)
       
    }catch(e){
        res.status(400).send()

    }

})


module.exports = router