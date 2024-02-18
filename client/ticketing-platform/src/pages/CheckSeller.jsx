import { faCircle, faCircleNotch, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


export default function CheckSeller(){
    const navigate = useNavigate()
    const getDashboard = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/check`).then((response)=>{
            navigate(response.data.url)
        }).catch((error)=>{
            console.log(error)
        })
    }


    useEffect(()=>{
        getDashboard()
    })

    return(
        <main className=" bg-primary text-secondary h-screen flex justify-center items-center font-poppins">
            <div className="flex justify-center flex-col gap-6">
                <FontAwesomeIcon className="h-24" spin icon={faCircleNotch}></FontAwesomeIcon>
                <h1 className="text-2xl animate-bounce">Checking Requirements</h1>
            </div>
        </main>
    )
}