import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function SignUp(){

    const navigate = useNavigate()
    const createAccount = (e)=>{
        e.preventDefault()
        // console.log(e.target.password.value)
        axios.post(`${import.meta.env.VITE_SERVER}/profiles`,{
            email: e.target.email.value,
            password: e.target.password.value,
            confirmpassword: e.target.confirmpassword.value
        }, {withCredentials:true}).then((response)=>{
            toast.success("Account created successfully")
            console.log("Login success")
            navigate("/tickets")
            window.location.reload()
        }).catch((error)=>{
            console.log(error)
            // console.log("Ticket is invalid")
            toast.error(error.response?.data?.message || "An unexpected error has occured   ")
        })
    }

    return(
        <main className=" bg-primary text-secondary min-h-screen font-poppins flex justify-center">
            <ToastContainer></ToastContainer>
            <form onSubmit={createAccount} className="w-[40%] gap-6 my-16 flex flex-col rounded-sm  p-12 max-lg:w-[98%] max-lg:p-4">
                <h1 className="text-5xl font-bold text-center max-md:text-4xl">Create Account</h1>
                <h3 className="text-md text-opacity-50 text-secondary max-md:text-sm text-center">Discover and secure your next unforgettable event with us.</h3>
                <h3 className="text-sm -mb-4">Email</h3>
                <input placeholder="Enter your email..." name="email" className="w-[100%] bg-secondary bg-opacity-5 p-3 border-secondary dborder-opacity-10 rounded-lg max-md:text-sm"></input>
                <h3 className="text-sm -mb-4">Password</h3>
                <input type="password" placeholder="Enter your password..." name="password" className="w-[100%] bg-secondary bg-opacity-5  p-3 border-secondary rounded-lg border-opacity-10 max-md:text-sm"></input>
                <h3 className="text-sm   -mb-4">Confirm Password</h3>
                <input type="password" placeholder="Confirm your password..." name="confirmpassword" className="w-[100%] bg-secondary bg-opacity-5  p-3 border-secondary rounded-lg border-opacity-10 max-md:text-sm"></input>
                <h3 className="text-sm">Already have an account? <Link className="underline hover:text-complementary" to="/login">Log In</Link></h3>
                <button type="submit" className=" bg-complementary bg-gradient-to-br from-complementary to to-complementary2 rounded-lg hover:opacity-80 duration-300 text-primary p-4    font-bold text-xl max-md:text-lg max-md:p-3">Sign Up</button>
            </form>
        </main>
    )
}