import axios from "axios"
import { motion, stagger } from "framer-motion"
import Success from "../components/Success"
import Failure from "../components/Failure"
import { useEffect, useState } from "react"
import Popup from "../components/Popup"


export default function Dashboard(){

    const [popUpActive, setPopUpActice] = useState(false)
    const [success, setSuccess] = useState(false)

    const handlePurchase = ()=>{
        axios.post("http://localhost:3000/purchase").then((response)=>{
            console.log(response.data)
            window.location.replace(response.data.url)
        }).catch((error)=>{
            console.log(error)
        })
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
        {popUpActive ? <Popup setActive={setPopUpActice} success = {success}></Popup>: null}
        <div className=" h-screen bg-primary text-secondary font-poppins p-8 ">
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
            className="text-center flex flex-col gap-4 justify-center items-center">
                <h3 className="text-2xl font-thin text-opacity-50">$25.00</h3>
                <h1 className=" font-bold text-6xl">Ticket</h1>
                <img className="w-[325px] h-[325px] object-scale-down" src="ticket-image.png"></img>
                <button className=" w-[300px] h-[65px] bg-complementary text-xl font-bold rounded-sm duration-500 hover:scale-110 hover:bg-secondary hover:text-primary  " onClick={handlePurchase}>PURCHASE</button>
            </motion.div>
        </div> 
        </>
    )
}