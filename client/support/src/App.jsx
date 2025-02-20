import {BrowserRouter, Routes, Route, useLocation, useRoutes} from "react-router-dom"
import "./index.css"
import Login from "./pages/Login"
import Verify from "./pages/Verify"
import User from "./pages/User"
import Users from "./pages/Users"



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
        
        <Route Component={Login} path="/login"></Route>
        <Route Component={Verify} path="/verify"></Route>
        <Route Component={User} path="/users/:id"></Route>
        <Route Component={Users} path="/"></Route>
        
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
      
    </BrowserRouter>
    </>
  )
}


