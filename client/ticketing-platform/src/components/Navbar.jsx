import {useNavigate, Link} from "react-router-dom"

export default function Navbar(){
    const navigate = useNavigate()
    return (
        <nav className="justify-between p-4 font-poppins text-secondary bg-primary items-center static absolute w-[100%] top-0   ">
            <div className="flex justify-between items-center">

                <div className="flex gap-16 font-poppins items-center">
                    <h1 className=" font-caveat text-6xl text-primary">SwftT</h1>  
                    
                    
                </div>
                <div className="right flex gap-8 font-poppins items-center">
                    <Link className="text-md">Explore Tickets</Link>
                    <Link className="h-[45px] w-[150px] rounded-sm flex justify-center items-center text-md  text-secondary">Become a Seller</Link>
                    <button className="h-[55px] w-[150px] rounded-sm bg-complementary font-bold text-md text-primary">Sign Up</button>
                </div>
            </div>
            
            {/* <button className="text-md bg-complementary rounded-sm h-[45px] w-[125px] font-bold hover:scale-110 duration-500">Contact Us</button> */}
        </nav>
    )
}