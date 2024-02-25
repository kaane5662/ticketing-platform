import { useRef, useState } from "react";
import axios from "axios";

export default function PlaceAutocomplete({original}){

    const [places, setPlaces] = useState([])
    const [togglePlaces, setTogglePlaces] = useState(false)
    const placesRef = useRef()
    const cancelToken = useRef(null); 
    let response;

    const handleAddress = async (e)=>{
        if (cancelToken.current) {
            cancelToken.current.cancel('Request canceled by the user');
        }
        try {
            setPlaces([])
            cancelToken.current = axios.CancelToken.source();
            response = await axios.get(
              `https://nominatim.openstreetmap.org/search?q=${e.target.value}&format=json`,
              {   }
            );
            // console.log(response.data)
            setPlaces(response.data);
          } catch (error) {
            console.error('Error fetching addresses:', error);
          } finally {
            
          }
    }

    const setAddress = async (address)=>{
        console.log(placesRef.current.value)
        placesRef.current.value = address
        setTogglePlaces(false)
    }

    return (
        
        <div className="relative flex flex-col gap-8">

            <h3 className="text-md -mb-4">Event address</h3>
            <input defaultValue={original} ref={placesRef}  onFocus={()=> setTogglePlaces(true)} onChange={handleAddress} name="address" placeholder="Enter address" className="text-secondary h-[45px] bg-secondary bg-opacity-0 border-2 border-secondary border-opacity-20  w-[100%] rounded-sm p-2"></input>
            { places.length > 0? 

                <div className="flex flex-col absolute top-[100%] w-[100%] z-30 overflow-hidden">
                    { togglePlaces?  places.map((place,index)=>{
                        return(
                            <option onClick={()=>setAddress(place.display_name)} className="bg-secondary h-[45px] text-primary p-2  hover:bg-complementary hover:cursor-pointer hover:duration-300 items-center flex " key={index}  value={place.display_name}>{place.display_name   }</option>
                        )
                    }) : null }
                </div>
                : <h3 className="bg-secondary text-primary p-4  ">Loading...</h3>
            }
        </div>
        
    )
}