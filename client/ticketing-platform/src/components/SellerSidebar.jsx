import { faCartShopping, faColonSign, faColumns, faDoorClosed, faGripVertical, faMoneyBill, faNavicon, faPerson, faRightFromBracket, faSquarePlus, faTicketSimple, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect,useState } from "react";


export default function SellerSidebar(){

    const [Profile, setProfile] = useState()
    const [navbarActive, setNavbarActive] = useState(true)
    const location = useLocation()
    const [isMaxMd, setIsMaxMd] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMaxMd(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


    const getAuthData = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/profiles/auth`,{withCredentials:true}).then((response)=>{
            console.log(response.data)
            setProfile(response.data)
           
        }).catch((error)=>{
            console.log(error)
        })
    }

    const updateStripeAccount = ()=>{
        navigate("/boarding2")
        // axios.get(`${import.meta.env.VITE_SERVER}/seller/update`,{withCredentials:true}).then((response)=>{
        //     window.location.href = response.data.url
           
        // }).catch((error)=>{
        //     console.log(error)
        // })
    }

    useEffect(()=>{
        isMaxMd ? setNavbarActive(false):setNavbarActive(true)
    },[location.pathname])

    const createDashboardLink = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/dashboard`,{withCredentials:true}).then((response)=>{
            window.location.href = response.data.url
           
        }).catch((error)=>{
            console.log(error)
        })
    }




    useEffect(()=>{
        getAuthData()
    },[])

    const navigate = useNavigate()
    return(
        <nav className="  fixed bg-primary font-poppins w-screen z-30 ">
            
            <div className="flex ">
                { navbarActive ? 
                (
                    <div className="cointainer w-fit p-6 flex top-0 left-0 border-r-secondary  border-opacity-10 text-secondary  h-screen  gap-8 justify-between flex-col absolute bg-primary">
                        <div className="flex flex-col gap-8">
                           
                            <img className="h-14 w-14" src="/SwftTLogo.png"></img>
                                
                            <h3 className="font-bold">{Profile?.email.split("@")[0]}</h3>
                            <div onClick={createDashboardLink} className="flex gap-3 items-center relative hover:scale-105 duration-300 hover:cursor-pointer     ">
                                <FontAwesomeIcon className=" w-5" icon={faGripVertical}></FontAwesomeIcon>
                                <h3 className=" text-sm">Dashboard</h3>
                            </div>
                            {/* <div onClick={()=>navigate("/seller/transactions")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                                <FontAwesomeIcon className="w-5" icon={faCartShopping}></FontAwesomeIcon>
                                <h3 className=" text-md">Transactions</h3>
                            </div> */}
                            <div onClick={()=>{navigate("/seller/tickets");}} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer  border-opacity-20 ">
                                <FontAwesomeIcon className="w-5" icon={faTicketSimple}></FontAwesomeIcon>
                                <h3 className=" text-sm">Tickets</h3>
                            </div>
                            {/* <div onClick={()=>navigate("/seller/checkout")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                                <FontAwesomeIcon className="w-5" icon={faMoneyBill}></FontAwesomeIcon>
                                <h3 className=" text-md">Checkout</h3>
                            </div> */}
                            

                            <div onClick={()=>{navigate("/seller/create"); }} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                                <FontAwesomeIcon className="w-5" icon={faSquarePlus}></FontAwesomeIcon>
                                <h3 className=" text-sm">Create Event</h3>
                            </div>
                        </div>
                        <div className="flex gap-8 flex-col ">
                            
                            
                            <div onClick={updateStripeAccount} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                                <FontAwesomeIcon className="w-5" icon={faColumns}></FontAwesomeIcon>
                                <h3 className=" text-sm">Update Account</h3>
                            </div>
                            <div onClick={()=>navigate("/support")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                                <FontAwesomeIcon className="w-5" icon={faUser}></FontAwesomeIcon>
                                <h3 className=" text-sm">Contact Support</h3>
                            </div>
                            
                            
                            <div onClick={()=>navigate("/tickets")} className="flex gap-3 items-center hover:scale-105 duration-300 hover:cursor-pointer ">
                                <FontAwesomeIcon className="w-5" icon={faRightFromBracket}></FontAwesomeIcon>
                                <h3 className=" text-sm">Exit Creator</h3>
                            </div>
                        </div>
                    </div>
                ):null

                }
                
                <FontAwesomeIcon onClick={()=>setNavbarActive(!navbarActive)} icon={faNavicon}  className="h-8 p-4 w-8 md:hidden hover:cursor-pointer text-secondary  text-sm absolute right-4"></FontAwesomeIcon>
            </div>
            
            
            
        </nav>
    )
}