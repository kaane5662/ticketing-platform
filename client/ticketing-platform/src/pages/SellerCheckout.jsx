import { faDollarSign, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"

export default function SellerCheckout(){

    const [Balance, setBalance] = useState()
    const [amount, setAmount] = useState(0)
    const navigate = useNavigate()
    const checkout = ()=>{
        axios.post(`${import.meta.env.VITE_SERVER}/seller/checkout`, {amount},{withCredentials:true}).then((response)=>{
            console.log(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const getBalance = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/checkout`,{withCredentials:true}).then((response)=>{
            console.log(response.data.balance)
            setBalance(response.data)
            // setBalance(response.data?.balance.available[0].amount)
        }).catch((error)=>{
            if( error.response.status == 401 || error.response.status == 403) navigate("/login", {replace:true})
            console.log(error)
        })
    }

    const getTicketData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/ticket/56986985895`,{withCredentials:true}).then((response)=>{
            console.log(response.data)
            
            // setBalance(response.data?.balance.available[0].amount)
        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        getBalance()
        // getTicketData
    },[])

    return(
        <main className="bg-primary h-screen font-poppins flex text-secondary justify-center  items-center   ">
            {Balance ? 
            <div className="flex flex-col gap-8 justify-center text-center">
                <h1 className="text-lg font-bold ">Pending</h1>
                <h1 className="text-2xl">${Balance.pending[0].amount/100}</h1>
                <h1 className="text-5xl font-bold ">Current Balance</h1>
                <h1 className="text-7xl">${Balance.available[0].amount/100}</h1>
                <h3 className="text-xl -mt-4" >Enter your desired cash amount to checkout</h3>
                <div className="flex items-center justify-center ">
                    {/* <FontAwesomeIcon className=" w-[50px] bg-complementary text-primary" icon={faDollarSign}></FontAwesomeIcon> */}
                    <input placeholder="Enter amount" onChange={(e)=>setAmount(e.target.value)} type="number" step={.01} className="w-[400px] h-[50px] text-center text-2xl  bg-secondary bg-opacity-0 border-opacity-20 border-secondary border-2  rounded-sm"></input>
                </div>
                <button onClick={checkout} className=" font-bold w-[100%] p-6 bg-complementary text-primary text-lg self-center rounded-sm hover:scale-105 duration-300">Check Out </button>
            </div>
            : <FontAwesomeIcon spin className="h-10" icon={faSpinner}></FontAwesomeIcon>
            }
        </main>
    )
}