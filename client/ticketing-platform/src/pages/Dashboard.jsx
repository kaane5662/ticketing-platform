import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Popup from "../components/Popup"

const photos = ["concert1.jpg", "concert2.jpeg", "concert3.jpg", "concert4.jpg", "concert5.jpg"]

export default function Dashboard(){

    const [popUpActive, setPopUpActice] = useState(false)
    const [success, setSuccess] = useState(false)
    const [Photos, setPhotos] = useState(photos)
    const [quantity, setQuantity] = useState(1)
    const [selected, setSelected] = useState(photos[0])
    const [price, setPrice] = useState(25.99)

    const handlePurchase = ()=>{
        axios.post("http://localhost:3000/purchase",{quantity: quantity}).then((response)=>{
            console.log(response.data)
            window.location.replace(response.data.url)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const changeQuantity = (dir)=>{
        let tempQuantity = quantity + dir
        tempQuantity = Math.max(1,tempQuantity)
        tempQuantity = Math.min(5,tempQuantity)
        setQuantity(tempQuantity)
    }

    useEffect(()=>{
        const params = window.location.search.split("success=")
        console.log(params)
        if(params.length <2) return
        if(params[1] == "true"){
            setPopUpActice(true)
            setSuccess(true)
        } 
        if(params[1] == "false"){
            setPopUpActice(true)
            setSuccess(false)     
        }

    },[])

    return(
        <>
        
        <div className=" h-screen bg-primary text-secondary font-poppins p-16 items-center flex ">
            {popUpActive ? <Popup setActive={setPopUpActice} success = {success}></Popup>: null}
           
            <motion.div 
            initial={{
                opacity: 0,
                scale: 0,
                hidden: "true"
            }}
            whileInView={{
                x: 0,
                y: 0,   
                rotate: 0,
                opacity: 1,
                scale: 1
            }}
            transition={{
                duration: 2,
                type:"spring",
                damping: 10,
                stiffness: 20,  
            }}
            viewport={{ once: true }}
            className=" grid-cols-5 grid gap-4 justify-center items-center">
                <div className="flex col-span-1 flex-col gap-8 justify-center items-center">
                    {
                    Photos.map((photo, index)=>{
                        return(
                            selected == photo ?(
                                <div>
                                    <img src={photo} className="w-[50px] h-[50px] bg-complementary object-cover opacity-50"></img>
                                    {/* <FontAwesomeIcon className="absolute my-auto mx-auto top-0 bottom-0 " icon={faCheck}></FontAwesomeIcon> */}
                                </div>
                            ):(
                                
                                <img onClick={()=>setSelected(photo)} src ={photo} className="w-[50px] h-[50px] bg-complementary object-cover hover:cursor-pointer"></img>
                                    
                                
                            )
                        )
                        
                    })
                    }
                

                </div>
                <img src={selected} className="flex self-center col-span-2 h-[500px] w-[300px] bg-complementary object-cover">

                </img>
                <div className="flex flex-col justify-center col-span-2 gap-6 relative">
                    <div className="tags flex gap-4 ">
                        <h1 className="bg-complementary p-2 px-4 inline-block rounded-full justify-center items-center text-primary font-bold">House Party</h1>
                        <h1 className="bg-complementary p-2 inline-block rounded-full justify-center items-center text-primary font-bold">10:00PM</h1>

                    </div>
                    
                    <h1 className=" font-bold text-6xl">Test Ticket</h1>
                    <h3 className="text-md">kaanthepro3</h3>
                    <h3 className="text-3xl font-thin text-opacity-50 line-clamp-3 tracking-widest"> ${price*quantity}<span className="text-sm tracking-normal">x{quantity}</span></h3>
                    <h1 className=" tracking-wider">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat repellat quod fuga magni voluptates impedit at numquam rerum dolorum nulla, excepturi maiores, modi expedita veritatis! Blanditiis eligendi necessitatibus nulla minus, ipsum fugit nesciunt nam.</h1>
                    <div className="flex gap-8 items-center justify-first">
                        <FontAwesomeIcon onClick={()=>changeQuantity(-1)}  className="text-xl hover:text-primary hover:bg-complementary duration-300 p-2 border-2 border-secondary border-opacity-10 bg-primary items-center justify-center" icon={faMinus}></FontAwesomeIcon>
                        <h3 className="text-xl">{quantity}</h3>
                        <FontAwesomeIcon onClick={()=>changeQuantity(1)} className="text-xl hover:text-primary hover:bg-complementary duration-300 p-2 border-2 border-secondary border-opacity-10   bg-primary items-center justify-center" icon={faPlus}></FontAwesomeIcon>
                        <button className=" w-[250px] h-[65px] bg-complementary text-xl text-primary font-bold rounded-sm duration-500 hover:scale-110 hover:bg-complementary2 hover:text-primary   " onClick={handlePurchase}>PURCHASE</button>
                    </div>
                    
                    
                </div>
                
            </motion.div>
        </div> 
        </>
    )
}