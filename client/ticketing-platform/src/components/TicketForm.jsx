import { faAdd, faDollarSign, faL, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import axios from "axios"
import {json, useNavigate} from "react-router-dom"
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InsertTicket from "./InsertTicket";
import PublishTicket from "./Popups/PublishTicket";
// import Ticket from "../../../../server/schemas/Ticket";


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
    const [Tickets, setTickets] = useState([])
    const [changes, setChanges] = useState(false)
    const [canPublish, setCanPublish] = useState(true)

    const [canDisplayPublishPopup, setDisplayPublishPopup] = useState(false)
    const navigate = useNavigate()
    
    // const filesRef = useRef([])
    const generateTicket = (e)=>{
        e.preventDefault()
        // console.log(e.target.files.value)
        const formData = new FormData(e.currentTarget)
        let data = {}
        data["tickets"] = Tickets
        formData.forEach((value, key)=>{
            if(key == "icon") return;
            data[key] = value
        })

        data["published"] = canPublish

        console.log(data)
        
        // return;
        setChanges(true)
        axios.post(`${import.meta.env.VITE_SERVER}/tickets`,data,{
            withCredentials: true,
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // }
        }).then(async (response)=>{
            // console.log(response.data.redirectUrl);
            // alert("Ticket created successfully")
            toast.success(response.data.message)
            try{
                const imageProcessed = await axios.post(`${import.meta.env.VITE_SERVER}/tickets/upload/${response.data.ticket_id}`,formData,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                
            }catch(error){
                
                toast.error("Invalid icon: Please update your icon on the edit page" )
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            }
                

            navigate(`/seller/ticket/${response.data.ticket_id}`)
            // console.log("Ticket created successfully")
            
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
        
        const data = {}
        // data["tickets"] = Tickets
        // formData.forEach((value, key)=>{
        //     data[key] = value
        // })
        // console.log(data)
        formData.append("tickets", JSON.stringify(Tickets))
        formData.append("published", canPublish)
        // console.log(formData.get("tickets"))
        // return;
        // console.log(formData.get("eventicon"))
        axios.put(`${import.meta.env.VITE_SERVER}/tickets/${Data.ticket._id}`,formData,{
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            toast.success("Ticket edited successfully")
            navigate("/seller/tickets")
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

    const insertTicket = (e)=>{
        e.preventDefault()
        setTickets([...Tickets, {name:null, price:null, stock:null}])
    }

    const handleChange = (e)=>{
        toast.warn("Attention you have unsaved changes", {autoClose: 250})
        // setChanges({...changes, [e.target.name]:e.target.value })
        setChanges(true)
        console.log(changes)
    }

    useEffect(()=>{
        checkAuthority()
        setTickets(Data?.ticket?.tickets || [])
    },[])

    return(
        <div className=" bg-primary flex flex-col  text-secondary items-center font-poppins justify-center ">
            
            <ToastContainer></ToastContainer>
            <form onSubmit={Data ? editTicket: generateTicket} onBlur={Data ? handleChange: null} className="grid-cols-4 grid gap-8 w-[60%] py-16 max-lg:w-[95%] ">
                <div className="flex justify-center  col-span-4 ">

                    {canDisplayPublishPopup && (<PublishTicket onSubmit={Data ? editTicket: generateTicket} setActive={setDisplayPublishPopup}></PublishTicket>)}
                </div>

                
                <h1 className="text-5xl max-lg:text-4xl  col-span-4  font-bold">{Data ? "Edit Event": "Create Event" }</h1>
                <div className="flex flex-col gap-4 col-span-4  ">
                    <h3>Event Title</h3>
                    <input required placeholder="Enter event title..." name="title" defaultValue={Data?.ticket.title} className="title p-3 bg-secondary bg-opacity-5 border-secondary border-opacity-20 rounded-lg"/>
                </div>
                <div className="flex flex-col gap-4 col-span-4  ">
                    <h3>Event Overview</h3>
                    <textarea placeholder="Enter event description..." name="description" defaultValue={Data?.ticket.description} className="title h-[200px] p-3 bg-secondary bg-opacity-5   border-secondary border-opacity-20 rounded-lg"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 ">
                    <h3>Event Type</h3>
                    <select required name="event_type" defaultValue={Data?.ticket.event_type} className="  bg-opacity-5 border-opacity-20 border-secondary    bg-secondary w-[250px] rounded-lg p-3" >
                        {EventConstants?.EventTypes?.map((eventType, index)=>{
                            return(

                                <option value={eventType} key={index} className=" text-primary     ">{eventType}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="flex flex-col gap-4 col-span-4  ">
                    <PlaceAutocomplete original={Data?.ticket.address}></PlaceAutocomplete>
                </div>
                <div className="flex flex-col gap-4 col-span-2  max-lg:col-span-3 ">
                    <h3>Day</h3>
                    <input required name="day" defaultValue={Data?.ticket.event.day}  type="date" className="title bg-secondary bg-opacity-5  p-3 border-secondary border-opacity-20 rounded-md"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 max-lg:col-span-2 ">
                    <h3>Start Time</h3>
                    <input required name="start_time" defaultValue={Data?.ticket.event.start_time} type="time" className="title bg-secondary bg-opacity-5 border-secondary rounded-lg"/>
                </div>
                <div className="flex flex-col gap-4 col-span-1 max-lg:col-span-2">
                    <h3>End Time</h3>
                    <input required name="end_time" defaultValue={Data?.ticket.event.end_time} type="time" className="title bg-secondary bg-opacity-5 p-3 border-secondary rounded-lg"/>
                </div>
                <h3 className="font-bold text-xl">Tickets</h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-12 w-[100%] col-span-4">
                    {Tickets.map((ticket, index)=>{
                        return(
                            <InsertTicket setChanges={setChanges} key={index} ticket={ticket}  index={index} setTickets={setTickets} Tickets={Tickets}></InsertTicket>
                        )
                    })}
                    
                    
                    
                    <button type= "button" onClick={insertTicket} className="bg-complementary h-fit w-fit font-bold text-primary p-4 px-6 rounded-xl hover:scale-105 duration-300 text-md">+</button>
                </div>

                <div className="flex flex-col gap-4 col-span-4 ">
                    <h3>Event Icon</h3> 
                    <img required src={eventIcon? URL.createObjectURL(eventIcon): Data? `${import.meta.env.VITE_SERVER}/uploads/icons/${Data.ticket.icon}`:""} className="bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20 w-[500px] h-[500px] object-cover max-lg:w-[250px] max-lg:h-[250px] rounded-lg"/>
                    <input name="icon" accept="image/*" onChange={(e)=>{setEventIcon(e.target.files[0]); handleChange(e)}} multiple={false} type="file"></input>

                    
                </div>
                <div className="flex gap-8 col-span-4">


                {/* this ticket has not been created yet or has not been created but not yet published */}
                {  ( Data == null || (Data && !Data?.ticket?.published) ) && (
                    <>
                    <button onClick={()=>setCanPublish(false)} type="submit" className="col-span-4 px-20 p-4 hover:scale-105 duration-300 w-fit text-lg bg-secondary bg-opacity-5  rounded-lg max-lg:px-8 max-lg:text-md">Save</button>
                    <h3 onClick={()=>setDisplayPublishPopup(true)} type="submit" className="col-span-4 px-20 p-4 hover:scale-105 duration-300 w-fit text-lg bg-complementary bg-gradient-to-br from-complementary to to-complementary2 font-bold text-primary rounded-lg max-lg:px-8 max-lg:text-md hover:animate-pulse hover:cursor-pointer">Publish</h3>
                    </>
                )}
                
                {/* this ticket has been created and published */}
                {  Data && Data?.ticket.published && (
                
                <>
                <button onClick={()=>setCanPublish(true)} type="submit" className="col-span-4 px-12 p-4 hover:scale-105 duration-300 w-fit text-lg bg-complementary bg-gradient-to-br from-complementary to to-complementary2 font-bold text-primary rounded-lg max-lg:px-8 max-lg:text-md hover:animate-pulse hover:cursor-pointer">Save Changes</button>
                </>
                
                
                )}

                </div>
                
            </form>
        </div>
    )
}