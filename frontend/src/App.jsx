
import React from "react";
import GuestPage from "./pages/Guest/GuestDashboard"
import AOS from "aos";
import "aos/dist/aos.css";
const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
  });
  return (
    <>
      
      

    
     <GuestPage/>

    </>
  );
};

export default App;