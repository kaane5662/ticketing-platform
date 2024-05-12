import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function PublishTicket({setActive, onSubmit}){
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate()

    const handlePublish = () => {
        // Additional logic related to publishing ticket
        onSubmit(); // Trigger form submission from the parent component
        setActive(false); // Close the publish ticket popup
    };


    return(
        <div className="absolute top-[20%] flex font-poppins z-40 col-span-4 justify-center   ">
            <div className="p-8 rounded-lg max-lg:p-4 flex flex-col max-w-[40%] max-lg:max-w-[95%] h-auto gap-8 justify-center border-opacity-20  fixed border-2 border-secondary bg-primary text-secondary text-center ">
                <h1 className="text-5xl font-bold border-opacity-20 max-lg:text-4xl ">Publish Ticket</h1>
                
                <h1 className="text-lg max-lg:text-md">Are you sure you want to publish this ticket?</h1>
                <h3 className="text-sm max-lg:text-xs text-secondary text-opacity-50">Once published, this ticket cannot be unpublished or reverted to draft status. Please ensure all information is accurate before proceeding.</h3>
                <div className="flex gap-8 max-lg:gap-4 max-lg:flex-col justify-center">
                    <h3 onClick={()=>setActive(false)} className="text-md rounded-lg  p-3 px-12 bg-secondary  bg-opacity-5  hover:scale-105 max-lg:text-sm duration-300 hover:cursor-pointer">No</h3>
                    <button type="submit" onClick={handlePublish} className={`text-md  rounded-lg p-3 px-12 font-bold bg-complementary bg-gradient-to-br from-complementary to to-complementary2 text-primary hover:animate-pulse duration-300 ${processing ? "bg-opacity-20" :""}`}>{!processing? "Yes": <FontAwesomeIcon spin className="h-6 text-secondary" icon={faCircleNotch}></FontAwesomeIcon>} </button>

                </div>
            </div>
        </div>
    )
}