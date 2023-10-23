import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { motion, useAnimationControls } from "framer-motion"
import { useState } from "react"

export default function Popup({setActive, success}){

    const closeAnimation = useAnimationControls()
    const handleClose = async ()=>{
        await closeAnimation.start({scale: 0.25, opacity: 0})
        setActive(false)
    }

    return (
        <motion.div 
            initial={{
                opacity: 1,
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
                stiffness: 20
            }}
            animate = {closeAnimation}
            viewport={{ once: true }} className="absolute left-0 right-0 ml-auto mr-auto w-[400px] bg-secondary p-8 flex flex-col gap-8 justify-center items-center text-primary font-poppins rounded-sm z-10">
            <FontAwesomeIcon className=" h-32    text-complementary" icon={success ? faCircleCheck: faCircleXmark} beatFade></FontAwesomeIcon>
            <h1 className="font-bold text-2xl text-center">{success ? "Successful Checkout": "Payment Unsucessful"}</h1>
            <h3 className=" text-lg text-center">{success ? "Thank you. A confirmation message has been sent to your email.": "Sorry. Your payment was not processed successfully."}   </h3>
            <button onClick={handleClose} className="font-bold w-[225px] hover:scale-110 duration-500 h-[65px] bg-complementary text-secondary rounded-sm">CLOSE</button>
        </motion.div>
    )
}