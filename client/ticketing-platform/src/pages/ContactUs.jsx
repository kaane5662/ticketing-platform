import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

export default function ContactUs(){
    
    return(
        <main className=" bg-primary min-h-screen text-secondary flex items-center justify-center  font-poppins">
            <ToastContainer></ToastContainer>
            <div className="flex p-8  flex-col py-24 max-w-[60%] max-md:max-w-[100%] gap-8">
                <h3 className="text-5xl max-md:text-4xl font-bold">Contact Us – We're Here to Help!</h3>
                <h1 className="text-lg text-slate-400  max-md:text-md">Got questions? Need support? Our team is here for you! Reach out to us anytime, and we'll get back to you as soon as possible.</h1>
                <div className="flex flex-col gap-2">
                    <p className="items-center flex gap-4"><FontAwesomeIcon icon={faEnvelope} /> swfft.inc@gmail.com</p>
                    <p className="items-center flex gap-4"><FontAwesomeIcon icon={faPhone} /> +1 (347) 972 1536</p>
                </div>
                <p className="text-slate-400">We look forward to assisting you!</p>

            </div>
                
                
          
        </main>
    )
}