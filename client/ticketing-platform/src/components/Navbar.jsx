import { useEffect, useState } from "react"
import {useNavigate, Link} from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faNavicon } from "@fortawesome/free-solid-svg-icons"



export default function Navbar(){



    const navigate = useNavigate()
    const [navbarActive, setNavbarActive] = useState(false)
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

    const mobileHide = ()=>{
        console.log("Hide buddy")
        setNavbarActive(false)
    }

    

    

    useEffect(()=>{
        getAuthData()
    },[])

    return (
        <nav className="justify-between font-poppins text-secondary bg-primary items-center max-lg:bg-primary  absolute w-[100%] top-0   ">
            <div className="flex justify-between lg:items-center   fixed w-[100%] p-4 max-lg:p-2 bg-primary ">

                
                <img onClick={()=>navigate("/")} src="SwftTLogo.png" className="h-20 max-lg:h-10 px-4 "></img>  
                    
                    
                
                <div className="right flex gap-8 font-poppins items-center max-lg:hidden ">
                    {/* <h3  className="text-md hover:underline">{Profile?.email.split("@")[0]}</h3> */}
                    <Link onClick={mobileHide} to="/tickets" className="text-md hover:underline hover:cursor-pointer">Explore Tickets</Link>
                    {Profile? 
                        <>
                        <h3  className="text-md hover:cursor-pointer hover:underline">Log out</h3>
                        <h3 className="text-md">{Profile?.email.split("@")[0]}</h3>
                        </>
                        :
                        (
                            <>
                            <a href={import.meta.env.VITE_CALLENDLY_LINK} className="text-md  hover:underline hover:cursor-pointer">Request a Demo</a>
                            <Link  to="/login" className="text-md  hover:underline">Log in</Link>
                            <Link  to="/signup" className="text-md  hover:underline">Sign Up</Link>
                            </>
                        )
                    }
                    
                    <Link to="/seller/tickets" className="p-4 px-8 hover:scale-105 duration-300 rounded-sm bg-complementary border-opacity-70 font-bold text-md text-primary "> {Profile ? "Switch to Selling":"Become a Seller"}</Link>
                </div>
                <FontAwesomeIcon onClick={()=>setNavbarActive(!navbarActive)} icon={faNavicon}  className="h-8 p-4 w-8 md:hidden hover:cursor-pointer"></FontAwesomeIcon>
            {/* mobile menu */}

            {
                navbarActive &&
                (
                    <div className="flex flex-col gap-8 h-screen absolute top-0 py-10 bg-primary w-[100%] px-4 transition duration-300 z-20">
                        <Link onClick={mobileHide} to="/tickets" className="text-md hover:underline">Explore Tickets</Link>
                        {Profile? 
                            <>
                            <h3 onClick={handleLogOut}  className="text-md hover:cursor-pointer hover:underline">Log out</h3>
                            <h3 onClick={mobileHide}  className="text-md">{Profile?.email.split("@")[0]}</h3>
                            </>
                            :
                            (
                                <>
                                <a href={import.meta.env.VITE_CALLENDLY_LINK} className="text-md  hover:underline hover:cursor-pointer">Request a Demo</a>
                                <Link onClick={mobileHide} to="/login" className="text-md  hover:underline">Log in</Link>
                                <Link onClick={mobileHide} to="/signup" className="text-md  hover:underline">Sign Up</Link>
                                </>
                            )
                        }
                        
                        <Link to="/seller/tickets" className="p-4 px-8 hover:scale-105 duration-300 rounded-sm bg-complementary border-opacity-70 font-bold text-md text-primary max-lg:w-fit "> {Profile ? "Switch to Selling":"Become a Seller"}</Link>
                    </div>
                )
            } 
            
            
            
            
            </div>

            
            
            {/* <button className="text-md bg-complementary rounded-sm h-[45px] w-[125px] font-bold hover:scale-110 duration-500">Contact Us</button> */}
        </nav>
    )
}