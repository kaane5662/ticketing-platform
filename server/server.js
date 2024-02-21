
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Transactions = require("./schemas/Transactions")
const nodemailer = require("nodemailer")
const qr = require("qrcode")
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)



//authenication stuff
const passport = require("./auth")
app.use(passport.initialize());


//session stuff
const session = require("express-session")
const Profile = require("./schemas/Profile")
app.use(session({
    secret: 'your-secret-key', // Replace with a strong, randomly generated string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if your application is served over HTTPS
}));
app.use(passport.session());




const minTicketNumber = 10000
const maxTicketNumber = 10000000








console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(()=> console.log("DB connected!"))
    .catch((error)=>{
        console.log(error.message)
})



const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.AUTH_PASSWORD,
    },
});

const corsOptions = {
    origin: process.env.DOMAIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable cookies and authentication headers
};

app.use(cors(corsOptions));


app.post("/webhook",express.raw({ type: 'application/json' }) ,async (req, res)=>{
    const sig = req.headers['stripe-signature'];
    // const rawBody = JSON.stringify(req.body)
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(err.message)
        return res.
        status(500).send(`Webhook Error: ${err.message}`);
    }
  
    //purchase successful
    if(event.type == "checkout.session.completed"){
        dataObject = event.data.object;
        customer_details = dataObject.customer_details
        //fields for customer_details
        // customer_details: {
        //     "address": {
        //       "city": null,
        //       "country": "US",
        //       "line1": null,
        //       "line2": null,
        //       "postal_code": "43985",
        //       "state": null
        //     },
        //     "email": "kaane0169@gmail.com",
        //     "name": "John Adams",
        //     "phone": null,
        //     "tax_exempt": "none",
        //     "tax_ids": []
        // }

        // generate a random integer ticket number within the range of minTicketNumber and maxTicketNumber
        generateRandomTicketNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        qr.toDataURL(generateRandomTicketNumber, (err, url) => {
                
        });
        //go to Ticket.js first to create your Ticket Schema
        
        // create a new ticket document that contains the customer "email", "name", "ticket_number", and "expiration_date"
        //set the "expiration_date" of the ticket to 1 month after today

        
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: customer_details.email,
            subject: "Thank You For Your Purchase",
            html: `
            <div style="height: fit-content; width: fit-content; padding text-align: center; padding: 25px;">
                <h1 style="font-size: x-large;">Your Purchase</h1>
                <h1 style=" font-size: xx-large;">Ticket</h1>
                <h3 style="font-size: large; text-decoration: wavy; font-weight: normal;">$${dataObject.amount_total/100}</h3>
                <h3 style="font-size: x-large;">T- ${savedTicket.ticket_number}</h3>
            </div>
            
            `
        })
        
    }

    //verification completed
    if(event.type == "identity.verification_session.verified"){
        dataObject = event.data.object;
        console.log(dataObject)
        const {metadata} = dataObject;
        await Profile.findByIdAndUpdate(metadata._id, {stripe_identity_verified: true})
        console.log(dataObject)
        res.redirect(`${process.env.CLIENT_DOMAIN}/checkseller`)
        console.log("Verification has been completed")

    }
    //connect capabilities updated
    if (event.type == 'account.updated') {
        const account = event.data.object;
        // const {metadata} = account;
        console.log('Account Updated:', account.id);
        console.log('Capabilities:', account.capabilities);
        if(acccount.capabilities && account.capabilities["card_payments"] && account.capabilities["transfers"]){
            await Profile.findOneAndUpdate({stripe_connected_id: account.id}, {stripe_boarded: true});
            return res.redirect(`${process.env.CLIENT_DOMAIN}/checkseller`)
        }
        console.log(account.capabilities)
        
        // Here you can perform actions based on the updated capabilities
      }

    if(event.type == 'identity.verification_session.processing'){
        return res.redirect(`${process.env.CLIENT_DOMAIN}/checkseller`);
    }
    // Handle transfer.paid event(mainly for sellers cashing out)
    if (event.type === 'transfer.paid') {
        const transfer = event.data.object;
        console.log('Transfer completed:', transfer);
        // Handle transfer completion logic here
    }

    res.send();
})



app.use(express.json())

//routes
app.use("/profiles", require("./routes/profiles"))
app.use("/tickets", require("./routes/tickets"))
app.use("/seller", require("./routes/seller"))

app.post("/purchase", async (req, res)=>{
    const {quantity} = req.body
    const session = await stripe.checkout.sessions.create({
        success_url: process.env.SUCCESS_URL,
        line_items: [
            {price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Test Ticket',
                  description: 'Testing ',
                },
                unit_amount: 24.99*100, // Amount in cents (e.g., $10.00)
              }
              , quantity: quantity},
        ],
        mode: 'payment'
    });
    return res.status(200).json({url: session.url})

})



app.put("/verify-purchase", async(req,res)=>{
    // get ticketNumber from the request body (its named exactly that)
    const {ticketNumber} = req.body
    // check if a ticket exists with the matching ticketNumber
    const ticketExists = await Transactions.findOne({ticket_number: ticketNumber})
    // if a ticket does not exist or is null return a json message of "Ticket does not exist" with status code 500
    if(ticketExists == null) return res.status(500).json("Ticket does not exist.")
    // if a ticket has and expiration_date before today return a json message of "Ticket has been used or is expired" with a status code of 500
    if(ticketExists.expiration_date <= Date.now()) return res.status(500).json("Ticket has been used or is expired.")
    // set the ticket expiration date to now if the ticket exists and didn't expire
    
    // save the ticket
    
    // return a json response of "Ticket does exist and has now been used." with a status code 200
    ticketExists.expiration_date = Date.now()
    await ticketExists.save()
    res.status(200).json("Ticket does exist and has now been used.")
})

app.listen(3000, ()=>{console.log("Listening on port 3000!")})
