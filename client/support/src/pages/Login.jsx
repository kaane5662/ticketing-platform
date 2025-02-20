import { useState } from "react"
import {ToastContainer,toast} from "react-toastify"
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';

export default function Login(){
    const [email,setEmail] = useState('')
    const signIn = ()=>{
        console.log(email)
        axios.post(`${import.meta.env.VITE_SERVER}/support/login`,{email},{withCredentials:true}).then((response)=>{
            
            toast.success("An email verification has been sent")
        }).catch((error)=>{
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })

    }
    return(
        <div className=" min-h-screen flex items-center justify-center w-screen font-poppins">
            <ToastContainer></ToastContainer>
            <div className="flex flex-col gap-4 w-[50%] max-md:w-[90%]">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold">Login</h1>
                    <p>Sign into your support dashboard</p>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Email</label>
                    <input placeholder="Enter Email" className="border-2 rounded-xl p-2" onChange={(e)=>setEmail(e.target.value)}></input>
                </div>
                <button onClick={signIn} className="hover:opacity-50 bg-complementary rounded-md p-2">Sign In</button>

            </div>
        </div>
    )
}