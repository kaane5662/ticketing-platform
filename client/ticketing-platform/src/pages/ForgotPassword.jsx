import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ForgotPassword(){
    
    
    const sendResetEmail = (e)=>{
        e.preventDefault()
        // console.log(e.target.password.value)
        axios.post(`${import.meta.env.VITE_SERVER}/profiles/sendReset`,{
            email: e.target.email.value,
        }).then((response)=>{
            toast.success("Reset Email Sent")
            console.log("Login success")
        }).catch((error)=>{
            console.log(error)
            console.log("Email is invalid")
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })
    }
    

    return(
        <main className=" bg-primary text-secondary h-screen font-poppins flex items-center justify-center">
            <ToastContainer></ToastContainer>
            <form onSubmit={sendResetEmail} className="w-[40%] max-md:w-[98%] gap-6 flex flex-col rounded-sm  p-12 max-md:px-4">
                <h1 className="text-5xl font-bold max-md:text-4xl ">Forgot Password</h1>
                <h3 className="text-md max-md:text-sm text-opacity-50 text-secondary ">Please enter the email address you'd like your password reset information sent to.</h3>
                <h3 className="text-sm text-opacity-50 text-secondary -mb-4">Email</h3>
                <input placeholder="Enter your email..." name="email" className="w-[100%] bg-secondary bg-opacity-5 p-3 border-secondary  border-opacity-10 rounded-lg text-md max-md:text-sm"></input>
                {/* <h3 className="text-sm  text-secondary text-opacity-50 -mb-4">Password</h3> */}
                {/* <input type="password" placeholder="Password" name="password" className="w-[100%] bg-secondary bg-opacity-5 p-3 border-secondary  rounded-lg border-opacity-10 text-md max-md:text-sm"></input> */}
                <button type="submit" className=" bg-complementary bg-gradient-to-br from-complementary to to-complementary2 hover:opacity-80 duration-300 text-primary p-4 rounded-lg font-bold text-xl max-md:p-3 max-md:text-lg mt-4  self-center w-full">Send Email</button>
                <h3 className="text-sm text-center"> <Link className="underline hover:text-complementary" to="/login">Back to Login</Link></h3>
            </form>
        </main>
    )
}