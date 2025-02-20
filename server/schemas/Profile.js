const mongoose = require("mongoose")

const ProfileSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    stripe_connected_id: {
        type: String,
        default: null
    },
    // paypal_merchant_id: {
    //     type:String,
    //     default: null
    // },
    // stripe_identity_verified: {
    //     type: Boolean,
    //     default: false
    // },
    stripe_boarded:{
        type:Boolean,
        default: false
    },
    recent_stripe_verification_session: {
        type: String,
        default: null
    },
    paypal_email: {
        type:String,
        default:null
    },
    phone_number:{
        type:String,
        default:null
    },
    business_email:{
        type:String,
        default:null
    },
    guests_per_event:{
        type:String,
        default: null
    },
    name:{
        type:String,
        default:null
    },
    seller_approved: {
        type:Boolean,
        default:false
    },
    
    
})

const Profile = mongoose.models?.Profile || mongoose.model("Profile", ProfileSchema)
module.exports = Profile