import { useState, useEffect } from "react";
import SellerTicket from "../components/SellerTicket";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SellerTickets(){
    const navigate = useNavigate()
    const [Tickets, setTickets] = useState([])
    const getTickets = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/tickets`,{withCredentials: true}).then((response)=>{
            console.log(response.data)
            setTickets(response.data || [])
        }).catch((error)=>{
            if( error.response.status == 401 || error.response.status == 403) navigate(error.response.data.url, {replace:true})
            console.log(error)
        })
    }

    useEffect(()=>{
        getTickets()
    },[])

    return(
        <main className="min-h-screen bg-primary justify-center flex text-secondary font-poppins">
            <div className=" flex flex-col gap-8 p-24 w-[80%]  ">
                <h1 className="text-5xl font-bold">Tickets</h1>
                <div className="flex flex-col">
                    {Tickets ?
                        Tickets.length > 0 ?
                        Tickets.map((ticket, index) => (
                            <SellerTicket Ticket={ticket}/>
                        ))
                        :
                        <h3 className="self-center place-content-center flex justify-center">No tickets have been currently made</h3>
                        
                    : <FontAwesomeIcon spin className="h-10 my-20" icon={faSpinner}></FontAwesomeIcon>
                    }
                    
                </div>
            </div>
        </main>
    )
}