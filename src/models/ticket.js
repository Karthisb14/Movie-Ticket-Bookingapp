const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema({
    moviename:{
      type: String
    },
    numberofseats:{
        type: Number
    },
    seatnumber:{
        type: [Number],
        required:true,
        unique: true
    },
    showtime:{
        type: String,
        default: '6 PM'
    },
    TotalAmount:{
        type: Number
    },
    owner_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user-data'
    },
    Date:{
        type: Date,
        default: Date.now
    }
})


ticketSchema.methods.toJSON = function(){
    const ticketbooking = this
    const ticketObject = ticketbooking.toObject()

    delete ticketObject.owner_id,
    delete ticketObject._id,
    delete ticketObject.__v
    
    return ticketObject
}

const movieticket = mongoose.model('movieticketdata', ticketSchema)
module.exports = movieticket