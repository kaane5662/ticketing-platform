const express = require("express")
const router = express.Router()
const {verifyToken} = require("../jwtMiddleware")
const Profile = require("../schemas/Profile")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)
const EventTypes = require("../fields/EventTypes")
const Tickets = require("../schemas/Ticket")

//creates a stripe verification session
router.post("/verify",verifyToken,async (req,res)=>{
    const {first_name, last_name, business_email, business_name} = req.body
    const userProfile = await Profile.findById(req.user._id)
    if(userProfile?.stripe_connected_id != null) return res.status(500).json({message:"Already a connected account"})
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
                last_name,
                _id: req.user._id
            }
        });
        
        return res.status(201).json({url: verificationSession.url})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

//creates a connect account
router.post("/connect",verifyToken,async(req,res)=>{
    const {first_name, last_name, business_email, business_name, business_desc} = req.body
    const User = await Profile.findById(req.user._id)
    if(!User.stripe_identity_verified) return res.status(403).json({message: "User has not verified id"})
    try{
        // return stripe.accounts.del("acct_1OlzyxIzbrfbn6lt")  
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
                name: business_name,
                description: business_desc
            }
        })
        console.log(connectedAccount.id)
        await Profile.findByIdAndUpdate(req.user._id, {stripe_connected_id: connectedAccount.id})
        return res.status(201).json({url:"/seller/boarding"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})



//creates a stripe connected account boarding session
router.get("/boarding", verifyToken,async(req,res)=>{
    const User = await Profile.findById(req.user._id)
    if(User.stripe_connected_id == null){
        return res.status(500).json({url: "/checkseller"})
    }
    stripe_connected_id = User.stripe_connected_id || "acct_1OkYStRJr6vSAqtv"
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
router.get("/check", verifyToken,async (req,res)=>{
    const User = await Profile.findById(req.user._id)

    if(!User.stripe_identity_verified) return res.status(200).json({url:"/seller/verify"})
    
    if(User.recent_stripe_verification_session != null) return res.status(200).json({url: "/seller/processing/"})
    
    if(User.stripe_connected_id == null) return res.status(200).json({url:"/seller/join"})
        
    if(!User.stripe_boarded) return res.status(200).json({url: "/seller/boarding"})
    
    return res.status(200).json({url:"/seller/dashboard"}) 
})

//should be protected
router.get("/create", verifyToken, async(req,res)=>{
    const User = await Profile.findById(req.user.id)
    if(User.stripe_connected_id == null || User.stripe_boared == false){
        return res.status(500).json({url:"/checkseller"})
    }
    return res.status(200).json({EventTypes})
})

//updates the onboaring info of the seller
router.get("/update", verifyToken, async(req,res)=>{
    try{
        const User = await Profile.findById(req.user.id)
        if(User.stripe_connected_id == null){
            return res.status(404).json({url:"/checkseller"})
        }
        const accountLink = await stripe.accountLinks.create({
            account: stripe_connected_id,
            refresh_url: `${process.env.CLIENT_DOMAIN}/seller/dashboard`,
            return_url: `${process.env.CLIENT_DOMAIN}/seller/dashboard`,
            type: 'account_update',
            
        });
        return res.status(201).json({url:accountLink.url})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:error.message})
    }
    
})


router.post("/checkout", verifyToken, async(req,res)=>{
    let {amount} = req.body;
    amount = Math.floor(amount *100);
    try{
        const User = await Profile.findById(req.user._id)
        if(User.stripe_connected_id == null || User.stripe_boarded == false){
            return res.status(403).json({message: "You are not eligible for a checkout. Make sure you have a connected stripe account and completed the boarding process."})
        }
        const balance = stripe.balance.retrieve({stripeAccont: User.stripe_connected_id})
        if(balance > amount) return res.status(406).json({message: "Insufficient funds"})
        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: "usd",
            destination: User.stripe_connected_id
        })
        res.status(201).json({message: "Transfer has successfully been initiated!"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
    
})

//returns the sellers tickets uploaded
router.get("/tickets", verifyToken, async(req,res)=>{
    try{
        const createdTickets = await Tickets.findOne({seller_id: req.user._id})
        return res.status(200).json(createdTickets)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})


module.exports = router