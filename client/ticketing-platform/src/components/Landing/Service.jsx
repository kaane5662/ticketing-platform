import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {} from "@fortawesome/free-solid-svg-icons"
export default function Service({header,description,icon}){
    return(
        
            <div className="  h-[450px] max-lg:h-[350px] max-lg:p-3 p-8 flex justify-center flex-col gap-4 text-center border-2 border-secondary border-opacity-10 rounded-md ">
                <FontAwesomeIcon className="h-10 max-lg:h-7" icon={icon}></FontAwesomeIcon>
                <h1 className=" border-b-2 p-4 border-complementary text-xl font-bold max-lg:text-lg ">{header}</h1>
                <h3 className="text-md max-lg:text-sm ">{description}</h3>
            </div>
       
    )
}