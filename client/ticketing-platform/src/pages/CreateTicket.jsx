import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function CreateTicket(){
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 7) {
        alert("You can upload a maximum of 7 files.");
        return;
        }
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRemoveFile = (fileToRemove) => {
        const updatedFiles = selectedFiles.filter(file => file !== fileToRemove);
        setSelectedFiles(updatedFiles);
    };
    const [files, setFiles] = useState([])

    return(
        <main className=" bg-primary text-secondary font-poppins min-h-screen">
            <form className=" py-32 px-48 flex flex-col gap-8">
                <h1 className="text-5xl font-bold"><span className="text-complementary">Create</span> Event</h1>
                <h3 className="text-lg -mb-4">Event title</h3>
                <input placeholder="Enter event title" className="text-primary h-[50px] bg-secondary w-[100%] rounded-sm p-2"></input>
                <h3 className="text-lg -mb-4">Price</h3>
                <div className="price flex">
                    <div className="h-[50px] flex justify-center items-center border-complementary w-[50px] bg-complementary ">
                        <FontAwesomeIcon className="text-primary h-5" icon={faDollarSign}></FontAwesomeIcon>
                    </div>
                    <input placeholder="Enter price" type="number" step="0.01" min="0.01" className="h-[50px] w-[200px] p-2 bg-secondary text-primary"></input>
                </div>
                <h3 className="text-lg -mb-4">Event description</h3>
                <textarea placeholder="Enter event description" className="text-primary h-[200px] bg-secondary w-[100%] rounded-sm p-2"></textarea >
                {/* event date, time, and settings */}
                <div className="flex justify-between">
                    <div className="flex flex-col gap-3 w-[25%]">
                        <h3 className="text-lg">Date</h3>
                        <input placeholder="XX/XX/XXXX" type="date" className="w-[100%] p-2 h-[50px] bg-secondary text-primary"></input>
                    </div>
                    <div className="flex flex-col gap-3 w-[25%]">
                        <h3 className="text-lg">Start Time</h3>
                        <input type="time" placeholder="X:XX" className="w-[100%] p-2 h-[50px] bg-secondary text-primary"></input>
                    </div>
                    <div className="flex flex-col gap-3 w-[25%]">
                        <h3 className="text-lg">End Time</h3>
                        <input type="time" placeholder="hrs" className="w-[100%] p-2 h-[50px] bg-secondary text-primary"></input>
                    </div>
                </div>
                
                <h3 className="text-lg -mb-4">Event address</h3>
                <input placeholder="Enter address" className="text-primary h-[50px] bg-secondary w-[100%] rounded-sm p-2"></input>
                
                <h3 className="text-lg -mb-4">Upload images</h3>
                <div className="flex flex-wrap gap-12 justify-center">
                    {selectedFiles.map((selectedFile, index)=>{
                        return(
                            <div className="w-[300px] h-[300px] relative">
                                <img key={index} src={URL.createObjectURL(selectedFile)} className=" object-cover"></img>
                                <h3 className="absolute max-w-[50%] top-2 left-2">{selectedFile.name}</h3>
                                <button onClick={()=>handleRemoveFile(selectedFile)} className="w-8 h-8 hover:scale-105 duration-300 bg-complementary text-primary text-lg font-bold rounded-sm absolute right-2 top-2">X</button>
                            </div>
                        )
                    })}
                </div>
                <input type="file" id="files" className="" name="files" accept=".jpg, .jpeg, .png" multiple onChange={handleFileChange} />
                
                
            </form>
            
        </main>
    )
}