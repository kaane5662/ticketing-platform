import { useEffect, useState } from "react"
import {useNavigate, Link} from "react-router-dom"
import axios from "axios"

export default function Navbar(){
    const navigate = useNavigate()
    const [Profile, setProfile] = useState()
    const getAuthData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/profiles/auth`,{withCredentials:true}).then((response)=>{
            console.log(response.data)
            setProfile(response.data)
            setTicket(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const handleLogOut = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/profiles/logout`,{withCredentials:true}).then((response)=>{
            // setProfile(null)
            navigate("/login", {replace:true})
            window.location.reload()
        }).catch((error)=>{
            console.log(error)
        })
    }

    

    useEffect(()=>{
        getAuthData()
    },[])

    return (
        <nav className="justify-between p-4 font-poppins text-secondary bg-primary items-center static absolute w-[100%] top-0   ">
            <div className="flex justify-between items-center">

                <div className="flex gap-16 font-poppins items-center">
                    <h1 className=" font-caveat text-6xl text-primary">SwftT</h1>  
                    
                    
                </div>
                <div className="right flex gap-8 font-poppins items-center">
                    {/* <h3  className="text-md hover:underline">{Profile?.email.split("@")[0]}</h3> */}
                    <Link to="/tickets" className="text-md hover:underline">Explore Tickets</Link>
                    {Profile? 
                        <>
                        <h3 onClick={handleLogOut}  className="text-md hover:cursor-pointer hover:underline">Log out</h3>
                        <h3  className="text-md">{Profile?.email.split("@")[0]}</h3>
                        </>
                        :
                        (
                            <>
                            <Link to="/login" className="text-md  hover:underline">Log in</Link>
                            <Link to="/signup" className="text-md  hover:underline">Sign Up</Link>
                            </>
                        )
                    }
                    
                    <Link to="/seller/tickets" className="p-4 px-8 hover:scale-105 duration-300 rounded-sm bg-complementary border-opacity-70 font-bold text-md text-primary "> {Profile ? "Switch to Selling":"Become a Seller"}</Link>
                </div>
            </div>
            
            {/* <button className="text-md bg-complementary rounded-sm h-[45px] w-[125px] font-bold hover:scale-110 duration-500">Contact Us</button> */}
        </nav>
    )
}