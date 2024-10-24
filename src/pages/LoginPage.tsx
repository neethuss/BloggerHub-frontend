"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postLogin } from "../api/loginApi";
import Input from "../components/Input";
import Button from "../components/Button";
import { validateLoginForm } from "../utils/loginValidation";
import { Toaster, toast } from "sonner";
import useUserStore from "../store/userStore";

const LoginPage = () => {
  const { setUser } = useUserStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { errors, isValid, isAnyFieldEmpty } = validateLoginForm(email, password);
    setErrors(errors);
  
    if (isAnyFieldEmpty) {
      setGeneralError("All fields must be filled out.");
      toast.error("All fields must be filled out.");
      return;
    } else {
      setGeneralError("");
    }
  
    if (isValid) {
      try {
        const result = await postLogin(email, password);
        console.log(result.data.blogs,'all blogs')
        if ('error' in result) {
          switch (result.status) {
            case 404:
              toast.error("User not found with this email");
              break;
            case 401:
              toast.error("Password does not match");
              break;
            default:
              toast.error(result.message);
          }
          return;
        }
          if (result.data.accessToken) {
          localStorage.setItem("token", result.data.accessToken);
          
          setUser({
            id: result.data.existingUser._id,
            username: result.data.existingUser.username,
            email: result.data.existingUser.email,
            image: result.data.existingUser.image || null,
          });
  
          toast.success("Login successful");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('/uploads/blog.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-md bg-white bg-opacity-20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h1>
        {generalError && (
          <p className="text-red-500 mb-4 text-center">{generalError}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="email"
              value={email}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              value={password}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={false}
            className="w-full py-2 px-4 bg-[#7B5C4C] hover:bg-white hover:text-[#7B5C4C] rounded-lg text-white font-semibold transition duration-300"
          >
            Login
          </Button>
          <div>
            <p className="text-white">
              New User ?{" "}
              <Link to="/signup" className="">
                Singup
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default LoginPage;
