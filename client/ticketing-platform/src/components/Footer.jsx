import { Link } from "react-scroll"

export default function Footer(){
    return(
        <main className="bg-primary font-outfit">
            <div className="flex gap-8 justify-around max-md:p-10 px-32 py-16 border-t-2 border-secondary border-opacity-20 max-md:gap-2">
                <div className=" flex flex-col gap-6 max-md:gap-2">
                    <h1 className="text-2xl text-secondary max-md:text-lg">Explore</h1>
                    <Link to = "Home" smooth = {true} duration = {500} className="text-lg text-secondary text-opacity-50 hover:cursor-pointer hover:text-secondary duration-100 max-md:text-md max-md:text-sm">Home</Link>
                    <Link to = "Footer" smooth = {true} duration = {500} className="text-lg text-secondary text-opacity-50 hover:cursor-pointer max-md:text-sm hover:text-secondary duration-100">Footer</Link>
                    <Link to="About1" smooth = {true} duration = {500} className="text-lg text-secondary text-opacity-50 hover:cursor-pointer hover:text-secondary duration-100 max-md:text-sm">About1</Link>
                </div>
                <div className=" flex flex-col gap-6 max-md:gap-2">
                    <h1 className="text-2xl text-secondary max-md:text-lg">Socials</h1>
                    <a href="https://www.instagram.com/SwftT.inc/" className="text-lg text-secondary text-opacity-50 hover:underline hover:text-complementary max-md:text-sm">Instagram</a>
                </div>
                <div className=" flex flex-col gap-6 max-md:gap-2">
                    <h1 className="text-2xl text-secondary max-md:text-lg">Support</h1>
                    <Link to="FAQ" smooth = {true} duration = {500} className="max-md:text-sm text-lg text-secondary text-opacity-50 hover:cursor-pointer hover:text-secondary duration-100">FAQ</Link>
                </div>
                <div className=" flex flex-col gap-8 max-md:gap-2">
                    <img src="flourishspelledout.png" className=" h-40 -mt-12 max-md:mt-0 max-md:h-12 text-complementary font-bold max-md:object-scale-down"></img>
                    <h3 className="text-lg max-md:text-sm text-secondary text-opacity-50">© 2024 SwftT LLC. All Rights Reserved</h3>
                </div>
            </div>
        </main>
    )
}