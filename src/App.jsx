import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes, Route} from "react-router-dom"
import Login from './components/Login'
import InventoryPage from "./components/Inventorypage"

function App() {
  return (
    <div className="App">
       <Router>
        <Routes> 
        <Route path="/" element={<Login/>}></Route>
        <Route path="/Inventory" element={<InventoryPage/>}></Route>
        </Routes>
       </Router>
    </div>
  );
}

export default App;
