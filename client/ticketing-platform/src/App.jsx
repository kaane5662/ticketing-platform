import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import "./index.css"
import CheckIn from "./pages/CheckIn"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

import SearchPage from "./pages/Searchpage"
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
        <Route path="/login" Component={Login}></Route>
        <Route path="/search" Component={SearchPage}></Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
