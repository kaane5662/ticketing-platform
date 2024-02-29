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
        
        <div onClick={()=>navigate(`/seller/ticket/${Ticket._id}`)} className="flex gap-8 p-4 rounded-sm border-secondary border-2 items-center border-opacity-10 justify-around hover:scale-105  hover:cursor-pointer duration-300">
            <img className="w-[150px] max-md:w-[75px] max-md:h-[75px] h-[150px] bg-complementary rounded-sm object-cover" src={`${import.meta.env.VITE_SERVER}/uploads/icons/${Ticket.icon}`}></img>
            <div className="flex flex-col gap-8">
                <h3 className="text-xl max-lg:text-lg font-bold">{Ticket.title.substring(0,18)+"..."}</h3>
                <h3 className="text-md text-primary font-bold rounded-sm w-fit px-4  justify-center flex max-lg:text-sm bg-complementary">{Ticket.event_type}</h3>
            </div>
            <div className="flex gap-8 max-lg:text-sm flex-col">
                <h3 className="max-w-30 text-lg max-w-[400px] max-lg:text-sm">{Ticket.address.substring(0,30)+"..."}</h3>
                <div className="flex gap-8 items-center ">
                    <h3 className="text-xl max-lg:text-sm"> {Ticket.event.day}  </h3>
                    <h3 className="text-xl max-lg:text-sm"> { convertTime(Ticket.event.start_time)} - {convertTime(Ticket.event.end_time)}  </h3>
                </div>
            </div>
            <h1 className="text-2xl max-lg:text-lg">${Ticket.price}</h1>
        </div>
           
    )
}