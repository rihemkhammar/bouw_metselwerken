
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import GuestPage from './pages/Guest/GuestDashboard';
import AppRoutes from './routes';

import React from "react";
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
      
      

    <Router>
     <AppRoutes />
    </Router>
  


    
     

    </>
  );
};

export default App;