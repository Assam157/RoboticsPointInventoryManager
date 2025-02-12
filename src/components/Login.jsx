
import React,{useState} from "react";
import { Navigate,useNavigate } from "react-router-dom";
import "./Login.css"

const Login=()=>{
    const [product,setProduct]=useState({
        name:"",
        password:""
    })
    const [success,setSucces]=useState('');
    const [error,setError]=useState('');
    const [loading,setLoading]=useState('')
    const Navigate=useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: value,
        }));
      };
      
      const handleSubmit=async(e)=>{
        e.preventDefault(); 
        setLoading(true);
        setError(null);
        setSucces(false);
      try{
        const response=await fetch("https://darkorchid-tapir-476375.hostingersite.com/LogInInventory",{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(product)
        })
        const result=await response.json()
        if(!response.ok){
          setError("Failed To Submit")
        }else{
          localStorage.setItem('authToken', result.token); 
          Navigate("/Inventory")
        }
   
      }catch(err)
      {
        setError("NoMessageRecievedFromServer")
      }finally{
        setLoading(false)
      }
      
    };
    return (
        <div className="loginInventory">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={product.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Inventorypage</button>
          </form>  
        </div>
      );
}
export default Login
