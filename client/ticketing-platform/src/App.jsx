import {BrowserRouter, Routes, Route} from "react-router-dom"
import "./index.css"
import Dashboard from "./pages/Dashboard"
import CheckIn from "./pages/CheckIn"
import Navbar from "./components/Navbar" 
import SignUp from "./pages/SignUp" 

function App() {
  return (
    <>
    <Navbar></Navbar>
    <BrowserRouter>
      <Routes>
        <Route exact path = "/" Component={Dashboard}></Route>
        <Route path = "/checkIn" Component={CheckIn}></Route>
        <Route path = "/signup" Component={SignUp}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
