import {BrowserRouter, Routes, Route} from "react-router-dom"
import "./index.css"
import Dashboard from "./pages/Dashboard"
import CheckIn from "./pages/CheckIn"
import Navbar from "./components/Navbar"  

function App() {
  return (
    <>
    <Navbar></Navbar>
    <BrowserRouter>
      <Routes>
        <Route exact path = "/" Component={Dashboard}></Route>
        <Route path = "/checkIn" Component={CheckIn}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
