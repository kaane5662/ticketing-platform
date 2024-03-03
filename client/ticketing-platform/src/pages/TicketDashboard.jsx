import { useEffect, useRef, useState } from "react";
import axios from "axios"
import TicketDisplay from "../components/TicketDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faListDots } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TicketDashboard(){
    
    const [Tickets, setTickets] = useState()
    const getTickets = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/tickets`).then((response)=>{
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
        <main className="min-h-screen bg-primary  text-secondary font-poppins">
            <div className="p-32 max-lg:p-2 max-lg:py-20 flex flex-col gap-8">
                <h1 className="text-5xl max-lg:text-4xl font-bold">Explore Tickets</h1>

                {Tickets?
                <div className=" gap-12 grid grid-cols-4 max-lg:grid-cols-2 max-lg:gap-2 flex-wrap">
                    {Tickets.map((ticket, index)=>{
                        return (
                            <TicketDisplay Ticket={ticket}/>
                        )
                    })}
                </div>:
                <div className="flex flex-col justify-center items-center gap-8">
                    <FontAwesomeIcon className="h-16 mt-20" bounce icon={faEllipsis}></FontAwesomeIcon>
                    <h3 className="text-xl">Loading Tickets</h3>
                </div>

                }
            </div>
        </main>
    )
}