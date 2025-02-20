import { useState} from "react"
import { useNavigate } from "react-router-dom"
import {ToastContainer,toast} from "react-toastify"
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from "react";

export default function Verify(){
    const navigate = useNavigate()
    const validate = ()=>{
        const searchParams = new URLSearchParams(window.location.search)
        const token = searchParams.get("token")
        
        axios.post(`${import.meta.env.VITE_SERVER}/support/verify`,{token},{withCredentials:true}).then((response)=>{
            
            toast.success("Verification success")
            navigate("/")
        }).catch((error)=>{
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })

    }

    useEffect(()=>{
        validate()
    },[])
    return(
        <div className=" min-h-screen flex items-center justify-center w-screen font-poppins">
            <ToastContainer></ToastContainer>
            <div className="flex flex-col gap-4 w-[50%] max-md:w-[90%]">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold">Verifying your Email</h1>
                    <p className="text-slate-400">Loading...</p>
                </div>
                

            </div>
        </div>
    )
}