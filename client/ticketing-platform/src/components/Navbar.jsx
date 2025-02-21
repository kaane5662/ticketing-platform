import { useEffect, useState } from "react"
import {useNavigate, Link} from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faNavicon } from "@fortawesome/free-solid-svg-icons"

// THis is just a test on the branch

export default function Navbar(){



    const navigate = useNavigate()
    const [navbarActive, setNavbarActive] = useState(false)
    const [Profile, setProfile] = useState()
    const getAuthData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/profiles/auth`,{withCredentials:true}).then((response)=>{
            console.log(response.data)
            setProfile(response.data)
            // setTicket(response.data)
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
            <div className="flex justify-between lg:items-center   fixed w-[100%] p-2 max-lg:p-2 bg-primary ">

                
                <img onClick={()=>navigate("/")} src="/SwftTLogo.png" className="h-20 max-lg:h-10 px-4 "></img>  
                    
                    
                
                <div className="right flex gap-8 font-poppins items-center max-lg:hidden ">
                    {/* <h3  className="text-md hover:underline">{Profile?.email.split("@")[0]}</h3> */}
                    <Link onClick={mobileHide} to="/tickets" className="text-md p-2 hover:border-t-2 hover:border-complementary">Explore Tickets</Link>
                    <Link onClick={mobileHide} to="/support" className="text-md p-2 hover:border-t-2 hover:border-complementary">Contact Support</Link>
                    {Profile? 
                        <>
                        <h3 onClick={handleLogOut} className="text-md p-2 hover:border-t-2 hover:border-complementary hover:cursor-pointer">Log out</h3>
                        <h3 className="text-md">{Profile?.email.split("@")[0]}</h3>
                        </>
                        :
                        (
                            <>
                            <a href={import.meta.env.VITE_CALLENDLY_LINK} className="text-md      p-2 hover:border-t-2 hover:border-complementary">Request a Demo</a>
                            <Link  to="/login" className="text-md p-2 hover:border-t-2 hover:border-complementary">Log in</Link>
                            <Link  to="/signup" className="text-md  p-2 hover:border-t-2 hover:border-complementary">Sign Up</Link>
                            </>
                        )
                    }
                    
                    <Link to="/seller/tickets" className="p-4 px-6 hover:scale-105 duration-300 rounded-xl  bg-complementary bg-gradient-to-br from-complementary to to-complementary2 font-bold text-md text-primary "> {Profile ? "Switch to Selling":"Become a Seller"}</Link>
                </div>
                <FontAwesomeIcon onClick={()=>setNavbarActive(!navbarActive)} icon={faNavicon}  className="h-8 p-4 w-8 md:hidden hover:cursor-pointer z-20"></FontAwesomeIcon>
            {/* mobile menu */}

            {
                navbarActive &&
                (
                    <div className="flex flex-col gap-8 h-screen absolute top-0 py-10 bg-primary w-[50%] px-4 border-opacity-20 border-secondary border-r transition duration-300 z-20">
                        <img onClick={()=>navigate("/")} src="SwftTLogo.png" className="h-20 max-lg:h-10 object-scale-down "></img> 
                        <Link onClick={mobileHide} to="/tickets" className="text-sm hover:underline">Explore Tickets</Link>
                        <Link onClick={mobileHide} to="/support" className="text-sm hover:underline">Contact Support</Link>
                        {Profile? 
                            <>
                            <h3 onClick={handleLogOut}  className="text-sm hover:cursor-pointer hover:underline">Log out</h3>
                            <h3 onClick={mobileHide}  className="text-sm">{Profile?.email.split("@")[0]}</h3>
                            </>
                            :
                            (
                                <>
                                <a href={import.meta.env.VITE_CALLENDLY_LINK} className="text-sm  hover:underline hover:cursor-pointer">Request a Demo</a>
                                <Link onClick={mobileHide} to="/login" className="text-sm  hover:underline">Log in</Link>
                                <Link onClick={mobileHide} to="/signup" className="text-sm  hover:underline">Sign Up</Link>
                                </>
                            )
                        }
                        
                        <Link to="/seller/tickets" className="p-4 px-2 hover:scale-105 duration-300 rounded-sm bg-complementary border-opacity-70 font-bold text-sm text-primary max-lg:w-fit "> {Profile ? "Switch to Selling":"Become a Seller"}</Link>
                    </div>
                )
            } 
            
            
            
            
            </div>

            
            
            {/* <button className="text-md bg-complementary rounded-sm h-[45px] w-[125px] font-bold hover:scale-110 duration-500">Contact Us</button> */}
        </nav>
    )
}