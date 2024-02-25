import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login(){
    const navigate = useNavigate()
    const signIn = (e)=>{
        e.preventDefault()
        // console.log(e.target.password.value)
        axios.put(`${import.meta.env.VITE_SERVER}/profiles`,{
            email: e.target.email.value,
            password: e.target.password.value
        }, {withCredentials: true}).then((response)=>{
            toast.success("Login Success    ")
            console.log("Login success")
            navigate("/tickets",{replace:true})
            window.location.reload()
        }).catch((error)=>{
            console.log(error)
            console.log("Ticket is invalid")
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })
    }

    return(
        <main className=" bg-primary text-secondary h-screen font-poppins flex items-center justify-center">
            <ToastContainer></ToastContainer>
            <form onSubmit={signIn} className="w-[40%] gap-6 flex flex-col rounded-sm border-secondary border-2 border-opacity-20 p-12 px-18">
                <h1 className="text-5xl font-bold text-center">Login</h1>
                <h3 className="text-sm -mb-4">Email</h3>
                <input placeholder="Enter your email" name="email" className="w-[100%] bg-secondary bg-opacity-0 h-[50px] p-2 border-secondary border-2 border-opacity-10 rounded-sm"></input>
                <h3 className="text-sm -mb-4">Password</h3>
                <input type="password" placeholder="Enter your password" name="password" className="w-[100%] bg-secondary bg-opacity-0  h-[50px] p-2 border-secondary border-2 rounded-sm border-opacity-10"></input>
                <h3 className="text-sm">Don't have an account? <Link className="underline hover:text-complementary" to="/signup">Sign Up</Link></h3>
                <button type="submit" className=" bg-complementary hover:scale-105 duration-300 text-primary h-[70px] rounded-sm font-bold text-xl">Sign In</button>
            </form>
        </main>
    )
}