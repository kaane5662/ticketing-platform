import axios from "axios"

export default function VerifySeller(){

    const verify = ()=>{
        axios.post(`${import.meta.env.VITE_SERVER}/seller/verify`).then((response)=>{
            window.location.href = response.data.url
        }).catch((error)=>{
            console.log(error)
        })
    }

    return(
        <main className=" bg-primary h-screen text-secondary flex items-center   font-poppins">
            <div className="flex p-32 flex-col max-w-[60%] gap-8">
                <h3 className="text-6xl font-bold">Verification</h3>
                <h3 className="text-xl">To start selling on our platform securely and meet regulatory standards, we need some extra information to confirm your identity. This is just a standard step to make sure everything stays safe and reliable for everyone.</h3>
                <button onClick={verify} className="font-bold hover:scale-105 duration-300 rounded-sm h-[60px] w-[230px] text-primary bg-complementary text-md">Verify Identity ></button>
            </div>
            <div className="flex w-[30%] h-[70%]">
                <img className=" object-cover rounded-md" src="/verification.png"></img>
            </div>
        </main>
    )
}