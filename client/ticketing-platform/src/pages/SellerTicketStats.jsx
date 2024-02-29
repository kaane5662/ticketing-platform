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

export default function SellerTicketStats(){

    
    const [changes,setChanges] = useState({})
    const [Data, setData] = useState()
    const {id} = useParams()
    const navigate = useNavigate()
    
    const getTicket = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/ticket/${id}`,{withCredentials: true}).then((response)=>{
            console.log(response.data)
            setData(response.data || [])
        }).catch((error)=>{
            console.log(error)
            if( error.response.status == 401 || error.response.status == 403) navigate("/login", {replace:true})
            console.log(error)
        })
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
            <div className=" w-[60%] max-lg:w-[85%] py-12 flex flex-col gap-6 max-lg:text-center">
                <h1 className="text-5xl font-bold max-lg:text-4xl">{Data?.ticket?.title || "Test Ticket"}</h1>
                <h3 className="text-xl max-lg:text-sm">{Data?.ticket.address}</h3>
                <h3 className=" text-lg tracking-wider">{new Date(Data?.ticket.event.day).toDateString()}: {convertTime(Data?.ticket.event.start_time)} -{convertTime(Data?.ticket.event.end_time)}</h3>

                <h3 className="bg-complementary rounded-sm p-3   text-md text-primary font-bold w-fit">{Data?.ticket.event_type || "House Party"}</h3>
                <div className="flex gap-2 justify-between flex-wrap">
                    <div className="flex flex-col gap-4 py-4 px-6 border-2 border-opacity-20 border-secondary">
                        <h3 className="font-bold">Tickets Sold</h3>
                        <h3 className="text-sm">{Data?.transactions?.sold || 0}</h3>
                    </div>
                    <div className="flex flex-col gap-4 py-4 px-6 border-2 border-opacity-20 border-secondary">
                        <h3 className="font-bold">Remaining Stock</h3>
                        <h3 className="text-sm">{Data?.ticket.stock || 32}</h3>
                    </div>
                    <div className="flex flex-col gap-4 py-4 px-6 border-2 border-opacity-20 border-secondary">
                        <h3 className="font-bold">Revenue Generated</h3>
                        <h3 className="text-sm">${Data?.transactions?.revenue || 0}</h3>
                    </div>
                    <div className="flex flex-col gap-4 py-4 px-6 border-2 border-opacity-20 border-secondary">
                        <h3 className="font-bold">Ticket Price</h3>
                        <h3 className="text-sm">${Data?.ticket.price || 32}</h3>
                    </div>
                </div>
                
                <h1 className="font-bold text-xl">Overview</h1>
                <h3 >{Data?.ticket.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur architecto minima id non? Eius quidem pariatur molestias quas quisquam cumque veritatis tempore temporibus consequatur explicabo veniam corporis eligendi molestiae cupiditate sed, similique a fugit aperiam? Modi itaque nulla nesciunt mollitia ab ad dolorum voluptas cupiditate! Voluptatibus, ut odit."}</h3>
                <div className="flex flex-col gap-4 items-center">

                    <h1 className="text-3xl font-bold">Check In Scanner Link</h1>
                    <QRCode size={300} value={`${import.meta.env.VITE_CLIENT}/scan?ticket_id=${id}&scan_code=${Data?.ticket.checkin_code}`}></QRCode>
                    <Link className="hover:underline max-lg:text-sm" to={`/scan?ticket_id=${id}&scan_code=${Data?.ticket.checkin_code}`}>{`${import.meta.env.VITE_CLIENT}/scan?ticket_id=${id}&scan_code=${Data?.ticket.checkin_code}`}</Link>
                </div>
                
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