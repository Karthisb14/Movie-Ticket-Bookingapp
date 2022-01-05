const express = require('express')
const movieapp = require('../models/usermodel')
const movieticket = require('../models/ticket')
const moviedetails = require('../models/screen')
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
        if(movielogin.isdelete === true){
            return res.status(400).send({error:'Your account already deleted!'})
        }
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

    try{
        const movielist = await moviedetails.find()
        res.status(200).send({movielist})
    }catch(e){
        res.status(400).send(e)
    }

})

// GET /movieapp?moviename
router.get('/movieapp/moviename', auth, async(req, res) => {
   
    const moviename = await moviedetails.findOne({moviename: req.query.moviename})

    if(moviename){
        return res.status(200).send({moviename})
    }

    if(moviename === null){
        return res.status(400).send({error:'No Movie found'})
    }
})


router.post('/movieapp/ticketbooking', auth, async(req, res) => {

    const loginaccount = req.movieappdetails

    if(loginaccount.role === 'admin'){
        return res.status(400).send({error:'Admin cannot booking!'})
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
        seatnumber: req.body.seatnumber,
        owner_id: loginaccount._id,
        TotalAmount: userticketbook
    })

    try{
        const ticketupdate = await moviedetails.findOneAndUpdate({moviename: req.body.moviename}, {ticketavailable: ticketnew}, {new: true})
        await ticketbook.save()
        await ticketupdate.save()
        res.send({success: 'your ticket is booked Successfully!', ticketbook})

    }catch(e){
        res.status(400).send(e)
    } 
})

router.get('/movieapp/bookinghistory', auth, async(req, res) => {

    try{
        const bookingdetails = await movieticket.find({owner_id: req.movieappdetails._id})
        res.status(200).send(bookingdetails)
        
    }catch(e){
        res.status(400).send(e)
    }
    
})

router.patch('/movieapp/password', auth, async(req,res) => {

    const userpassword = req.movieappdetails.password
    
    const matchpassword = await bcrypt.compare(req.body.currentpassword, userpassword)
  
    if(!matchpassword){
        return res.send({error:'Invalid Current password'})
    }
    const hashpassword = await bcrypt.hash(req.body.password, 8)

    try{
        const updatepassword = await movieapp.findOneAndUpdate({email: req.body.email}, {password: hashpassword}, {new: true})
        
        if(!updatepassword){
            res.send(e)
        }
        await updatepassword.save()
        res.send(updatepassword)

    }catch(e){
        res.status(400).send()
    }

})


module.exports = router