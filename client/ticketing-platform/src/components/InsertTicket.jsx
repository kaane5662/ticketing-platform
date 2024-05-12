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
        <div className="grid grid-cols-2 w-[100%] gap-4 font-poppins items-center text-secondary relative bg-secondary bg-opacity-5 p-8 rounded-lg">

            {/* <h3 className="font-poppins font-bold">Ticket details</h3> */}
            
            <h3 className="font-poppins text-2xl font-bold col-span-2 ">Event Ticket</h3>
               
            
              <h3 className="font-poppins text-sm ">Ticket Name</h3>
              <input type="text" onChange={handleNameChange} placeholder="Enter name" value={ticket?.name} className=" py-2 bg-secondary bg-opacity-0 w-[100%] border-b-2 border-secondary border-opacity-20 rounded-sm col-span-2"></input>
          
          
              <h3 className="font-poppins text-sm">Ticket Stock</h3>
              <input type="number" onChange={handleStockChange} placeholder="Enter stock" value={ticket?.stock} className="  w-[100%]  py-2 bg-secondary bg-opacity-0 border-b-2 border-secondary border-opacity-20 rounded-sm"></input>
            
            
              <h3 className="font-poppins text-sm ">Ticket Price</h3>
              <div className="flex gap-2 items-center">
                <h3>$</h3>
                <input type="number" step={.01} onChange={handlePriceChange} placeholder="Enter price" value={ticket?.price} c className="h-[40px]  py-2 bg-secondary bg-opacity-0 border-b-2 border-secondary border-opacity-20 w-[100%] rounded-sm"></input>
              </div>
            
            <button onClick={handleRemove} type="button" className=" bg-red-500 p-2 px-4 absolute top-4 right-4  rounded-xl text-md hover:scale-110 duration-200">X</button>
            
        </div>
    )
}