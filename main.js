const express = require('express')
require('./src/db/database')
const movieapp = require('./src/models/bookmodel')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/movieapp/signup', async(req, res) => {
    const Newaccount = new movieapp(req.body)

    try{
        await Newaccount.save()
        res.status(201).send(Newaccount)

    }catch(e){
        res.status(400).send(e)
    }

})

app.post('/movieapp/login', async(req, res) => {
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

app.listen(port , () => {
    console.log(`Server is Running on ${port}`)
})