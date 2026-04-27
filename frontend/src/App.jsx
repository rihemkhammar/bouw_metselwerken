import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import GuestPage from './pages/Guest/GuestDashboard';
import AppRoutes from './routes';


function App() {
  return (
    <Router>
     <AppRoutes />
    </Router>
  );
}

export default App
