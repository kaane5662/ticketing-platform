import {Link} from "react-router-dom"

export default function Intro(){
    return(
        <main className=" min-h-screen bg-primary text-secondary font-poppins flex justify-center items-center">
            <div className = "p-32 max-lg:py-32 max-lg:p-4 gap-12 max-lg:flex-col-reverse flex items-center justify-center max-lg:text-center ">
                <div className="flex flex-col gap-8 w-[50%] max-lg:w-[100%] max">
                    <h1 className="text-5xl font-bold max-lg:text-3xl">Maximize Your Reach, Maximize Your Profit: Sell Your Tickets with Ease on <span className="text-complementary">SwftT</span> </h1>
                    <h3 className="text-lg ">A comprehensive ticketing platform designed to simplify the selling process for event organizers and enhance the buying experience for attendees. </h3>
                    <Link to="/login"  className="rounded-sm hover:scale-105 duration-300 py-4 px-20 bg-complementary w-fit text-primary text-xl font-bold max-lg:self-center">Start Now</Link>

                </div>

                <div className="w-[50%] max-lg:w-[100%] h-[400px] max-lg:h-[200px]   rounded-md overflow-clip bg-secondary">
                    <img src="concert4.jpg" className="max-lg:h-[200px] max-lg:w-[100%] object-fill"></img>

                </div>
            </div>
        </main>
    )
}