import { useState } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";



export default function Login() {
  const navigate = useNavigate()
  const [input,setInput] = useState({
    email : "",
    password : ""
  })
  function handleInput(e){
    const {name,value} = e.target;
    setInput({...input,[name]: value})
  }
 async function onSubmit(e){
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5100/login",{
        method : "POST",
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({
          email : input.email,
          password : input.password
        })
      })
      if(!response.ok){
        throw new Error("Logging was not successfull")
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.jwtToken,isAuthenticated : true }));
      toast.success(data.message)
      navigate("/")
  
    } catch (error) {
      console.log(error);
        toast.error(error.message || "Login failed");
    }


 
  }
  return (
  <div className='h-[100vh] flex flex-col justify-center items-center bg-gray-100'>
    <div className='p-4 flex flex-col rounded-2xl text-center'>
      <h1 className='font-bold text-3xl mb-2'>Login Here</h1>
      <p className='font-light text-gray-500 text-md mb-4'>Please enter your credentials to access your account.</p>
      <form  onSubmit={onSubmit}>
      <div className='flex flex-col gap-2 text-left mb-2'>
        <label className='text-gray-400'>Email</label>
        <input onChange={handleInput} name="email" className='border-1 border-gray-400 px-2 py-4 rounded-lg bg-white' type='email' placeholder='Enter Your Email Id' ></input>
      </div>
          <div className='flex flex-col gap-2 text-left mb-2'>
        <label className='text-gray-400'>Password</label>
        <input onChange={handleInput} name="password" className='border-1 border-gray-400 px-2 py-4 rounded-lg bg-white'  type='password' placeholder='Enter Your Password' ></input>
      </div>
      <div className='text-left mb-4'>
          <p className='text-gray-400 cursor-pointer hover:underline hover:text-black'>Forgot Your Password?</p>
      </div>
      <button type="submit" className='mt-4 border-1 text-white  px-2 py-4 rounded-lg w-[-webkit-fill-available] bg-black  hover:bg-green-600'>Login</button>      
      </form>
    </div>
    <div className="mt-4">
      <p className="text-gray-400 text-sm">Don't have an accout ? <Link className="underline font-medium text-black" to="/register">Register Here</Link></p>
    </div>
  </div>
  )
}
