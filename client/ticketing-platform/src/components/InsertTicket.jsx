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
        <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-8 font-poppins text-secondary bg-primary border-b-2 border-secondary border-opacity-20 pb-8">
            <div className="flex flex-col gap-4">
                <h3 className="font-poppins">Ticket Name</h3>
                <input type="text" onChange={handleNameChange} placeholder="Enter name" value={ticket?.name} className="h-[40px] w-full p-2 bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20 rounded-sm"></input>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="font-poppins">Ticket Stock</h3>
                <input type="number" onChange={handleStockChange} placeholder="Enter stock" value={ticket?.stock} className="h-[40px] w-full p-2 bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20 rounded-sm"></input>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="font-poppins">Ticket Price</h3>
                <input type="number" step={.01} onChange={handlePriceChange} placeholder="Enter price" value={ticket?.price} c className="h-[40px]  p-2 bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20 w-full rounded-sm"></input>
            </div>
            <button onClick={handleRemove} type="button" className=" bg-red-500 h-8 w-8 rounded-sm text-xl hover:scale-105 duration-200">-</button>
            
        </div>
    )
}