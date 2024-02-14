const express = require("express")
const router = express.Router()
const {verifyToken} = require("../jwtMiddleware")
const Profile = require("../schemas/Profile")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)

router.post("/", verifyToken,async (req,res)=>{
    const {first_name, last_name, email, line1, line2, city, state, postal_code, business_name} = req.body
    const userProfile = await Profile.findById(req.user._id)
    if(userProfile?.stripe_connected_id != null) return res.status(500).json({message:"Already a connected account"})
    try{    
        const account = await stripe.accounts.create({
            type: "express",
            business_type: "individual",
            individual:{
                email,
                first_name,
                last_name,
                address:{
                    city,
                    line1,
                    line2,
                    postal_code,
                    state
                },
            },
            country: "US",
            email,
            business_profile: {
                name: business_name,
                support_email: email,
                product_description: ""
            },
            capabilities: {
                card_payments: {
                  requested: true,
                },
                transfers: {
                  requested: true,
                },
            },
            settings: {
                branding: {
                  icon: req.files["icon"], // Replace with the URL of your logo
                  logo: req.files["banner"], // Replace with the URL of your logo
                  primary_color: "#4ecdc4", // Replace with your desired brand color
                },
            }

            
            // tos_acceptance: {
            //     date: 1609798905,
            //     ip: ipAddress
            // }
        })

        await User.findByIdAndUpdate(req.user._id, {stripe_account_id: account.id})
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'https://example.com/reauth',
            return_url: 'https://example.com/return',
            type: 'account_onboarding',
        });
        return NextResponse.json({url: accountLink.url}, {status:201})
    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

router.get("/", verifyToken ,async (req,res)=>{
    const userProfile = await Profile.findById(req.user._id)
    if(userProfile.stripe_account_id != null && userProfile.stripe_boarded == false){
        return res.status(500).json({message: "Account already created, just needs to go through onboarding process"})
    }
    return res.status(200)
})


module.exports = router