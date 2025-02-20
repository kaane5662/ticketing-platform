const express = require("express")
const axios = require("axios")
const router = express.Router()
const {verifySupportToken, generateAuthToken,verifyResetToken} = require("../jwtMiddleware")
const {verifySeller} = require("../sellerMiddleware")
const Profile = require("../schemas/Profile")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)
const EventTypes = require("../fields/EventTypes")
const Tickets = require("../schemas/Ticket")
const Transactions = require("../schemas/Transactions")
const Support = require("../schemas/Support")
const mongoose = require("mongoose")
const { PAYPAL_API,getAccessToken } = require("../config/paypal")
const { sendSupportUserConfirmation, sendStripeBoarded, sendPaypalBoarded } = require("../helpers/emailer")

router.post("/users",verifySupportToken,async(req,res)=>{
    const {email} = req.body
    try{
        const profiles = await Profile.find(
            {"email":
            { $regex: new RegExp("^" + email.toLowerCase(), "i") }
        }).limit(12)
        return res.status(200).json(profiles)

    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
})
router.get("/users/:id",verifySupportToken,async(req,res)=>{
    try{
        const {id} = req.params
        console.log(id)
        const user = await Profile.findById(id)
        if(!user) return res.status(400).json({message:"Invalid support account"})
        
        return res.status(200).json(user)
    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
})

router.post("/approve",verifySupportToken,async(req,res)=>{
    try{
        const {id} = req.body
        const profile = await Profile.findById(id)
        profile.seller_approved = !profile.seller_approved
        await profile.save()
        if(profile.seller_approved) 
            await sendPaypalBoarded(profile)
        return res.status(200).json({message:"Seller approved"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
})
router.post("/login",async(req,res)=>{
    try{
        const {email} = req.body
        const valid = await Support.findOne({email:email})
        if(!valid) return res.status(401).json({message:"Email account not provisioned to use support"})
        const token = generateAuthToken(valid)
        await sendSupportUserConfirmation(valid,token)
        return res.status(200).json({message:"Account confirmation sent"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
})
router.post("/verify",verifyResetToken,async(req,res)=>{
    try{
        const {token} = req.body
        console.log(req.user)
        const valid = await Support.findById(req.user._id)
        if(!valid) return res.status(400).json({message:"Invalid support account"})
        res.cookie("token", token, { maxAge: 9000000000 ,secure: process.env.NODE_ENV === "production", httpOnly:true, path:"/", sameSite: 'Lax' })
        return res.status(200).json({message:"Successfully logged"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
})

router.post("/verify",verifyResetToken,async(req,res)=>{
    try{
        const {token} = req.body
        console.log(req.user)
        const valid = await Support.findById(req.user._id)
        if(!valid) return res.status(400).json({message:"Invalid support account"})
        res.cookie("token", token, { maxAge: 9000000 ,secure: process.env.NODE_ENV === "production", httpOnly:true, path:"/", sameSite: 'Lax' })
        return res.status(200).json({message:"Successfully logged"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
})

module.exports = router