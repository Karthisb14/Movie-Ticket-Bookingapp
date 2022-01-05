const jwt = require('jsonwebtoken')
const movieapp = require('../models/usermodel')

const auth = async(req, res, next) => {

    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodetoken = jwt.verify(token, 'moviebookingapp')
        const movieappdetails = await movieapp.findOne({_id: decodetoken._id, 'tokens.token': token})

        if(!movieappdetails){
            throw new Error()
        }

        req.movieappdetails = movieappdetails
        req.tokens = token

        next()

    }catch(e){
        res.status(401).send({ error: 'Please Authenticate'})

    }
}


module.exports = auth 