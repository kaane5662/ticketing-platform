import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function SellerSignUp(){
    const [check, setCheck] = useState(false)
    const navigate = useNavigate()

    const signUp = (e)=>{
        e.preventDefault()
        const data ={
            business_email : e.target.business_email.value,
            business_name : e.target.business_name.value,
        }
        axios.post(`${import.meta.env.VITE_SERVER}/seller/connect`, data, {withCredentials: true} ).then((response)=>{
            console.log(response.data)
            navigate(response.data.url)
        }).catch((error)=>{
            console.log(error)
        })
    }

    return(
        <div className=" h-screen bg-primary p-24 font-poppins text-secondary   ">
            
            <form onSubmit={signUp} className="flex flex-col gap-6">
                <h1 className="text-5xl font-bold"><span className="text-complementary">Create</span> your Stripe Connect Account</h1>
                <h3 className="text-lg max-w-[80%]">Unlock the power to monetize your events effortlessly. Sign up for Stripe Connect now to securely manage payments and earn money from your event sales. Get started today and turn your events into revenue generators!</h3>
                
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg">Enter your business name</h3>
                    <input placeholder="Business Name" name="business_name" className="bg-secondary p-4 rounded-sm h-[45px] w-[600px] text-primary "></input>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg">Enter your business email</h3>
                    <input placeholder="Business Email" name="business_email" className="bg-secondary p-4 rounded-sm h-[45px] w-[600px] text-primary "></input>
                </div>
                
                <div className="flex gap-8 items-center">
                    <input onChange={()=>{setCheck(!check)}} type="checkbox" className=" h-[20px] w-[20px] focus:bg-complementary checked:bg-complementary checked:border-transparent  "></input>
                    <h3 className="text-md">I agree to the Terms of Service and the Stripe Conncected Payments</h3>
                </div>
                <button disabled={!check} type="submit" className={`font-bold bg-complementary rounded-sm h-[55px] w-[250px] text-primary ${!check? "  bg-opacity-40":"hover:scale-105 duration-300"} `}>Create Connect ></button>
            </form>
        </div>
    )
}