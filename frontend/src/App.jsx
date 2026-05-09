import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import GuestPage from './pages/Guest/GuestDashboard';
import AppRoutes from './routes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
     <AppRoutes />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App
