import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

export default function ConnectPaypal(){
    const navigate = useNavigate()
    const [fields,setFields] = useState({})
    const board = ()=>{

        axios.post(`${import.meta.env.VITE_SERVER}/seller/boarding`,fields,{withCredentials:true}).then((response)=>{
            navigate("/seller/tickets")
        }).catch((error)=>{
            if( error.response.status == 401 || error.response.status == 403) navigate("/login", {replace:true})
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })

    }

    const onFieldChange = (e)=>{
        console.log(e.target)
        console.log(fields)
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }
    return(
        <main className=" bg-primary min-h-screen text-secondary flex items-center justify-center  font-poppins">
            <ToastContainer></ToastContainer>
            <div className="flex p-8 max-md:text-center flex-col py-24 max-w-[60%] max-md:max-w-[100%] gap-8">
                <h3 className="text-6xl max-md:text-4xl font-bold">Boarding</h3>
                <h1 className="text-lg text-slate-400  max-md:text-md">Streamline your payment process with Paypal. Get set up in minutes to securely manage transactions and receive payouts effortlessly. Click below to begin your boarding journey and unlock a world of payment possibilities.</h1>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col col-span-2 gap-2 w-full">
                        <label className="text-slate-400">Full Name</label>
                        <input name="name" onChange={onFieldChange} placeholder="Enter your name" className="p-2 text-white rounded-md w-full bg-opacity-10 bg-white"></input>
                    </div>
                    <div className="flex flex-col col-span-2 gap-2 w-full">
                        <label className="text-slate-400">Business Email</label>
                        <input name="businessEmail" onChange={onFieldChange} placeholder="Enter your business email" className="p-2 text-white rounded-md w-full bg-opacity-10 bg-white"></input>
                    </div>
                    
                    <div className="flex flex-col col-span-1 gap-2 w-full">
                        <label className="text-slate-400">Phone Number</label>
                        <input name="phoneNumber" onChange={onFieldChange} placeholder="Enter your phone number" className="p-2 text-white rounded-md w-full bg-opacity-10 bg-white"></input>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-slate-400">Estimated Guests Per Event</label>
                        <select defaultValue={10} name="guestsPerEvent" onChange={onFieldChange} className="rounded-md bg-white bg-opacity-10 p-2">
                            <option className="text-black" value={"10"}>10</option>
                            <option className="text-black" value={"50"}>50</option>
                            <option className="text-black" value={"100"}>100</option>
                            <option className="text-black" value={"200"}>200</option>
                            <option className="text-black" value={"500"}>500</option>
                            <option className="text-black" value={"500+"}>500+</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full col-span-2">
                        <label className="text-slate-400">Email Associated With Your Paypal Account</label>
                        <input name="paypalEmail" onChange={onFieldChange} placeholder="Enter Paypal Email" className="p-2 text-white rounded-md w-full bg-opacity-10 bg-white"></input>
                    </div>

                </div>
                <button onClick={board} className="font-bold hover:scale-105 duration-300  p-4 px-8 rounded-md w-fit text-primary bg-complementary text-md max-md:self-center">Send</button>
                
            </div>
            {/* <div className="flex w-[30%] h-[70%]">
                <img className=" object-cover rounded-md" src="/verification.png"></img>
            </div> */}
        </main>
    )
}