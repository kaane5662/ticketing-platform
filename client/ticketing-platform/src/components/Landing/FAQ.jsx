import { faDashboard, faEdit, faQrcode, faTicketAlt, faVolumeTimes } from "@fortawesome/free-solid-svg-icons";
import Service from "./Service";
import Question from "./Question";

export default function FAQ(){
    return(
        <main className=" min-h-screen bg-primary text-secondary font-poppins flex justify-center items-center w-[100%]">
            <div className = "p-32 max-lg:px-0 gap-12 flex items-center justify-center ">
                <div className="flex flex-col gap-8">
                    <h1 className="text-5xl font-bold text-center max-lg:text-4xl">You have a <span className="text-complementary">Question?</span> </h1>
                    <div className="flex flex-col gap-4 ">
                        <Question question={"How do I join as a seller?"} answer={"Just sign up with an account on our platform and then follow the boarding instructions when you click Switch to Seller."}></Question>
                        <Question question={"What do I need to join as a seller?"} answer={"A valid SSN is required for identification purposes, and to facilitate transactions, you will need either a banking account or a debit/credit card. However, please note that we do not store your SSN within our system for security reasons."}></Question>
                        <Question question={"What are the benefits of using SwftT?"} answer={"We help you focus on hosting the best event while leaving the payment stress to us."}></Question>
                        <Question question={"What percentage of my earnings will SwftT take?"} answer={"SwftT takes 0% of your ticket sales. Processing fees are added on top of the total transaction for the buyer.   "}></Question>
                        <Question question={"How will I get Paid?"} answer={"Powered by Stripe. You are able to connect your bank account and cashout whenever you want."}></Question>
                    </div>

                </div>

                {/* <div className="w-[50%] h-[400px] bg-secondary">
                    <img className="w-["></img>

                </div> */}
            </div>
        </main>
    )
}