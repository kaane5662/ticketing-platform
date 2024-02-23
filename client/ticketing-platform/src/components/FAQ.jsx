import { motion } from "framer-motion";
import Question from "./Question";

export default function FAQ(){
    return(
        <main name = "FAQ" className="bg-primary p-32 min-h-screen max-md:px-4  ">
            <div className="flex flex-col gap-8">
                <h1 className="font-bold text-secondary text-5xl text-center max-md:text-4xl"><span className="text-complementary">FAQ</span></h1>
                <motion.div 
                initial={{
                    scale: 0,
                    hidden: "true",
                    opacity: 0
                }}
                whileInView={{
                    x: 0,
                    opacity: 1,
                    scale: 1
                }}
                transition={{
                    duration: .5,
                    type:"spring",
                    damping: 10,
                    stiffness: 20
                }}
                viewport={{ once: false }}
                className="flex flex-col gap-8 items-center justify-center">
                    <Question question={"How do I use SwftT?"} answer={"Once you SignUp there will be a tutorial for that. Also, feel free to request a Demo."}></Question>
                    <Question question={"What are the benefits of using SwftT?"} answer={"We help you focus on hosting the best event while leaving the payment stress to us."}></Question>
                    <Question question={"What percentage of earnings will SwftT take?"} answer={"SwftT takes 0% of your ticket sales."}></Question>
                    <Question question={"How will I get Paid?"} answer={"Powered by Stripe. You are able to connect your bank account and cashout whenever you want."}></Question>
                    <Question question={"I have more questions!!!"} answer={"Feel free to send us an email."}></Question>
                </motion.div>
                
            </div>
        </main>
    )
}

