import { faDollarSign, faL, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import PlaceAutocomplete from "../components/PlaceAutocomplete";


export default function CreateTicket(){
    const [selectedFiles, setSelectedFiles] = useState([])
    const [tags, setTags] = useState([])
    const [eventIcon, setEventIcon] = useState()
    const [EventConstants, setEventConstants] = useState({})
    const navigate = useNavigate()
    // const filesRef = useRef([])
    const generateTicket = (e)=>{
        e.preventDefault()
        // console.log(e.target.files.value)
        const formData = new FormData(e.currentTarget)
        formData.delete("event_images")
        Array.from(selectedFiles).forEach((selectedFile, index)=>{
            formData.append("event_images", selectedFile)
        })
        formData.delete("tags")
        Array.from(tags).forEach((tag, index) => {
            // console.log(tag)
            formData.append(`tags`, tag);
        });
        
        // console.log(formData.get("event_images"))
        console.log(formData.get("tags"))
        axios.post(`${import.meta.env.VITE_SERVER}/tickets`,formData,{
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            console.log("Ticket created successfully")
        }).catch((error)=>{
            console.log(error)
        })
        
        // console.log(e.currentTarget)

    }

    const checkAuthority = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/create`).then((response)=>{
            console.log(response.data.EventTypes)

            setEventConstants(response.data)
        }).catch((error)=>{
            error.response.data?.url ? navigate(error.response.data.url) : null
            console.log(error.response.data.url)
        })
    }


    const handleFileChange = (event) => {

        
        // const files = event.target.files;
        if (selectedFiles.length >= 7) {
        alert("You can upload a maximum of 7 files.");
        return;
        }
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    const handleRemoveFile = (fileToRemove) => {    
        const updatedFiles = selectedFiles.filter(file => file !== fileToRemove);
        setSelectedFiles(updatedFiles);
    };


    useEffect(()=>{
        checkAuthority()
    },[])

    return(
        <main className=" bg-primary text-secondary font-poppins min-h-screen">
            <form onSubmit={generateTicket} className=" py-32 px-48 flex flex-col gap-8">
                <h1 className="text-5xl font-bold"><span className="text-complementary">Create</span> Event</h1>
                <h3 className="text-lg -mb-4">Event title</h3>
                <input name="title" placeholder="Enter event title" className="text-primary h-[50px] bg-secondary w-[100%] rounded-sm p-2"></input>
                <div className="flex gap-8">
                    <div className="flex-col flex gap-8">
                        <h3 className="text-lg -mb-4">Price</h3>
                        <div className="price flex">
                            <div className="h-[50px] flex justify-center items-center border-complementary w-[50px] bg-complementary ">
                                <FontAwesomeIcon className="text-primary h-5" icon={faDollarSign}></FontAwesomeIcon>
                            </div>
                            <input name="price" placeholder="Enter price" type="number" step="0.01" min="0.01" className="h-[50px] w-[200px] p-2 bg-secondary text-primary"></input>
                        </div>
                    </div>
                    <div className="flex-col flex gap-8">
                        <h3 className="text-lg -mb-4">Stock</h3>
                        <div className="price flex">
                        <div className="h-[50px] flex justify-center items-center border-complementary w-[50px] bg-complementary ">
                        <FontAwesomeIcon className="text-primary h-5" icon={faTicket}></FontAwesomeIcon>
                        </div>
                        <input name="stock" placeholder="Enter stock" type="number" step="1" min="1" className="h-[50px] w-[200px] p-2 bg-secondary text-primary"></input>
                </div>

                    </div>
                </div>
                
                
                <h3 className="text-lg -mb-4">Event description</h3>
                <textarea name="description" placeholder="Enter event description" className="text-primary h-[200px] bg-secondary w-[100%] rounded-sm p-2"></textarea >
                {/* event date, time, and settings */}
                <div className="flex justify-between">
                    <div className="flex flex-col gap-3 w-[25%]">
                        <h3 className="text-lg">Date</h3>
                        <input name="date" placeholder="XX/XX/XXXX" type="date" className="w-[100%] p-2 h-[50px] bg-secondary text-primary"></input>
                    </div>
                    <div className="flex flex-col gap-3 w-[25%]">
                        <h3 className="text-lg">Start Time</h3>
                        <input name="start_time" type="time" placeholder="X:XX" className="w-[100%] p-2 h-[50px] bg-secondary text-primary"></input>
                    </div>
                    <div className="flex flex-col gap-3 w-[25%]">
                        <h3 name="end_time" className="text-lg">End Time</h3>
                        <input type="time" placeholder="hrs" className="w-[100%] p-2 h-[50px] bg-secondary text-primary"></input>
                    </div>
                </div>
                
                <PlaceAutocomplete/>

                
                    
                <h3 className="text-lg -mb-4">Event type</h3>
                <select className="text-primary h-[50px] bg-secondary w-[250px] rounded-sm p-2" name="event_type">
                    {EventConstants?.EventTypes?.map((eventType, index)=>{
                        return(

                            <option value={eventType} key={index} className="">{eventType}</option>
                        )
                    })}
                </select>
                    
                    
                <h3 className="text-lg -mb-4">Event tags</h3>
                <div className="flex gap-8 flex-wrap">
                    {tags.map((tag, index)=>{
                        return (
                            <button onClick={()=> setTags(tags.filter(tempTag=>tag != tempTag))} key={index} className="w-fit px-4 py-2 h-fit bg-complementary hover:bg-red-500 hover:scale-105 duration-300 rounded-full text-primary">{tag}</button>
                        )
                    })}
                </div>
                <input onKeyDown={(e)=> {if(e.key == " "|| e.key == "Enter") {setTags([...tags, e.target.value]); e.target.value = ""} }} className="text-primary h-[50px] w-[100%] bg-secondary rounded-sm p-2 border-r-4 border-r-complementary" name="tags">
                </input>
            
                
                


                <h3 className="text-lg -mb-4">Event icon</h3>
                <div className="w-[700px] bg-secondary bg-opacity-10 rounded-sm overflow-hidden h-[500px] relative">
                    <img src={eventIcon? URL.createObjectURL(eventIcon):""} className="w-[700px] h-[500px] object-scale-down"></img>
                    <input name="event_icon" className="absolute bottom-2 left-2" onChange={(e)=>setEventIcon(e.target.files[0])} multiple={false} type="file"></input>
                </div>
              


                <h3 className="text-lg -mb-4">Event images</h3>
                <div className="flex flex-wrap gap-12 justify-center">
                    {selectedFiles.map((selectedFile, index)=>{
                        return(
                            <div key={index} className="w-[300px] h-[300px] relative">
                                <img src={URL.createObjectURL(selectedFile)} className="w-[300px] h-[300px] object-cover"></img>
                                <h3 className="absolute max-w-[50%] top-2 left-2">{selectedFile.name}</h3>
                                <button onClick={()=>handleRemoveFile(selectedFile)} className="w-8 h-8 hover:scale-105 duration-300 bg-complementary text-primary text-lg font-bold rounded-sm absolute right-2 top-2">X</button>
                            </div>
                        )
                    })}
                </div>
                <input type="file" accept=".jpg, .jpeg, .png" multiple={true} onChange={handleFileChange} />
                <button className="bg-complementary hover:scale-105 duration-300  text-primary h-[65px] w-[300px] text-lg font-bold rounded-sm" type="submit">Create Ticket ></button>
                
            </form>
            
        </main>
    )
}