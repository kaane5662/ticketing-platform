import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import "./index.css"
import BoardSeller from "./pages/BoardSeller"
import CheckIn from "./pages/CheckIn"
import CheckSeller from "./pages/CheckSeller"
import CreateTicket from "./pages/CreateTicket"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Scan from "./pages/Scan"
import SellerSignUp from "./pages/SellerSignUp"
import SignUp from "./pages/SignUp"
import Ticket from "./pages/Ticket"
import VerifySeller from "./pages/VerifySeller"

export default function App() {
  return (
    <>
    
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path = "/" Component={Landing}></Route>
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


