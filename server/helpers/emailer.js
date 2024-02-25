const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.AUTH_PASSWORD,
    },
});


const sendStripeVerifcationProcessing = async (User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Identity Verification Processing",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Processing</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>
                    Your id verification has been successfully submitted and is now processing:
                </p>
                <p>Best Regards,<br>SwiftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}
const sendStripeVerificationVerified = async(User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Identity Verified",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Processing</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>
                    Your ID verification was successful:
                </p>
                <p>
                    You may now create a stripe onboarding account to set up payments <a href="${process.env.CLIENT_DOMAIN}/seller/join">Here</a>.
                </p>
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}
const sendStripeVerificationDenied = async(User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Identity Verification Unsuccessful",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Unsuccessful</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>
                    Your ID verification was unsuccessful:
                </p>
                <p>
                    If you believe this is a mistake, please try again <a href="${process.env.CLIENT_DOMAIN}/seller/verify">Here</a>.
                </p>
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}

const sendStripeBoarded = async(User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Stripe Account Successfully Boarded",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Unsuccessful</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Account Boarded</h2>
                <p>Dear User,</p>
                <p>
                    Your account has successfully been boared.
                </p>
                <p>
                    You are now eligible to create and sell tickets and transfer your profits to your bank account.
                </p>
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}

const sendTicketConfirmation = async(email, qrCodes, ticket_title, quantity, total)=>{
    // console.log(qrCodes)
    // let qrCodeImagesHTML = '';
    // qrCodes.forEach(qrCodeDataURL => {
    //     qrCodeImagesHTML += `<img style="width:500px; height:500px" src="${qrCodeDataURL}" alt="QR Code"></img><br>`;
    // });
    // console.log(qrCodeImagesHTML)
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: email,
        subject: `Ticket Confirmation Email ${ticket_title}`,
        attachments: qrCodes.map((qrCode, index)=>{
            return(
                {
                    filename: `qrCode${index}.png`,
                    encoding: "base64",
                    content: qrCode
                }

            )
        }),
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation Email</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>x${quantity}${ticket_title}: $${total/100}</h2>
                <p>Dear User,</p>
                <p>
                    Your purchase has been successful.
                </p>
                <p>
                    You are now eligible to checkin to the event with the provided QR Code/s
                    
                </p>
                
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}



module.exports = {sendStripeVerifcationProcessing, sendStripeVerificationVerified, sendStripeVerificationDenied, sendStripeBoarded, sendTicketConfirmation}