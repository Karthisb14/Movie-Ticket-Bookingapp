const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    moviename:{
        type: String,
        unique: true
    },
    Cast:{
        type: String,
    },
    director: {
        type: String,
    },
    description:{
        type: String,
    },
    ticketavailable:{
        type: Number,
        default: 100
    },
    showtime:{
        type: String,
        default: '6 PM'
    },
    Theatre:{
        type: String,
        default: 'Jupiter'
    },
    TicketPrice:{
        type: Number,
        default: 12
    },
    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'movieapp'
    },
    date:{
        type: Date,
        default: Date.now
    }
})

movieSchema.methods.toJSON = function(){
    const bookshow = this
    const bookobject = bookshow.toObject()

    delete bookobject.name
    delete bookobject.admin_id
    return bookobject

}

const moviedetails = mongoose.model('moviecollection', movieSchema)

module.exports = moviedetails