import { useNavigate } from "react-router-dom"

export default function TicketDisplay({Ticket}){

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
        
        <div onClick={()=>navigate(`/ticket/${Ticket._id}`)} className="flex flex-col gap-2 hover:scale-105 hover:cursor-pointer duration-300 text-secondary w-[100%] hover:bg-opacity-10 hover:bg-white p-4 max-md:p-0 rounded-xl h-full">
            <img className="w-[100%] min-h-[175px] max-md:h-[125px] bg-complementary rounded-md object-cover " src={`${import.meta.env.VITE_SERVER}/uploads/icons/${Ticket.icon}`}></img>
            <div className="flex flex-col justify-between gap-2 max-lg:gap-2 h-full">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl max-md:text-sm font-bold">{Ticket.title}</h3>
                    <h3 className="max-w-30 text-md max-w-[400px] max-lg:text-xs">{Ticket.address.substring(0,30)+"..."}</h3>
                </div>
                <div className="flex flex-col gap-2">
                    
                    <h3 className="text-md text-complementary font-bold max-lg:text-xs">{Ticket.event_type}</h3>
                    
                    <h3 className="text-md max-md:text-xs"> {new Date(Ticket.event.day).toDateString()}  </h3>
                </div>
                
                {/* <h3 className="text-md max-md:text-sm"> { convertTime(Ticket.event.start_time)} - {convertTime(Ticket.event.end_time)}  </h3> */}
                
                
                {/* <h1 className="text-2xl">${Ticket.price}</h1> */}
            </div>
        </div>
           
    )
}