const express = require('express')
const moviedetails = require('../models/screen')
const movieapp = require('../models/usermodel')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const router = new express.Router()

router.post('/movieapp/admin', auth,async(req, res) => {

    if(req.movieappdetails.role === 'user-data'){
        return res.status(400).send({error:'cannot Access!'})
    }

    const moviestore = new  moviedetails({
        ...req.body,
        admin_id: req.movieappdetails._id
    })

    try{
        await moviestore.save()
        res.status(201).send(moviestore)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/movieapp/alluser', auth, async(req, res) => {

    const adminlogin = req.movieappdetails

    if(adminlogin.role === 'user-data'){
        return res.status(400).send({error:'Invalid Credentials!'})
    }
    
    try{
        const movieuserdetails = await movieapp.find()
        res.status(200).send(movieuserdetails)

    }catch(e){
        res.status(400).send()
    }  
})

router.patch('/movieapp/passwordupdate', auth, async(req,res) => {
    const adminpassword = req.movieappdetails

    if(adminpassword.role === 'user-data'){
        return res.status(400).send({error: 'Invalid details!'})
    }

    const adminhash = await bcrypt.hash(req.body.password, 8)
    
    try{
        const updatepassword = await movieapp.findOneAndUpdate({email: adminpassword.email}, {password: adminhash}, {new: true})
        res.send(updatepassword) 

    }catch(e){
        res.status(400).send()
    }
    


})

router.patch('/movieapp/updatemovie', auth, async(req, res) => {

    const updateadmin = req.movieappdetails

    if(updateadmin.role === 'user-data'){
        return res.status(400).send({error:'Invalid Credentials!'})
    }

    const updates = Object.keys(req.body)
    const allowedUpdates = ['moviename', 'Cast', 'description', 'director', 'showtime']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try{
        const movieupdate = await moviedetails.findOne({admin_id: updateadmin._id})
        updates.forEach((update) => {
            movieupdate[update] = req.body[update]
        })
        await movieupdate.save()
        res.send(movieupdate)

    }catch(e){
        res.status(400).send(e)
    }

})

router.delete('/movieapp/delete', auth, async(req, res) => {
    
    if(req.movieappdetails.email === req.body.email){
        return res.status(400).send({error:"Cannot access"})
    }

    try{
        const deleteuser= await movieapp.findOne({email:req.body.email}).deleteOne()
        
        if(!deleteuser){
            res.status(400).send({error:'Invalid Email'})
        }

        res.send({success:'Deleted Successfully!'})

    }catch(e){
        res.status(400).send()
    }
    
})


module.exports = router