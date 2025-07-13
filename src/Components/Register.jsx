import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    designation: ""
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          return "Only letters and spaces allowed.";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid email format.";
        }
        break;
      case "password":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value)
        ) {
          return "Must have 8+ chars, uppercase, lowercase, number, and special char.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });


    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const isFormValid = () => {
    const newErrors = {
      username: validateField("username", input.username),
      email: validateField("email", input.email),
      password: validateField("password", input.password),
    };
    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fix errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5100/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Registration failed");
      }

      const data = await response.json();
      toast.success(data.message);
      localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.jwtToken, isAuthenticated: true }));
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-[100vh] flex flex-col justify-center items-center bg-gray-100'>
      <div className='p-4 flex flex-col rounded-2xl text-center'>
        <h1 className='font-bold text-3xl mb-2'>Register Here</h1>
        <p className='font-light text-gray-500 text-md mb-4'>
          Please enter your credentials to create your account.
        </p>
        <form onSubmit={onSubmit}>
          {/* Username */}
          <div className='flex flex-col gap-1 text-left mb-3'>
            <label className='text-gray-400'>Username</label>
            <input
              onChange={handleInput}
              name="username"
              value={input.username}
              className='border border-gray-400 px-2 py-3 rounded-lg bg-white'
              type='text'
              placeholder='Enter Your Name'
              required
            />
            {errors.username && (
              <span className="text-red-500 text-sm">{errors.username}</span>
            )}
          </div>

          {/* Designation */}
          <div className='flex flex-col gap-1 text-left mb-3'>
            <label className='text-gray-400'>Designation</label>
            <input
              onChange={handleInput}
              name="designation"
              value={input.designation}
              className='border border-gray-400 px-2 py-3 rounded-lg bg-white'
              type='text'
              placeholder='Your Company Designation'
              required
            />
          </div>

          {/* Email */}
          <div className='flex flex-col gap-1 text-left mb-3'>
            <label className='text-gray-400'>Email</label>
            <input
              onChange={handleInput}
              name="email"
              value={input.email}
              className='border border-gray-400 px-2 py-3 rounded-lg bg-white'
              type='email'
              placeholder='Your Email Id'
              required
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className='flex flex-col gap-1 text-left mb-3'>
            <label className='text-gray-400'>Password</label>
            <input
              onChange={handleInput}
              name="password"
              value={input.password}
              className='border border-gray-400 px-2 py-3 rounded-lg bg-white'
              type='password'
              placeholder='Your Password'
              required
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className='mt-4 border text-white px-2 py-4 rounded-lg w-full bg-black hover:bg-green-600'
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link className="underline font-medium text-black" to="/login">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
