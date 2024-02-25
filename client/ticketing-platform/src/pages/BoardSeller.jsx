import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BoardSeller(){

    const board = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/boarding`,{withCredentials:true}).then((response)=>{
            window.location.href = response.data.url
        }).catch((error)=>{
            if( error.response.status == 401 || error.response.status == 403) navigate("/login", {replace:true})
            console.log(error)
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })
    }

    return(
        <main className=" bg-primary h-screen text-secondary flex items-center justify-center  font-poppins">
            <ToastContainer></ToastContainer>
            <div className="flex p-32 flex-col max-w-[60%] gap-8">
                <h3 className="text-6xl font-bold">Boarding</h3>
                <h1 className="text-xl">Streamline your payment process with Stripe Connect. Get set up in minutes to securely manage transactions and receive payouts effortlessly. Click below to begin your boarding journey and unlock a world of payment possibilities.</h1>
                <button onClick={board} className="font-bold hover:scale-105 duration-300 rounded-sm h-[60px] w-[230px] text-primary bg-complementary text-md">Start Boarding ></button>
            </div>
            {/* <div className="flex w-[30%] h-[70%]">
                <img className=" object-cover rounded-md" src="/verification.png"></img>
            </div> */}
        </main>
    )
}