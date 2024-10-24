"use client";

import React, { useState } from "react";
import { postSignup } from "../api/signupApi";
import Input from "../components/Input";
import Button from "../components/Button";
import "../App.css";
import { validateSignupForm } from "../utils/sigupValidation";
import { Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { errors, isValid, isAnyFieldEmpty } = validateSignupForm(
      username,
      email,
      password
    );
    setErrors(errors);
    if (isAnyFieldEmpty) {
      setGeneralError("All fields must be filled out.");
      return;
    } else {
      setGeneralError("");
    }
    if (isValid) {
      try {
        const response = await postSignup(username, email, password);

        if (response) {
          if (response.status === 201) {
            toast.success("Signup completed. Login again to continue");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          } else if (response.status === 200) {
            toast.error("User already exists with this email");
          }
        } else {
          toast.error("An unexpected error occurred");
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('/uploads/blog-signup.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-1/2 flex flex-col justify-center items-center text-white px-12">
        {/* <h1 className="text-5xl font-bold mb-6">Welcome to Our Platform</h1> */}
        <h1 className="text-5xl font-bold mb-6">BloggerHub</h1>
        <p className="text-xl mb-8">
          Join our community and experience the best of what we have to offer.
          Sign up today to get started on your journey with us.
        </p>
        {/* <ul className="list-disc list-inside text-lg">
          <li>Access exclusive content</li>
          <li>Connect with like-minded individuals</li>
          <li>Stay updated with the latest trends</li>
          <li>Enjoy a seamless user experience</li>
        </ul> */}
      </div>
      <div className="relative z-10 w-1/2 flex justify-center items-center">
        <div className="w-full max-w-md p-8 rounded-lg backdrop-blur-md bg-white bg-opacity-20">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Sign Up
          </h2>
          {generalError && (
            <p className="text-red-500 mb-4 text-center">{generalError}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                type="text"
                value={username}
                placeholder="Enter your username"
                className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
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
              Sign Up
            </Button>
            <div>
              <p className="text-white">
                Already Have An Account ? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default SignupPage;
