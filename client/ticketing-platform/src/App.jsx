import {BrowserRouter, Routes, Route, useLocation, useRoutes} from "react-router-dom"
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
import SellerSidebar from "./components/SellerSidebar"
import SellerCheckout from "./pages/SellerCheckout"
import SellerTransactions from "./pages/SellerTransactions"
import SellerTickets from "./pages/SellerTickets"
import TicketDashboard from "./pages/TicketDashboard"
import SellerTicketStats from "./pages/SellerTicketStats"
import SellerDashboard from "./pages/SellerDashboard"
import NotFound from "./pages/NotFound"
import Landing from "./pages/Landing"
import TOS from "./pages/TOS"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

export default function App() {
  // const location = useLocation()
 
  // const routes = useRoutes([
  //   {
  //     path: '/seller/*',
  //     element: <SellerSidebar />
  //   },
  //   {
  //     path: '*',
  //     element: <Navbar />
  //   }
  // ])
  return (
    <>
    
    <BrowserRouter>
      {/* <Navbar></Navbar> */}
      
      {/* {location.pathname.startsWith('/seller') ? <SellerSidebar></SellerSidebar> : <Navbar></Navbar>
        
          
        } */}

      {/* {routes} */}
      <Routes>
        
        <Route path="*" Component={Navbar} />
        <Route path="/seller/*" Component={SellerSidebar} />
        <Route path="/scan/*" />
        
        {/* <Route path = "/ticket/:id" Component={Ticket}></Route>
        <Route path="/tickets" Component={TicketDashboard}></Route>
        <Route path = "/checkIn" Component={CheckIn}></Route>
        <Route path = "/signup" Component={SignUp}></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/join" Component={SellerSignUp}></Route>
        <Route path="/checkseller" Component={CheckSeller}></Route>
        <Route path="/verify" Component={VerifySeller}></Route>
        <Route path="/boarding" Component={BoardSeller}></Route>
        <Route path = "/seller/create" Component={CreateTicket  }></Route>
        <Route path = "/scan" Component = {Scan}></Route>
        <Route path="/seller/checkout" Component={SellerCheckout}></Route>
        <Route path="/seller/transactions" Component={SellerTransactions}></Route>
        <Route path="/seller/tickets" Component={SellerTickets}></Route>
        <Route path="/seller/ticket/:id" Component={SellerTicketStats}></Route> */}
        
        

      </Routes>
      <Routes>
      <Route path="*" Component={Navbar} />
        <Route path="/" Component={Landing}></Route>
        <Route path="/seller/*" Component={SellerSidebar} />
        <Route path = "/ticket/:id" Component={Ticket}></Route>
        <Route path="/tickets" Component={TicketDashboard}></Route>
        <Route path="/forgotpassword" Component={ForgotPassword}></Route>
        <Route path="/resetpassword" Component={ResetPassword}></Route>
        {/* <Route path = "/checkIn" Component={CheckIn}></Route> */}
        <Route path = "/signup" Component={SignUp}></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/join" Component={SellerSignUp}></Route>
        <Route path="/checkseller" Component={CheckSeller}></Route>
        <Route path="/verify" Component={VerifySeller}></Route>
        <Route path="/boarding" Component={BoardSeller}></Route>
        <Route path = "/seller/create" Component={CreateTicket  }></Route>
        <Route path = "/scan" Component = {Scan}></Route>
        <Route path="/legal/tos" Component={TOS}></Route>
        {/* <Route path="/seller/dashboard" Component={SellerDashboard}></Route> */}
        {/* <Route path="/seller/checkout" Component={SellerCheckout}></Route> */}
        <Route path="/seller/transactions" Component={SellerTransactions}></Route>
        <Route path="/seller/tickets" Component={SellerTickets}></Route>
        <Route path="/seller/ticket/:id" Component={SellerTicketStats}></Route>
        <Route path="*" Component={NotFound}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}


