
export default function Navbar(){
    return (
        <nav className="flex justify-between p-4 font-poppins text-secondary bg-primary items-center    ">
            <h1 className="font-bold text-4xl font-caveat">Ticketly</h1>
            
            <button className="text-md bg-complementary rounded-sm h-[45px] w-[125px] font-bold hover:scale-110 duration-500">Contact Us</button>
        </nav>
    )
}