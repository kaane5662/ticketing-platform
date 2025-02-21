import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

export default function BoardingApproval(){
    const navigate = useNavigate()
    const boarded = ()=>{

        axios.get(`${import.meta.env.VITE_SERVER}/profiles`,{withCredentials:true}).then((response)=>{
            const profile = response.data
            if(profile?.seller_approved) navigate("/seller/tickets")
            
        }).catch((error)=>{
            console.log(error)
            if( error.response.status == 401 || error.response.status == 403) navigate("/login", {replace:true})
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })

    }

    useEffect(()=>{
        boarded()
    },[])
    
    return(
        <main className=" bg-primary h-screen text-secondary flex items-center justify-center  font-poppins">
            <ToastContainer></ToastContainer>
            <div className="flex p-8 max-md:text-center flex-col max-w-[60%] max-md:max-w-[100%] gap-8">
                <h3 className="text-6xl max-md:text-4xl font-bold">Your application is under review!</h3>
                <h1 className="text-md text-slate-300  max-md:text-md">Thanks for completing the onboarding process. Our team is currently reviewing your details to ensure a smooth experience as a seller on SwftT.</h1>
                
                
            </div>
            {/* <div className="flex w-[30%] h-[70%]">
                <img className=" object-cover rounded-md" src="/verification.png"></img>
            </div> */}
        </main>
    )
}