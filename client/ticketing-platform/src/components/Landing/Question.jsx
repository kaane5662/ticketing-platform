import { faCaretDown, faCaretUp, faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Question({question, answer}){

    const [isOpen, toggleDropdown] = useState(false)
    return(
        <div className=" w-[600px] max-lg:w-[430px] font-poppins max-lg:p-4 p-6 bg-secondary bg-opacity-0 rounded-xl border-2 border-secondary border-opacity-20 ">
            <div onClick={()=>toggleDropdown(!isOpen)} className="w-[100%] flex cursor-pointer  items-center text-secondary  rounded-md  max-md:text-lg text-center gap-4 ">
                <h1 className=" text-lg font-semibold ">{question}</h1> 
                <FontAwesomeIcon icon={ isOpen ? faCaretUp: faCaretDown}></FontAwesomeIcon>
            </div>

            {isOpen && (
                <div className="py-4 rounded-xl">
                    <h3 className="text-secondary text-lg text-opacity-50 max-md:text-sm ">{answer}</h3>
                    
                </div>
            )}
        </div>
    )
}