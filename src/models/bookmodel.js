const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const MovieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email.Please Enter Correct Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    mobilenumber: {
        type: Number,
        required: true,
        unique: true,
        minlength:10,
        validate(value){
            if(value.toString().length < 10){
                throw new Error('Please Check Mobile Number')
            }
        }
    }

})

MovieSchema.statics.findbyCredentials = async(email, password) => {

    const useremail = await movieapp.findOne(email)

    if(!useremail){
        throw new Error('Unable to login')
    }

    const ismatch = await bcrypt.compare(password, useremail.password)

    if(!ismatch){
        throw new Error('Unable to login')
    }

    return useremail

}


MovieSchema.pre('save', async function(next) {
    const moviepassword = this

    if(moviepassword.isModified('password')){
        moviepassword.password = await bcrypt.hash(moviepassword.password, 8)
    }

    next()

})
const movieapp = mongoose.model('Userdata', MovieSchema)

module.exports = movieapp