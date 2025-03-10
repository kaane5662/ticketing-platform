import { useState, useEffect } from "react";
import SellerTicket from "../components/SellerTicket";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import TicketForm from "../components/TicketForm";
import QRCode from 'qrcode.react';
import { Link } from "react-router-dom";
import DeleteTicket from "../components/Popups/DeleteTicket";

export default function SellerTicketStats(){

    const [deleteToggle,setDeleteToggle] = useState(false)
    const [changes,setChanges] = useState({})
    const [Data, setData] = useState()
    const {id} = useParams()
    const navigate = useNavigate()
    
    const getTicket = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/ticket/${id}`,{withCredentials: true}).then((response)=>{
            console.log(response.data)
            let Data = response.data
            //if the user used the old system
            if(Data.ticket.tickets.length < 1 || Data.ticket.tickets == null){
                console.log(true)
                Data.ticket.tickets.push({price: Data.ticket.price, stock: Data.ticket.stock, name: "Entry"})
            }
            console.log("Data: ",Data.ticket)
            setData(Data || [])
        }).catch((error)=>{
            console.log(error)
            if( error.response.status == 401 || error.response.status == 403) navigate("/login", {replace:true})
            console.log(error)
        })
    }

    const getTotalTicketsStock =(Ticket)=>{
        if(Ticket.tickets == null || Ticket?.tickets.length < 0) return Ticket?.stock || 0
        let totalStock = 0;
        Ticket.tickets.forEach((ticket)=>{totalStock+= ticket.stock})
        return totalStock
    }

    const getTotalTicketsSold =(Ticket)=>{
        if(Ticket.tickets == null || Ticket.tickets.length < 0) return 0
        let totalSold = 0;
        Ticket.tickets.forEach((ticket)=>{totalSold+= ticket.sold || 0})
        return totalSold
    }

    useEffect(()=>{
        getTicket()
    },[])

    function convertTime(timeString) {
        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(':').map(Number);
    
        // Convert 24-hour format to 12-hour format
        let hour12 = hours % 12 || 12; // Convert 0 to 12
        let period = hours < 12 ? 'AM' : 'PM';
    
        // Format the time string as "hh:mm:ssAM/PM"
        return `${hour12}:${minutes.toString().padStart(2, '0')}${period}`;
    }

    return( 
        Data ?
        <>
        
        
        <div className="min-h-screen bg-primary text-secondary justify-center items-center flex font-poppins">
            {deleteToggle? <DeleteTicket id={id} setToggle={setDeleteToggle}/>:null}
            <div className=" w-[60%] max-lg:w-[85%] max-lg:py-16 py-12 flex flex-col gap-4">
                <h1 className="text-5xl font-bold max-lg:text-3xl">{Data?.ticket?.title || "Test Ticket"}</h1>
                <h3 className="text-xl max-lg:text-sm">{Data?.ticket.address}</h3>
                <h3 className="text-complementary   text-lg max-lg:text-sm  font-bold w-fit">{Data?.ticket.event_type || "House Party"}</h3>
                <h3 className=" text-lg tracking-wider max-lg:text-sm">{new Date(Data?.ticket.event.day).toDateString()}: {convertTime(Data?.ticket.event.start_time)} -{convertTime(Data?.ticket.event.end_time)}</h3>

                <div className="grid grid-cols-3 gap-16 max-lg:gap-2 max max-lg:grid max-lg:grid-cols-3 flex-wrap">
                    <div className="flex flex-col max-lg:px-2 gap-4 py-4 px-10 rounded-xl bg-secondary bg-opacity-5 border-secondary">
                        <h3 className="font-bold max-lg:text-sm ">Tickets Sold</h3>
                        <h3 className="max-md:text-xs text-sm">{getTotalTicketsSold(Data.ticket) || 0}</h3>
                    </div>
                    <div className="flex flex-col gap-4 py-4 px-10 max-lg:px-2 rounded-xl bg-secondary bg-opacity-5  border-secondary">
                        <h3 className="font-bold max-lg:text-sm ">Remaining Stock</h3>
                        <h3 className="max-md:text-xs text-sm">{getTotalTicketsStock(Data.ticket) || 32}</h3>
                    </div>
                    <div className="flex flex-col gap-4 py-4 px-10 max-lg:px-2  rounded-xl bg-secondary bg-opacity-5 border-secondary">
                        <h3 className="font-bold max-lg:text-sm ">Revenue Generated</h3>
                        <h3 className="max-md:text-xs text-sm">${Data?.transactions?.revenue.toFixed(2) || 0}</h3>
                    </div>
                    {/* <div className="flex flex-col gap-4 py-4 px-6 border-2 border-opacity-20 border-secondary">
                        <h3 className="font-bold">Ticket Price</h3>
                        <h3 className="text-sm">${Data?.ticket.price || 32}</h3>
                    </div> */}
                </div>
                
                <h1 className="font-bold text-xl">Overview</h1>
                <h3 className="text-md max-lg:text-sm">{Data?.ticket.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur architecto minima id non? Eius quidem pariatur molestias quas quisquam cumque veritatis tempore temporibus consequatur explicabo veniam corporis eligendi molestiae cupiditate sed, similique a fugit aperiam? Modi itaque nulla nesciunt mollitia ab ad dolorum voluptas cupiditate! Voluptatibus, ut odit."}</h3>
                <div className="flex flex-col items-center gap-4">

                    <h1 className="text-2xl text-left font-bold max-lg:text-2xl">Check In Scanner Link</h1>
                    <Link className="underline hover:text-complementary max-lg:max-w-[200px]" to={`/scan?ticket_id=${id}&scan_code=${Data?.ticket.checkin_code}`}>Check In Link</Link>
                    <QRCode size={300} value={`${import.meta.env.VITE_CLIENT}/scan?ticket_id=${id}&scan_code=${Data?.ticket.checkin_code}`}></QRCode >
                </div>
                
                <button onClick={()=>setDeleteToggle(true)} className=" bg-red-500 text-secondary p-4 py-4 max-md:py-3 text-md font-bold hover:scale-105 hover:duration-300 rounded-md ">Delete</button>
            </div>
        </div>
        
        <TicketForm Data={Data}/>
        
        </> 
        :
        <div className="h-screen bg-primary text-secondary justify-center items-center flex font-poppins">
            <FontAwesomeIcon spin className="h-10 my-20" icon={faSpinner}></FontAwesomeIcon>
        </div>

        
    )
}