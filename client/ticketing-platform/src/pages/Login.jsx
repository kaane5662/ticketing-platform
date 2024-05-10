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
            <form onSubmit={signIn} className="w-[40%] max-md:w-[98%] gap-6 flex flex-col rounded-sm  p-12 max-md:px-4">
                <h1 className="text-5xl font-bold text-center">Log in</h1>
                <h3 className="text-sm text-opacity-50 text-secondary -mb-4">Email</h3>
                <input placeholder="Enter your email..." name="email" className="w-[100%] bg-secondary bg-opacity-5 p-3 border-secondary  border-opacity-10 rounded-lg text-md max-md:text-sm"></input>
                <h3 className="text-sm  text-secondary text-opacity-50 -mb-4">Password</h3>
                <input type="password" placeholder="Enter your email..." name="password" className="w-[100%] bg-secondary bg-opacity-5 p-3 border-secondary  rounded-lg border-opacity-10 text-md max-md:text-sm"></input>
                <h3 className="text-sm text-right"><Link className="underline hover:text-complementary" to="/forgotpassword">Forgot Password</Link></h3>
                <button type="submit" className=" bg-complementary bg-gradient-to-br from-complementary to to-complementary2 hover:opacity-80 duration-300 text-primary p-4 rounded-lg font-bold text-xl max-md:p-3 max-md:text-lg  self-center w-full">Sign In</button>
                <h3 className="text-sm text-center">Don't have an account? <Link className="underline hover:text-complementary" to="/signup">Sign Up</Link></h3>
            </form>
        </main>
    )
}