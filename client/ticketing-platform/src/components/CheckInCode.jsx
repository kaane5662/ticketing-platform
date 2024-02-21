export default function CheckInCode({checkCode, setCode}){
    return(

        <div className="flex flex-col gap-4 py-48">
            <h1 className="text-5xl font-bold">Enter check-in code</h1>
            <h1 className="text-lg">Input the code to efficiently check users in and grant access to their tickets.</h1>
            <input onChange={(e)=>setCode(e.target.value)} className=" rounded-lg h-[75px] font-bold text-primary tracking-wide text-2xl text-center"></input>
            <button onClick={checkCode} className=" bg-complementary rounded-xl  my-5 h-[70px] text-xl hover:scale-105 duration-300 text-primary font-bold">Check In ></button>
        </div>
    )
}