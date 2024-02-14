const mongoose = require("mongoose")

const ProfileSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    stripe_connected_id: {
        type: String,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    },
    stripe_boarded:{
        type:Boolean,
        default: false
    }
})

const Profile = mongoose.models?.Profile || mongoose.model("Profile", ProfileSchema)
module.exports = Profile