export default function About(){
    return(
        <main className=" min-h-screen bg-primary text-secondary font-poppins flex justify-center items-center">
            <div className = "p-32 max-lg:py-32 max-lg:p-4 gap-12 flex max-lg:flex-col items-center justify-center max-lg:text-center ">
                <div className="flex flex-col gap-8 w-[75%]">
                    <h1 className="text-5xl font-bold">About <span className="text-complementary">Us</span> </h1>
                    <h3 className="text-lg max-lg:text-sm ">Founded in 2024, SwftT is dedicated to revolutionizing the ticketing experience for both organizers and attendees. Our comprehensive platform simplifies event management and ticket sales, empowering organizers to effortlessly create, manage, and promote events of any scale, while providing attendees with a seamless checkout process. Whether you're an organizer aiming to maximize ticket sales or an attendee searching for your next unforgettable experience, SwftT is here to streamline your journey in the world of events. </h3>
                    <button className="rounded-sm hover:scale-105 duration-300 py-4 px-12 bg-complementary w-fit text-primary text-xl font-bold max-lg:self-center">Start Now</button>

                </div>

                {/* <div className="w-[50%] h-[400px] bg-secondary">
                    <img className="w-["></img>

                </div> */}
            </div>
        </main>
    )
}