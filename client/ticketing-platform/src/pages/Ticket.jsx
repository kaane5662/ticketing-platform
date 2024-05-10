import axios from "axios"
import { motion, stagger } from "framer-motion"
import Success from "../components/Success"
import Failure from "../components/Failure"
import { useEffect, useState } from "react"
import Popup from "../components/Popup"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCheck, faLocation, faLocationPin, faMapLocationDot, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const photos = ["concert1.jpg", "concert2.jpeg", "concert3.jpg", "concert4.jpg", "concert5.jpg"]

export default function Ticket(){

    const [popUpActive, setPopUpActice] = useState(false)
    const [success, setSuccess] = useState(false)
    const [Photos, setPhotos] = useState(photos)
    const [total, setTotal] = useState(0)
    const [selected, setSelected] = useState(photos[0])
    const {id} = useParams()
    const [price, setPrice] = useState(25.99)
    const [Ticket, setTicket] = useState({
        title: "Very Cool House Party at Birminghan John LC",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        stock: 100,
        seller_id: "seller123",
        price: 25.99,
        published: true,
        icon: "ticket-icon.png",
        checkin_code: 123456,
        pictures: ["image1.jpg", "image2.jpg"],
        event_type: "Concert",
        tags: ["music", "live", "concert"],
        address: "3235, Emmons Avenue, Brooklyn, Kings County, New York, 11235, United States",
        event: {
            start_time: "2024-02-20T08:00:00",
            end_time: "2024-02-20T12:00:00",
            day: "2024-02-20"
        }
    })
    const [tickets,setTickets] = useState([{ name: "Adult", price: 20, stock: 100, quantity:0 },
    { name: "Child", price: 10, stock: 50, quantity:0 },{ name: "VIP", price: 30, stock: 50, quantity:0 },{ name: "Special", price: 50, stock: 50, quantity:0 }])

    const handlePurchase = ()=>{
        axios.post(`${import.meta.env.VITE_SERVER}/tickets/purchase/${id}`,{tickets}).then((response)=>{
            console.log(response.data)
            window.location.href = response.data.url
        }).catch((error)=>{
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
            console.log(error)
        })
    }

    const getTicketData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/tickets/${id}`).then((response)=>{
            // console.log(response.data)
            const Data = response.data
            setTicket(Data)
            if(Data.tickets && Data.tickets.length > 0){
                let tempTickets = Data.tickets
                tempTickets.forEach(tempTicket=>{tempTicket.quantity = 0})
                setTickets(tempTickets)
            }else{
                setTickets([{name:"Entry", price:Data.price, quantity:0}])
            }
            
        }).catch((error)=>{
            console.log(error)
        })
    }

    const changeTicketVariantQuantity = (index,dir)=>{
        const OriginalTickets = [...tickets]
        let tempQuantity = OriginalTickets[index].quantity + dir
        tempQuantity = Math.max(0,tempQuantity)
        tempQuantity = Math.min(5,tempQuantity)
        console.log(tempQuantity)
        OriginalTickets[index] = {
            ...OriginalTickets[index],
            quantity: tempQuantity
        }
        setTickets(OriginalTickets)
        // setQuantity(tempQuantity)
    }

    function convertTime(timeString) {
        // Split the time string into hours and minutes
        const [hours, minutes] = timeString.split(':').map(Number);
    
        // Convert 24-hour format to 12-hour format
        let hour12 = hours % 12 || 12; // Convert 0 to 12
        let period = hours < 12 ? 'AM' : 'PM';
    
        // Format the time string as "hh:mm:ssAM/PM"
        return `${hour12}:${minutes.toString().padStart(2, '0')}${period}`;
    }

    function calculateTotal(){
        let tempTotal = 0;
        tickets.forEach((ticket, index)=>{
            tempTotal += ticket.quantity * ticket.price

        })
        setTotal(tempTotal.toFixed(2))
    }

    useEffect(()=>{
        getTicketData()

    },[])

    useEffect(()=>{
        calculateTotal()
    },[tickets])

    return(
        
        
        <div className=" min-h-screen bg-primary flex flex-col items-center justify-center text-secondary font-poppins max-lg:py-20 ">
            {/* {popUpActive ? <Popup setActive={setPopUpActice} success = {success}></Popup>: null}
             */}
             <ToastContainer></ToastContainer>
            <motion.div 
            initial={{
                opacity: 0,
                scale: 1,
                hidden: "true"
            }}
            whileInView={{
                x: 0,
                y: 0,   
                rotate: 0,
                opacity: 1,
                scale: 1
            }}
            transition={{
                duration: 4,
                type:"spring",
                damping: 10,
                stiffness: 30,  
            }}
            viewport={{ once: true }}
            className="my-24 max-md:my-8 gap-4 flex max-lg:gap-4 flex-col w-[80%] max-lg:w-[90%]">
            
                <div className="flex justify-center items-center gap-4 max-lg:gap-4 flex-col">

                    <img src={`${import.meta.env.VITE_SERVER}/uploads/icons/${Ticket.icon}`} className="flex self-center col-span-2 h-[450px] w-[70%] bg-complementary object-cover max-lg:h-[220px] max-lg:w-[95%]  rounded-xl"/>

                    
                    <div className="flex flex-col justify-center col-span-2 gap-2 w-[60%] max-lg:w-[95%] max-lg:gap-3 ">
                        
                        
                        <h1 className=" font-bold text-2xl max-lg:text-2xl">{Ticket.title}</h1>
                        {/* <h3 className="text-lg max-lg:text-sm">Stock: {Ticket.stock}</h3> */}
                        <a href={`https://www.google.com/maps/search/${Ticket.address}`} target="_blank" rel="noopener noreferrer" className="text-md max-lg:text-sm hover:underline text-opacity-50  "> <FontAwesomeIcon icon={faMapLocationDot}></FontAwesomeIcon> {Ticket.address}</a>
                        <h1 className="text-complementary font-bold">{Ticket.event_type}</h1>
                        <h1 className=" text-md tracking-wider max-lg:text-sm">{new Date(Ticket.event.day).toDateString()}: {convertTime(Ticket.event.start_time)} -{convertTime(Ticket.event.end_time)}</h1>
                        
                        <h1 className="font-bold text-xl mt-8 ">Overview</h1>
                        <h3 className="text-md max-md:text-sm " style={{whiteSpace: 'pre-line'   }}>{Ticket.description }</h3>
        
                    
                        <h1 className="text-2xl font-bold mt-8 "> Tickets</h1>
                    
                        <div className="justify-center  items-center flex flex-col gap-4 w-[100%]">
                            {/* ticket prices display */}
                            {tickets.map((ticket, index)=>{
                                return(
                                    <div className="grid grid-cols-3 gap-20 max-lg:gap-4 items-center px-8 max-md:px-4 justify-center py-4 w-[100%] bg-white bg-opacity-5 rounded-xl">
                                        <h1 className="text-md ">{ticket.name}</h1>
                                        <div className="flex gap-8 max-lg:gap-4 justify-center items-center">
                                            <FontAwesomeIcon onClick={()=>changeTicketVariantQuantity(index,-1)}  className="text-xl hover:text-primary hover:bg-complementary rounded-md duration-300 p-2 border-2 border-secondary border-opacity-0  items-center justify-center  " icon={faMinus}></FontAwesomeIcon>
                                            <h3 className="text-md ">{ticket?.quantity}</h3>
                                            <FontAwesomeIcon onClick={()=>changeTicketVariantQuantity(index,1)} className="text-xl hover:text-primary hover:bg-complementary rounded-md duration-300 p-2 border-2 border-secondary border-opacity-0    items-center justify-center" icon={faPlus}></FontAwesomeIcon>
                                        </div>
                                        <h1 className="text-md text-right line-clamp-3 tracking-widest ">${ticket.price}</h1>
                                    </div>

                                )
                                
                            })}
                            
                        <div className="flex flex-col py-4 w-[100%] gap-2">
                            {/* bought tickets display */}
                            {tickets.map((ticket,index)=>{
                                return(
                                    ticket.quantity > 0 ?
                                        <div className="flex text-secondary text-opacity-80 justify-between">
                                            <h3 className="text-md ">{ticket.name}</h3>
                                            <h3 className="text-md tracking-widest">${ticket.price*ticket.quantity} <span className="text-sm  tracking-normal">x{ticket.quantity}</span></h3>
                                            
                                        </div>:null
                                    
                                    
                                )
                            })}
                        </div>
                        <div className="flex gap-8 items-center justify-between w-[100%]">
                            <h1 className="text-lg ">Total</h1>
                            <h1 className="text-3xl tracking-widest max-lg:text-lg">${total}</h1>   
                        </div>
                        <button disabled={total <=0} className={` w-[100%] py-4  bg-complementary bg-gradient-to-br from-complementary to to-complementary2 text-xl max-md:text-md text-primary font-bold rounded-xl  ${total <= 0? " opacity-20":"duration-500 hover:opacity-80"}    `} onClick={handlePurchase}>Checkout</button>    
                        </div>
                        
                        
                        
                        
                        
                    </div>
                    
                </div>

                
            </motion.div>
        </div>
        
        
    )
}