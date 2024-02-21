// import QrReader from 'react-qr-scanner';
// import { } from "react-qr-scanner"
// import QrReader from 'react-qr-scanner'
import {QrScanner} from '@yudiel/react-qr-scanner';


export default function Scanner(){

    

    const handleDecode = (data)=>{
        console.log(data)
    }
    const handleError = err => {
        alert(err);
    }

    

    return(

        <div className="flex flex-col gap-8 w-[35%] py-48">
            <h1 className="text-5xl font-bold">Scanner</h1>
            {/* <QrScanner onError={handleError} delay ={300} onDecode={handleDecode}/> */}
            


        </div>

        
    )
}