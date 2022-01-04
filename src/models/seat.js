const mongoose = require('mongoose')

const seatSchema = mongoose.Schema({
    moviename:{
       type: String
    },
    seatNumber:{
        type: [mongoose.Schema.Types.Mixed],
        required: true,
        unique: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user-data'
    },
    Date:{
        type: Date,
        default: Date.now
    }

})

const seatbooking = mongoose.model('userseatbooking', seatSchema)

module.exports = seatbooking