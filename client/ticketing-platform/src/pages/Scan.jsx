import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faCircleNotch, faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { verifySeller } from "../../../../server/sellerMiddleware";
import {QrScanner} from '@yudiel/react-qr-scanner';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Scan(){
    const [checkedIn, setCheckedIn] = useState(false)
    const [code, setCode] = useState(0)
    const {id} = useParams()
    const [Ticket, setTicket] = useState()
    // const checkCode = ()=>{
    //     console.log(code)
    //     console.log(id)
    //     axios.post(`${import.meta.env.VITE_SERVER}/seller/checkin/${id}`).then((response)=>{
    //         setCheckedIn(true)
    //     }).catch((error)=>{
    //         console.log(error)
    //     })
    // }

    const handleDecode = (data)=>{
        console.log(data)
        axios.post(`${import.meta.env.VITE_SERVER}/tickets/checkin/${Ticket._id}`,{ticket_number: data}).then((response)=>{
            console.log("Ticket is valid")
            toast.success(response.data.message)
        }).catch((error)=>{
            toast.error(error.response?.data?.message || "An unexpected error has occured   ", {autoClose: 500})
            console.log(error)
            // console.log("Ticket is invalid")
        })
    }

    // const checkInUser = ()=>{
        
    // }

    const verifySeller = () =>{
        const searchParams = new URLSearchParams(window.location.search);
        const ticket_id = searchParams.get('ticket_id');
        const checkin_code = searchParams.get('scan_code');
        
        axios.put(`${import.meta.env.VITE_SERVER}/tickets/checkin/${ticket_id}`,{checkin_code}).then((response)=>{
            // ticket_id = null
            console.log(response.data)
            setTicket(response.data)
        }).catch((error)=>{
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
            console.log(error)
        })
    }

    useEffect(()=>{
        verifySeller()
    },[])

    return(
        <main className=" bg-primary h-screen flex justify-center text-secondary font-poppins">
            <ToastContainer ></ToastContainer>
            {!Ticket ? (
                <div className="flex gap-8 font-poppins  flex-col justify-center">
                    <FontAwesomeIcon className="h-16" spin icon={faCircleNotch}></FontAwesomeIcon>
                    <h3 className="text-xl animate-pulse">Verifying Ticket and Seller Code</h3>
                </div>
            
            )
            
            
            
            :(
                <div className="flex flex-col gap-8 w-[35%] items-center justify-center">
                    {/* <h1 className="text-5xl font-bold">Scanner</h1> */}
                    <h1 className="text-2xl">{Ticket?.title || "Frat Party"}</h1>

                    <div className=" w-[450px]">

                        <QrScanner size={500} delay ={1500} onDecode={handleDecode}/>
                    </div>
                    


                </div>
            )}
        </main>
    )
}