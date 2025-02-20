import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {ToastContainer,toast} from "react-toastify"
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";

export default function Users(){
    const [Users,setUsers] = useState(null)
    const [email,setEmail] = useState('')
    const [paypalEmail,setPaypal] = useState('')
    const navigate = useNavigate()
    

    const getUsers = ()=>{
        
        axios.post(`${import.meta.env.VITE_SERVER}/support/users`,{email},{withCredentials:true}).then((response)=>{
            console.log(response.data)
            setUsers(response.data)
            
        }).catch((error)=>{
            console.log(error)
            if(error.status == 401 || error.status == 403) navigate("/login")
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })

    }
    

    useEffect(()=>{
        getUsers()
    },[email])
    
    
    return(
        <div className=" min-h-screen w-screen font-poppins">
            <ToastContainer></ToastContainer>
            <div className="flex flex-col gap-4 w-full p-32 max-md:p-4">

                <h1 className="font-bold text-3xl">Users</h1>
                <div className="w-full">
                    <div className="flex flex-col gap-2">
                        <label>Email</label>
                        <input onChange={(e)=>setEmail(e.target.value)} className="rounded-md p-2 w-full border-2"></input>
                        
                    </div>

                </div>
                {Users && Users.length > 0 &&
                
                <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8">

                    {Users.map((user)=>{
                        return(
                            <div onClick={()=>navigate(`/users/${user._id}`)} className="p-2 flex flex-col gap-2 border-2 rounded-md w-full hover:cursor-pointer hover:scale-105 duration-300">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-500">Email</label>
                                    <p>{user.email}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-500">Seller Approved</label>
                                    <p>{user.seller_approved? "True":"False"}</p>
                                </div>
                            </div>
                        )
                    })}
                    
                </div>
                    
                
                
                
                
                
                }
            </div>
            
        </div>
    )
}