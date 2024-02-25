const mongoose = require("mongoose")

const ProfileSchema = new mongoose.Schema({
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
    stripe_identity_verified: {
        type: Boolean,
        default: false
    },
    stripe_boarded:{
        type:Boolean,
        default: false
    },
    recent_stripe_verification_session: {
        type: String,
        default: null
    },
    business:{
        business_name:{
            type:String,
            default: null
        },
        business_email:{
            type:String,
            default: null 
        },
        first_name: {
            type:String,
            default: null
        },
        last_name: {
            type:String,
            default:null
        }
    }
})

const Profile = mongoose.models?.Profile || mongoose.model("Profile", ProfileSchema)
module.exports = Profile