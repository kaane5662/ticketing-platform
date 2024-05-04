import { useEffect } from "react"

export default function InsertTicket({Tickets, index, ticket,setTickets, setChanges}){
   
    const handleRemove =(e)=>{
        e.preventDefault()
        console.log(Tickets)
        console.log(index)
        const TicketsCopy = [...Tickets]
        const newTickets = TicketsCopy.filter((_,indexRemove)=> index != indexRemove)
        console.log(newTickets)
        setTickets(newTickets)
        setChanges(true)
    }

    const handleNameChange = (e) => {
      e.preventDefault();
      setTickets(Tickets => {
        const newTickets = [...Tickets];
        newTickets[index].name = e.target.value;
        return newTickets;
      });
    };
    
    const handlePriceChange = (e) => {
      e.preventDefault();
      setTickets(Tickets => {
        const newTickets = [...Tickets];
        newTickets[index].price = parseFloat(e.target.value);
        return newTickets;
      });
    };
    
    const handleStockChange = (e) => {
      e.preventDefault();
      setTickets(Tickets => {
        const newTickets = [...Tickets];
        newTickets[index].stock = parseInt(e.target.value);
        return newTickets;
      });
    };

    useEffect(()=>{
      console.log("Componenet rerendered")
    })

    return(
        <div className="flex flex-col gap-2 font-poppins text-secondary relative bg-secondary bg-opacity-5 p-8 rounded-xl">

            {/* <h3 className="font-poppins font-bold">Ticket details</h3> */}
            <div className="flex flex-col text-md  gap-0">
                <h3 className="font-poppins ">Ticket Name</h3>
                <input type="text" onChange={handleNameChange} placeholder="Enter name" value={ticket?.name} className=" py-2 bg-secondary bg-opacity-0 w-fit border-b-2 border-secondary border-opacity-20 rounded-sm"></input>
            </div>
            <div className="flex items-center text-sm gap-x-4 my-8">
                <h3 className="font-poppins">Ticket Stock</h3>
                <input type="number" onChange={handleStockChange} placeholder="Enter stock" value={ticket?.stock} className="  w-fit  p-2 bg-secondary bg-opacity-0 border-b-2 border-secondary border-opacity-20 rounded-sm"></input>
            </div>
            <div className="flex items-center text-sm gap-x-4">
                <h3 className="font-poppins">Ticket Price</h3>
                <input type="number" step={.01} onChange={handlePriceChange} placeholder="Enter price" value={ticket?.price} c className="h-[40px]  p-2 bg-secondary bg-opacity-0 border-b-2 border-secondary border-opacity-20 w-fit rounded-sm"></input>
            </div>
            <button onClick={handleRemove} type="button" className=" bg-red-500 p-1 px-4 absolute top-4 right-4  rounded-xl text-xl hover:scale-110 duration-200">-</button>
            
        </div>
    )
}