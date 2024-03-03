import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function DeleteTicket({setToggle, id}){
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate()
    const removeTicket = ()=>{
        setProcessing(true)
        axios.get(`${import.meta.env.VITE_SERVER}/tickets/delete/${id}`,{withCredentials: true}).then((response)=>{
            setProcessing(false)
            toast.success(response.data.message)
            navigate("/seller/tickets")
        }).catch((error)=>{
            setProcessing(false)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
            error.response.data?.url ? navigate(error.response.data.url) : null
            // console.log(error.response.data.url)
        })
    }


    return(
        <main className=" absolute top-[20%]  max-w-[50%] justify-center flex font-poppins z-40  ">
            <ToastContainer></ToastContainer>
            <div className="p-12 max-lg:p-4 flex flex-col max-w-[40%] max-lg:max-w-[95%] h-auto gap-8 text-center  justify-center border-opacity-20 border-secondary border-2 fixed bg-primary">
                <h1 className="text-5xl font-bold p-4 border-b-2 border-opacity-20 max-lg:text-4xl border-secondary">Delete Ticket</h1>
                
                <h1 className="text-md max-lg:text-sm">This action cannot be undone. Once deleted, the ticket and all associated data will be permanently removed from the system, including QR codes, and sales data. It is best to delete the event after it has concluded and you have viewed your revenue. </h1>
                <div className="flex gap-8 max-lg:gap-4 justify-center max-lg:flex-col">
                    <button onClick={()=>setToggle(false)} className="text-xl max-lg:py-4 max-lg:px-14 rounded-sm font-bold p-4 px-20 border-secondary border-2 border-opacity-20  hover:scale-105 max-lg:text-sm duration-300">No</button>
                    <button disabled={processing} onClick={removeTicket} className={`text-xl max-lg:py-4  max-lg:px-14 rounded-sm p-4 px-20 font-bold bg-red-500 hover:scale-105 duration-300 ${processing ? "bg-opacity-20" :""}`}>{!processing? "Yes": <FontAwesomeIcon spin className="h-6 text-secondary" icon={faCircleNotch}></FontAwesomeIcon>} </button>

                </div>
            </div>
        </main>
    )
}