import { useNavigate } from "react-router-dom";

export default function SellerTicket({Ticket}){

    const navigate = useNavigate()
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
        
        <div onClick={()=>navigate(`/seller/ticket/${Ticket._id}`)} className="flex gap-8 max-lg:gap-2 p-4 rounded-sm border-secondary border-2 items-center border-opacity-10 justify-around hover:scale-105  hover:cursor-pointer duration-300">
            <img className="w-[150px] max-lg:w-[75px] max-lg:h-[75px] h-[150px] bg-complementary rounded-sm object-cover" src={`${import.meta.env.VITE_SERVER}/uploads/icons/${Ticket.icon}`}></img>
            <div className="flex flex-col gap-8 max-lg:gap-2">
                <h3 className="text-xl  max-lg:text-sm font-bold">{Ticket.title.substring(0,18)+"..."}</h3>
                <h3 className="text-md text-primary font-bold rounded-sm w-fit px-4 max-lg:p-2  justify-center flex max-lg:text-xs bg-complementary">{Ticket.event_type}</h3>
            </div>
            <div className="flex gap-8 max-lg:text-sm max-lg:hidden flex-col">
                <h3 className="max-w-30 text-lg max-w-[400px] max-lg:text-xs">{Ticket.address.substring(0,30)+"..."}</h3>
                <div className="flex gap-8 items-center ">
                    <h3 className="text-xl max-lg:text-xs"> {Ticket.event.day}  </h3>
                    <h3 className="text-xl max-lg:text-xs"> { convertTime(Ticket.event.start_time)} - {convertTime(Ticket.event.end_time)}  </h3>
                </div>
            </div>
            <h1 className="text-2xl max-lg:text-lg">${Ticket.price}</h1>
        </div>
           
    )
}