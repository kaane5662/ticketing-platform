const Profile = require("./schemas/Profile");
require("dotenv").config()

const verifySeller = async(req,res,next)=>{
    const User = await Profile.findById(req.user._id)
    // res.header('Access-Control-Allow-Origin', '*'); // Adjust as needed
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // console.log(User)
    if(!User.stripe_identity_verified){ return res.status(403).json({url:`/verify`})  }
    
    // if(User.recent_stripe_verification_session != null) return res.redirect(`${process.env.CLIENT_DOMAIN}/seller/verify`)
    
    if(User.stripe_connected_id == null) return res.status(403).json({url:`/join`})

    if(!User.stripe_boarded) return res.status(403).json({url:`/boarding`})
    
    // return res.status(200).json({url:"/seller/dashboard"}) 
    next()
}

module.exports = {verifySeller};