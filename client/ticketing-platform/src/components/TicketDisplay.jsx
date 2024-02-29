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
        
        <div onClick={()=>navigate(`/ticket/${Ticket._id}`)} className="flex flex-col gap-4 rounded-sm border-secondary border-2  border-opacity-10 hover:scale-105 hover:cursor-pointer duration-300 text-secondary w-[100%]">
            <img className="w-auto h-[200px] bg-complementary rounded-sm object-cover" src={`${import.meta.env.VITE_SERVER}/uploads/icons/${Ticket.icon}`}></img>
            <div className="flex flex-col gap-4 p-4 max-lg:gap-2">

                <h3 className="text-2xl max-md:text-lg font-bold">{Ticket.title}</h3>
                <h3 className="text-md text-primary font-bold rounded-sm w-fit px-4  justify-center flex bg-complementary max-lg:text-sm">{Ticket.event_type}</h3>
                
                
                <h3 className="max-w-30 text-md max-w-[400px] max-lg:text-sm">{Ticket.address.substring(0,30)+"..."}</h3>
                
                <h3 className="text-xl max-md:text-sm"> {Ticket.event.day}  </h3>
                <h3 className="text-xl max-md:text-sm"> { convertTime(Ticket.event.start_time)} - {convertTime(Ticket.event.end_time)}  </h3>
                
                
                <h1 className="text-2xl">${Ticket.price}</h1>
            </div>
        </div>
           
    )
}