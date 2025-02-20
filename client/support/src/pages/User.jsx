import { useState } from "react"
import { useParams } from "react-router-dom"
import {ToastContainer,toast} from "react-toastify"
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";

export default function User(){
    const [User,setUser] = useState(null)
    const {id} = useParams()
    console.log(id)
    const getUser = ()=>{
        
        axios.get(`${import.meta.env.VITE_SERVER}/support/users/${id}`,{withCredentials:true}).then((response)=>{
            setUser(response.data)
            // toast.success("An email verification has been sent")
        }).catch((error)=>{
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })

    }
    
    const approveUser = ()=>{
        
        axios.post(`${import.meta.env.VITE_SERVER}/support/approve`,{id:id},{withCredentials:true}).then((response)=>{
            setUser(response.data)
            toast.success("User approved")
            location.reload()
        }).catch((error)=>{
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })

    }
    

    useEffect(()=>{
        getUser()
    },[])
    
    
    return(
        <div className=" min-h-screen flex font-poppins w-screen">
            <ToastContainer></ToastContainer>
            {User &&
            <div className="flex flex-col p-24 max-md:p-4 gap-8">
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold text-3xl">User</h1>
                    <p className="text-slate-500">{User._id}</p>
                </div>
                
                <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8 w-full">
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md">
                        <label className="text-slate-500">Email</label>
                        <p>{User.email}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md">
                        <label className="text-slate-500">Paypal Email</label>
                        <p>{User.paypal_email}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md">
                        <label className="text-slate-500">Seller Approved</label>
                        <p>{User.seller_approved?"True":"False"}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md overflow-hidden">
                        <label className="text-slate-500">Password Encrypted</label>
                        <p>{User.password}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md">
                        <label className="text-slate-500">Phone Number</label>
                        <p>{User?.phone_number}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md">
                        <label className="text-slate-500">Guests Per Event</label>
                        <p>{User?.guests_per_event}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md overflow-hidden">
                        <label className="text-slate-500">Business Email</label>
                        <p>{User?.business_email}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-2 p-2 rounded-md overflow-hidden">
                        <label className="text-slate-500">Name</label>
                        <p>{User?.name}</p>
                    </div>

                </div>
                
                
                
                
                <button onClick={approveUser} className={`p-2 hover:scale-105 duration-300 bg-complementary w-fit px-8 rounded-md ${!User.seller_approved ? "bg-complementary":"bg-red-700 text-white"} `}>{User.seller_approved ? "Remove":"Approve"}</button>
                
            </div>}
            
        </div>
    )
}