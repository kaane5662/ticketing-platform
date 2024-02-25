import { faCartShopping, faColonSign, faColumns, faDoorClosed, faGripVertical, faMoneyBill, faRightFromBracket, faSquarePlus, faTicketSimple, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";


export default function SellerSidebar(){

    const [Profile, setProfile] = useState()
    const getAuthData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/profiles/auth`,{withCredentials:true}).then((response)=>{
            console.log(response.data)
            setProfile(response.data)
           
        }).catch((error)=>{
            console.log(error)
        })
    }

    const updateStripeAccount = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/update`,{withCredentials:true}).then((response)=>{
            window.location.href = response.data.url
           
        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        getAuthData()
    },[])

    const navigate = useNavigate()
    return(
        <nav className=" w-[20%]   fixed bg-secondary font-poppins ">
            <div className="cointainer p-8 flex top-0 left-0 rounded-r-2xl border-r-2 border-r-secondary  border-opacity-10 text-secondary  h-screen  flex-col gap-8 justify-between flex-col absolute ">
                <div className="flex flex-col gap-8">
                    <h3 className="font-bold">{Profile?.email.split("@")[0]}</h3>
                    <div onClick={()=>navigate("/seller/dashboard")} className="flex gap-3 items-center relative hover:scale-105 duration-300 ">
                        <FontAwesomeIcon className=" w-5" icon={faGripVertical}></FontAwesomeIcon>
                        <h3 className=" text-md">Dashboard</h3>
                    </div>
                    <div onClick={()=>navigate("/seller/transactions")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                        <FontAwesomeIcon className="w-5" icon={faCartShopping}></FontAwesomeIcon>
                        <h3 className=" text-md">Transactions</h3>
                    </div>
                    <div onClick={()=>navigate("/seller/tickets")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                        <FontAwesomeIcon className="w-5" icon={faTicketSimple}></FontAwesomeIcon>
                        <h3 className=" text-md">Tickets</h3>
                    </div>
                    <div onClick={()=>navigate("/seller/checkout")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                        <FontAwesomeIcon className="w-5" icon={faMoneyBill}></FontAwesomeIcon>
                        <h3 className=" text-md">Checkout</h3>
                    </div>
                    

                    <div onClick={()=>navigate("/seller/create")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                        <FontAwesomeIcon className="w-5" icon={faSquarePlus}></FontAwesomeIcon>
                        <h3 className=" text-md">Create Event</h3>
                    </div>
                </div>
                <div className="flex gap-8 flex-col">
                    
                    
                    <div onClick={updateStripeAccount} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                        <FontAwesomeIcon className="w-5" icon={faColumns}></FontAwesomeIcon>
                        <h3 className=" text-md">Update Account</h3>
                    </div>
                    
                    
                    <div onClick={()=>navigate("/tickets")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                        <FontAwesomeIcon className="w-5" icon={faRightFromBracket}></FontAwesomeIcon>
                        <h3 className=" text-md">Exit Creator</h3>
                    </div>
                </div>
            </div>
            
            
        </nav>
    )
}