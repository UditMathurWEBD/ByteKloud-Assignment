import { useState,useEffect } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [userData, setUserData] = useState(null);
  const [input, setInput] = useState({
    username: "",
    designation: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    if (!user?.isAuthenticated) {
      navigate("/login");
    } else {
      setUserData(user);
      setInput({
        username: user.username || "",
        designation: user.designation || "",
        email: user.email || "",
        password: ""
      });
    }
  }, [navigate]);

  if (!userData) return <p>Loading...</p>; // ✅ Still safe


  function handleEdit(){
    setIsEditOpen(!isEditOpen);
  }

  function handleInput(e){
    const {name,value} = e.target;
    setInput({...input,[name]: value})
  }
async function onSubmit(e) {
  e.preventDefault();

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      toast.error("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    const response = await fetch("http://localhost:5100/editDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(input)
    });

    const data = await response.json();
    if (response.status === 401) {
  toast.error(data.message || "Session expired. Please login again.");
  localStorage.removeItem("user");
  navigate("/login");
  return;
}


    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }


    const updatedUser = {
      ...data.user,
      token: token,
      isAuthenticated: true
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserData(updatedUser); // update state too

    toast.success("Profile updated successfully");
    setIsEditOpen(false); // close edit form
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Failed to update profile");
  }
}


  function handleLogout(){
    localStorage.removeItem("user");
    navigate("/login");
  }
  return (
    <div className='h-[100vh] flex flex-col justify-center items-center bg-gray-100'>
         <div className='bg-white p-[20px] flex flex-col gap-4 rounded-2xl items-center'>
      <div className='bg-white p-6 pb-0 pt-4 flex gap-4 rounded-2xl items-center'>
       <div className="relative group inline-block">
  <img
    className="w-[60px] h-[60px] rounded-full bg-amber-400 border border-gray-400 cursor-pointer"
    src="/dp.png"
    alt="Profile"
  />
  <div className="absolute bottom-[55px] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
{userData.email}
  </div>
</div>
      <div className='flex flex-col gap-0'>
        <p className='text-md font-semibold'>{userData.username}</p>
         <p className='text-sm font-medium text-gray-400'>{userData.designation}</p>
      </div>
      <button onClick={handleEdit} className='bg-black text-white px-6 py-2 cursor-pointer rounded-2xl text-sm hover:bg-green-600'>{isEditOpen ? "Close" : "Edit"}</button>
        <button onClick={handleLogout} className='bg-red-700 text-white px-6 py-2 cursor-pointer rounded-2xl text-sm hover:bg-red-600'>Logout</button>
      </div>

    <div>
    {isEditOpen ?
       <form  onSubmit={onSubmit}>
     <div className='flex flex-col gap-2 text-left mb-2'>
        <label className='text-gray-400'>Username</label>
        <input value={input.username} onChange={handleInput} name="username" className='border-1 border-gray-400 px-2 py-4 rounded-lg bg-white w-[300px]' type='text' placeholder='Enter Your  Name' ></input>
      </div>
            <div className='flex flex-col gap-2 text-left mb-2'>
        <label className='text-gray-400'>Designation</label>
        <input value={input.designation} onChange={handleInput} name="designation" className='border-1 border-gray-400 px-2 py-4 rounded-lg bg-white w-[300px]' type='text' placeholder='Enter Your Company Designation' ></input>
      </div>
           <div className='flex flex-col gap-2 text-left mb-2'>
        <label className='text-gray-400'>Email</label>
        <input value={input.email} onChange={handleInput} name="email" className='border-1 border-gray-400 px-2 py-4 rounded-lg bg-white  w-[300px]' type='email' placeholder='Enter Your Email Id'  ></input>
      </div>
          <div className='flex flex-col gap-2 text-left mb-2'>
        <label className='text-gray-400'>Password</label>
        <input value={input.password} onChange={handleInput} name="password" className='border-1 border-gray-400 px-2 py-4 rounded-lg bg-white  w-[300px]'  type='password' placeholder='Enter Your Password'  ></input>
      </div>
      <button type="submit" className='mt-4 mb-8 border-1 text-white  px-2 py-4 rounded-lg w-[-webkit-fill-available] bg-black  hover:bg-green-600'>Edit Profile Data</button>        
      </form>
      : null}
    </div>
        </div>
    </div>
  )
}
