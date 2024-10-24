import {  Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import BlogPage from "../pages/BlogPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../HOC/ProtectedRoute";

const MainRoutes = () => {

  return (
    <div>
   
        <Routes>
          <Route path="/" element={<ProtectedRoute><BlogPage/></ProtectedRoute>}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
        </Routes>
     
    </div>
  );
};

export default MainRoutes;
