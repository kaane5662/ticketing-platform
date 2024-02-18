const express = require("express")
const router = express.Router()
const {verifyToken} = require("../jwtMiddleware")
const Profile = require("../schemas/Profile")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)

//should be protected also
router.post("/verify",async (req,res)=>{
    const {first_name, last_name, business_email, business_name} = req.body
    // const userProfile = await Profile.findById(req.user._id)
    // if(userProfile?.stripe_connected_id != null) return res.status(500).json({message:"Already a connected account"})
    try{    
        
        const verificationSession = await stripe.identity.verificationSessions.create({
            type: 'document',
            options: {
                document:{
                    require_id_number: true,
                    require_matching_selfie: true,
                    require_live_capture: true,
                    
                }
            },
            metadata:{
                business_name,
                business_email,
                first_name,
                last_name
            }
        });
        
        return res.status(201).json({url: verificationSession.url})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})
//shold be protected
router.post("/connect",async(req,res)=>{
    // const {first_name, last_name, business_email, business_namem business_desc} = req.body
    // const User = Profile.findById(req.user._id)
    // if(!User.stripe_identity_verified) return res.status(403).json({message: "User has not verified id"})
    try{
        // return stripe.accounts.del("acct_1OkXBRISQDxMkRN8")  
        const connectedAccount = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: "test2@gmail.com",
            capabilities: {
                card_payments: {
                  requested: true,
                },
                transfers: {
                  requested: true,
                },
            },  
            business_profile:{
                name: "Taikwando",
                description: "test"
            }
        })
        console.log(connectedAccount.id)
        return res.status(201).json({url:"/seller/boarding"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})

//protected route
router.get("/boarding", async(req,res)=>{
    // const User = await Profile.findById(req.user._id)
    // if(User.stripe_connected_id == null){
    //     return res.status(500).json({url: "/checkseller"})
    // }
    stripe_connected_id = "acct_1OkYStRJr6vSAqtv"
    try{
        const accountLink = await stripe.accountLinks.create({
            account: stripe_connected_id,
            refresh_url: `${process.env.CLIENT_DOMAIN}/seller/boarding`,
            return_url: `${process.env.CLIENT_DOMAIN}/checkseller`,
            type: 'account_onboarding',
        });
        return res.status(201).json({url:accountLink.url})
    }catch(error){
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})
//protected route       
router.get("/check", async (req,res)=>{
    // const User = await Profile.findById(req.user._id)
    //if(!User.stripe_identity_verified){
        //return res.status(200).json({url:"/seller/verify"})
        //}
    //if(User.stripe_account_id == {})
        // return res.status(200).json({url:"/seller/join"})
        
    //}
    //if(!User.stripe_boarded){
        // return res.status(200).json({url: "/seller/boarding"})
    //}
    // return res.status(200).json({url:"/seller"})
})


module.exports = router