import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SellerSignUp(){
    const [check, setCheck] = useState(false)
    const navigate = useNavigate()

    const signUp = (e)=>{
        e.preventDefault()
        
        setCheck(false)
        axios.post(`${import.meta.env.VITE_SERVER}/seller/connect`, {}, {withCredentials: true} ).then((response)=>{
            console.log(response.data)
            navigate(response.data.url)
        }).catch((error)=>{
            setCheck(true)
            if( error.response.status == 401 || error.response.status == 403) navigate(error.response.data.url, {replace:true})
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })
    }

    return(
        <div className=" h-screen bg-primary p-24 font-poppins text-secondary justify-center flex items-center   ">
            <ToastContainer></ToastContainer>
            <div className = "flex justify-between gap-12 first-letter:items-center">

                <form onSubmit={signUp} className="flex flex-col gap-6">
                    <h1 className="text-5xl font-bold"><span className="text-complementary">Create</span> your Stripe Connect Account</h1>
                    <h3 className="text-lg max-w-[80%]">Unlock the power to monetize your events effortlessly. Sign up for Stripe Connect now to securely manage payments and earn money from your event sales. Get started today and turn your events into revenue generators!</h3>
                    
                    <div className="flex flex-col gap-4">
                        {/* <h3 className="text-lg">Enter your seller name</h3>
                        <input placeholder="Business Name" name="business_name" className="bg-secondary p-4 rounded-sm h-[45px] w-[600px] bg-opacity-0 border-2 border-secondary border-opacity-20"></input> */}
                    </div>
                    
                    <div className="flex gap-8 items-center">
                        <input onChange={()=>{setCheck(!check)}} type="checkbox" className=" h-[20px] w-[20px] focus:bg-complementary checked:bg-complementary checked:border-transparent  "></input>
                        <h3 className="text-md max-w-[80%]">I agree to the <Link to="/legal/termsofservice" className="underline hover:text-complementary">SwftT Terms of Service</Link> and the <a className="underline hover:text-complementary" href="https://stripe.com/legal/connect-account">Stripe Conncected Payments Agreement</a> </h3>
                    </div>
                    <button disabled={!check} type="submit" className={`font-bold bg-complementary rounded-sm h-[55px] w-[250px] text-primary ${!check? "  bg-opacity-40":"hover:scale-105 duration-300"} `}>Create Connect ></button>
                </form>
                <img className="w-[600px] object-cover h-[400px]" src="stripe-board.png"></img>
            </div>
        </div>
    )
}