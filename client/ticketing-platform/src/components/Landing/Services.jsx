import { faDashboard, faEdit, faQrcode, faTicketAlt, faVolumeTimes } from "@fortawesome/free-solid-svg-icons";
import Service from "./Service";

export default function Services(){
    return(
        <main className=" min-h-screen bg-primary text-secondary font-poppins flex justify-center items-center">
            <div className = "p-32 max-lg:px-4 gap-12 flex items-center justify-center ">
                <div className="flex flex-col gap-8">
                    <h1 className="text-5xl max-lg:text-4xl font-bold">Our <span className="text-complementary">Services</span> </h1>
                    <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-4">
                        <Service header={"Seller Dashboard with Stripe Express Integration"} description={"Take charge of your ticket sales effortlessly with SwftT's seller dashboard integrated with Stripe Express for seamless financial management."} icon={faDashboard}></Service>
                        <Service header={"QR Code Scanner for Ticket Validation"} description={"Ensure smooth event check-ins by quickly and accurately validating tickets at the door, providing a seamless experience for attendees."} icon={faQrcode}></Service>
                        <Service header={"Edit Tickets with Ease"} description={"Correct errors and update event details effortlessly with SwftT's flexible ticket editing feature, providing peace of mind for organizers."} icon={faEdit}></Service>
                        <Service header={"Comprehensive Ticket Management"} description={"Manage every aspect of your tickets, from stock levels to venue details, with SwftT's intuitive UI, ensuring a flawless event experience."} icon={faTicketAlt   }></Service>
                    </div>

                </div>

                {/* <div className="w-[50%] h-[400px] bg-secondary">
                    <img className="w-["></img>

                </div> */}
            </div>
        </main>
    )
}