const express = require("express")
const router = express.Router()
const bcryptjs = require("bcryptjs")
const Profile = require("../schemas/Profile")
const passport = require("../auth")
const {verifyToken, generateToken} = require("../jwtMiddleware")
const { sendSignUpConfirmation } = require("../helpers/emailer")


router.post("/", async (req,res)=>{
    // console.log("Hello from account creation")
    const {username, email, password, confirmpassword} = req.body
    if(confirmpassword != password) return res.status(500).json({message:"Passwords do not match!"})
    if(password.length < 8) return res.status(500).json({message: "Password must be at least 8 characters!"})
    if(email.split("@").length != 2 || email.split(".").length != 2) return res.status(500).json({message:"Must be a valid email!"})

    try{
        const hashedPassword = await bcryptjs.hash(password, 10)
        console.log(hashedPassword)
        const newProfile = new Profile({
            email: email.toLowerCase(),
            password: hashedPassword,
        })
        const savedProfile = await newProfile.save()
        const token = generateToken(savedProfile)
        // console.log(token)
        res.cookie("token", token, { maxAge: 900000, secure: true, path:"/" })
        await sendSignUpConfirmation(savedProfile)
        return res.status(201).json("Cookies set")
        // return res.status(201).json("Account creation successful and authenication")
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

router.put("/", async (req,res)=>{
    const {email, password} = req.body
    try{
        const User = await Profile.findOne({email: email.toLowerCase()})
        if(!User) return res.status(500).json({message: "Invalid email  "})
        const matchedPassword = await bcryptjs.compare(password, User.password)
        if(!matchedPassword) return res.status(500).json({message: "Invalid password"})
        const token = generateToken(User)
        res.cookie("token", token, { maxAge: 900000, secure: true, path: "/"  })
        return res.status(200).json("Cookies set")
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }    
})

router.get("/auth", [verifyToken],(req,res)=>{
    return res.status(200).json(req.user)
})

router.get('/logout',[verifyToken] ,(req, res) => {
    // Clear JWT token cookie
    console.log("Hello")
    res.clearCookie('token');
    res.sendStatus(200);
});

//google authenication
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    console.log("Call back")
    // return res.redirect("http://localhost:5173/")

    const {emails, displayName, id} = req.user
    console.log(emails[0].value)
    console.log(displayName)
    const email = emails[0].value
    const username = email.split("@")[0]
    const existingProfile = await Profile.findOne({email})
    if(existingProfile){
        const token = generateToken(existingProfile)
        res.cookie("token", token)
        res.status(200).json({message:"Logged in successfully "+token})
    }else{
        try{
            const newProfile = new Profile({
                username,
                email,
                password: "g943gu430gu340i343343-gvb prjbrbjergi-eg349r33",
            })
            const savedProfile = await newProfile.save()
            const token = generateToken(savedProfile)
            res.cookie("token", token)
            res.status(201).json("Account creation successful and authenication")
        }catch(error){
            res.status(500).json({message: error.message})
        }
    }
}
);

router.get("/", (req,res)=>{

})




module.exports = router