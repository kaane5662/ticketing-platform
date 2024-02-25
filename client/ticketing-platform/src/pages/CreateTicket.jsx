import { faDollarSign, faL, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import Ticket from "./Ticket";
import TicketForm from "../components/TicketForm";


export default function CreateTicket(){
    
    return(
        <TicketForm></TicketForm>
    )
}