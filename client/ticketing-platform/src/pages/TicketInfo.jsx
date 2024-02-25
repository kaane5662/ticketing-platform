import { useState, useEffect } from "react";
import SellerTicket from "../components/SellerTicket";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function TicketInfo(){

    const [Ticket, setTicket] = useState()
    const getTickets = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/tickets`).then((response)=>{
            console.log(response.data)
            setTickets(response.data || [])
        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        getTickets()
    },[])

    return(
        <main className="min-h-screen bg-primary justify-center flex text-secondary font-poppins">
            <div className=" flex flex-col gap-8 p-24 w-[80%]  ">
                <h1 className="text-5xl font-bold">Ticket Info</h1>
                
                <div className="flex flex-col">
                    {Tickets.length>0 ?
                    
                        Tickets.map((ticket, index) => (
                            <SellerTicket title = {ticket.title} icon = {ticket.icon} start_time= {ticket.event.start_time} end_time = {ticket.event.end_time} day = {ticket.event.day} price = {ticket.price} event_type = {ticket.event_type} address = {ticket.address} key = {index}/>
                        ))
                        
                    : <FontAwesomeIcon spin className="h-10 my-20" icon={faSpinner}></FontAwesomeIcon>
                    }
                    
                </div>
            </div>
        </main>
    )
}