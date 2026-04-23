import React from "react";
import GuestDashboard from "./pages/Guest/GuestDashboard"
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
      
      <GuestDashboard/>
    </>
  );
};

export default App;