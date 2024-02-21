import { useState } from "react";
import CheckInCode from "../components/CheckInCode";
import Scanner from "../components/Scanner";
import { useParams } from "react-router-dom";

export default function Scan(){
    const [checkedIn, setCheckedIn] = useState(false)
    const [code, setCode] = useState(0)
    const {id} = useParams()

    const checkCode = ()=>{
        console.log(code)
        console.log(id)
        axios.post(`${import.meta.env.VITE_SERVER}/seller/checkin/${id}`).then((response)=>{
            setCheckedIn(true)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const checkInUser = ()=>{
        
    }

    return(
        <main className=" bg-primary h-screen flex justify-center text-secondary font-poppins">
            {checkedIn ? <Scanner></Scanner>:<CheckInCode setCode={setCode} checkCode={checkCode}></CheckInCode>}
            {/* <CheckInCode/> */}
            {/* <Scanner></Scanner> */}
        </main>
    )
}