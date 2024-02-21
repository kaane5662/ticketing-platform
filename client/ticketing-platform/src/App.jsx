import {BrowserRouter, Routes, Route} from "react-router-dom"
import "./index.css"
import CheckIn from "./pages/CheckIn"
import Navbar from "./components/Navbar" 
import SignUp from "./pages/SignUp" 
import Login from "./pages/Login"
import SellerSignUp from "./pages/SellerSignUp"
import CheckSeller from "./pages/CheckSeller"
import VerifySeller from "./pages/VerifySeller"
import BoardSeller from "./pages/BoardSeller"
import CreateTicket from "./pages/CreateTicket"
import Ticket from "./pages/Ticket"
import Scan from "./pages/Scan"

export default function App() {
  return (
    <>
    
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path = "/ticket/:id" Component={Ticket}></Route>
        <Route path = "/checkIn" Component={CheckIn}></Route>
        <Route path = "/signup" Component={SignUp}></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/seller/join" Component={SellerSignUp}></Route>
        <Route path="/checkseller" Component={CheckSeller}></Route>
        <Route path="/seller/verify" Component={VerifySeller}></Route>
        <Route path="/seller/boarding" Component={BoardSeller}></Route>
        <Route path = "/seller/create" Component={CreateTicket  }></Route>
        <Route path = "/scan/:id" Component = {Scan}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}


