import About from "../components/Landing/About";
import FAQ from "../components/Landing/FAQ";
import Footer from "../components/Landing/Footer";
import Intro from "../components/Landing/Intro";
import Question from "../components/Landing/Question";
import Services from "../components/Landing/Services";

export default function Landing(){
    return(
        <>
        <Intro></Intro>
        <About></About>
        <Services></Services>
        <FAQ></FAQ>
        <Footer></Footer>
        </>
    )
}