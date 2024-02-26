import { faDollarSign, faL, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function TicketForm({Data, ticket_id, edit}){
    const [eventIcon, setEventIcon] = useState()
    const [EventConstants, setEventConstants] = useState({EventTypes : [
        'Concert',
        'Conference',
        'Seminar',
        'Workshop',
        'Festival',
        'House Party',
        'Birthday Party',
        'Pool Party',
        'Graduation Party',
        'Theme Party',
        'Costume Party',
        'Dinner Party',
        'Art Exhibition',
        'Fashion Show',
        'Movie Premiere',
        'Book Launch',
        'Charity Gala',
        'Networking Event',
        'Product Launch',
        'Trade Show',
        'Sporting Event',
        'Food Festival',
        'Tech Conference',
        // Add more event types as needed
      ]})
    const [changes, setChanges] = useState(false)
    const navigate = useNavigate()
    
    // const filesRef = useRef([])
    const generateTicket = (e)=>{
        e.preventDefault()
        // console.log(e.target.files.value)
        const formData = new FormData(e.currentTarget)
        
        // console.log(formData.get("event_images"))
        // console.log(formData.get("tags"))
        setChanges(true)
        axios.post(`${import.meta.env.VITE_SERVER}/tickets`,formData,{
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            // console.log(response.data.redirectUrl);
            // alert("Ticket created successfully")
            toast.success(response.data.message)
            console.log("Ticket created successfully")
            navigate("/seller/tickets")
        }).catch((error)=>{
            setChanges(false)
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })
        
        // console.log(e.currentTarget)

    }

    const editTicket = (e)=>{
        e.preventDefault()
        // console.log(e.target.files.value)
        const formData = new FormData(e.currentTarget)
        
        console.log(formData.get("address"))
        // console.log(formData.get("eventicon"))
        axios.put(`${import.meta.env.VITE_SERVER}/tickets/${Data.ticket._id}`,formData,{
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            toast.success("Ticket edited successfully")
            // setChanges(false)
            console.log("Ticket created successfully")
        }).catch((error)=>{
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
            console.log(error)
        })
        
        // console.log(e.currentTarget)

    }

    const checkAuthority = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/create`,{withCredentials: true, maxRedirects:20}).then((response)=>{
            console.log(response.data.EventTypes)

            setEventConstants(response.data)
        }).catch((error)=>{
            error.response.data?.url ? navigate(error.response.data.url) : null
            console.log(error.response.data.url)
        })
    }

    const handleChange = (e)=>{
        toast.warn("Attention you have unsaved changes")
        // setChanges({...changes, [e.target.name]:e.target.value })
        setChanges(true)
        console.log(changes)
    }

    useEffect(()=>{
        checkAuthority()
    },[])

    return(
        <div className=" bg-primary flex flex-col  text-secondary items-center font-poppins ">
            <ToastContainer></ToastContainer>
            <form onSubmit={Data ? editTicket: generateTicket} onBlur={Data ? handleChange: null} className="grid-cols-4 grid gap-8 gird w-[60%] py-16">
                <h1 className="text-5xl  col-span-4  font-bold">{Data ? "Edit Ticket": "Create Ticket" }</h1>
                <div className="flex flex-col gap-4 col-span-4  ">
                    <h3>Ticket Title</h3>
                    <input name="title" defaultValue={Data?.ticket.title} className="title h-[40px] p-2 bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20"/>
                </div>
                <div className="flex flex-col gap-4 col-span-4  ">
                    <h3>Ticket Overview</h3>
                    <textarea name="description" defaultValue={Data?.ticket.description} className="title h-[200px] p-2 bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 ">
                    <h3>Event Type</h3>
                    <select required name="event_type" defaultValue={Data?.ticket.event_type} className=" h-[40px] bg-opacity-0 border-2 border-opacity-20 border-secondary    bg-secondary w-[250px] rounded-sm p-2" >
                        {EventConstants?.EventTypes?.map((eventType, index)=>{
                            return(

                                <option value={eventType} key={index} className="text-primary">{eventType}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="flex flex-col gap-4 col-span-4  ">
                    <PlaceAutocomplete original={Data?.ticket.address}></PlaceAutocomplete>
                </div>
                <div className="flex flex-col gap-4 col-span-2  ">
                    <h3>Day</h3>
                    <input required name="day" defaultValue={Data?.ticket.event.day}  type="date" className="title h-[40px] bg-secondary bg-opacity-0 border-2 p-2 border-secondary border-opacity-20"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 ">
                    <h3>Start Time</h3>
                    <input required name="start_time" defaultValue={Data?.ticket.event.start_time} type="time" className="title h-[40px] bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 ">
                    <h3>End Time</h3>
                    <input required name="end_time" defaultValue={Data?.ticket.event.end_time} type="time" className="title h-[40px] bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 ">
                    <h3>Ticket Stock</h3>
                    <input required name="stock" defaultValue={Data?.ticket.stock} type="number" className="p-2 title h-[40px] bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 ">
                    <h3>Ticket Price</h3>
                    <input required name="price" defaultValue={Data?.ticket.price} step={.01} type="number" className="p-2 title h-[40px] bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20"/>
                </div>
                <div className="flex flex-col gap-4 col-span-4 ">
                    <h3>Ticket Icon</h3>
                    <img required src={eventIcon? URL.createObjectURL(eventIcon): Data? `${import.meta.env.VITE_SERVER}/uploads/icons/${Data.ticket.icon}`:""} className="bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20 w-[500px] h-[500px] object-cover"/>
                    <input name="icon" className="" onChange={(e)=>setEventIcon(e.target.files[0])} multiple={false} type="file"></input>

                    
                </div>
                {
                    Data ?
                    <button disabled={!changes} type="submit" className={`col-span-4 px-12 p-4  w-fit text-lg bg-complementary font-bold text-primary rounded-sm ${!changes ? "bg-opacity-30": "hover:scale-105 duration-300"}   `}>Save Changes</button>
                    :
                    <button type="submit" className="col-span-4 px-12 p-4 hover:scale-105 duration-300 w-fit text-lg bg-complementary font-bold text-primary rounded-sm">Create Ticket</button>
                }
                
            </form>
        </div>
    )
}