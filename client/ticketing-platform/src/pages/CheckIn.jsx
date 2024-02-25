import axios from "axios"
import TicketConfirmation from "../components/TicketConfirmation"
import { useScroll } from "framer-motion"
import { useState } from "react"

export default function CheckIn(){

    const [popUpActive, setPopUpActice] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState("")

    const verifyTicket = (e)=>{
        e.preventDefault()
        console.log(e.target.ticketNumber.value)
        const ticketNumber = e.target.ticketNumber.value
        axios.put("http://localhost:3000/verify-purchase", {ticketNumber}).then((response)=>{
            console.log(response.data)
            setPopUpActice(true)
            setSuccess(true)
            setMessage("")
        }).catch((error)=>{
            setSuccess(false)
            setPopUpActice(true)
            setMessage(error.response?.data)
            console.log(error.response?.data)
        })
    }

    return(
        <>
        
        <div className=" h-screen bg-primary flex items-center justify-center ">
            {popUpActive ? <TicketConfirmation message={message} setActive={setPopUpActice} success={success}></TicketConfirmation>: null}
            <form onSubmit={(e)=> verifyTicket(e)} className="p-24 font-poppins text-secondary flex flex-col justify-center items-center text-center gap-16">
                <h1 className=" text-6xl font-bold ">Ticket Number</h1>
                <div className="relative h-fit items-center flex ">
                    <h1 className="z-20 absolute px-4 text-primary font-bold text-4xl ">T-</h1>
                    <input name = "ticketNumber" className="text-center w-[600px] h-[65px] rounded-sm bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20 font-bold p-4 px-16 text-3xl"></input>
                </div>
                <button type="submit" className="rounded-sm h-[75px] w-[400px] bg-complementary text-primary font-bold text-2xl hover:bg-secondary hover:text-primary duration-500 hover:scale-105">Check In</button>
            </form>
        </div>
        </>
    )
}