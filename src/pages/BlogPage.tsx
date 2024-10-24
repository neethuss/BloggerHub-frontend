import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../context/ModalContext";
import User from "../interface/User";
import Blog from "../interface/Blog";
import { LogOut } from "lucide-react";
import Button from "../components/Button";
import { getBlogs } from "../api/blogApi";
import Logout from "../components/Logout";
import { useNavigate } from "react-router-dom";

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchAllBlogs = async () => {
        try {
          const data = await getBlogs();
          console.log(data);
          const sortedBlogs = data.blogs.sort(
            (a: Blog, b: Blog) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setBlogs(sortedBlogs);
          setCurrentUser(data.user);
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      };
      fetchAllBlogs();
    }
  }, []);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const context = useContext(ModalContext);
  if (!context) {
    return null;
  }

  return (
    <div
      className="flex flex-col h-screen bg-gray-100 font-sans"
      style={{
        backgroundImage: "url('/uploads/blogback.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">BloggerHub</h1>
          <div className="flex items-center space-x-4">
           
            <Button
              className="flex items-center text-gray-700 hover:text-gray-900"
              onClick={openLogoutModal}
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex">
          <div className="w-1/4 pr-8 flex flex-col">
            <div className="bg-white p-4 rounded-lg shadow mb-4 items-center text-center">
              <img
                src={currentUser?.image || "/uploads/defaultprofile.jpg"}
                alt="User avatar"
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-center">
              {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1) : 'Username'}
              </h2>
            </div>
            <Button
              className="flex items-center justify-center bg-[#7B5C4C] text-white px-4 py-2 hover:bg-[#4E3B30] transition-colors w-full text-center border rounded-2xl"
              onClick={() => navigate("/profile")}
            >
             
              View Your Profile
            </Button>
          </div>

          <div className="w-3/4 overflow-y-auto hide-scrollbar pr-4">
  <div className="space-y-2">
    {blogs.map((blog) => (
      <div key={blog._id} className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <img
            src={blog.user.image || "/default-avatar.png"}
            alt={blog.user.username || "User"}
            className="w-10 h-10 rounded-full mr-4"
          />
          <p className="font-semibold">
            {blog.user.username.charAt(0).toUpperCase() + blog.user.username.slice(1)}
          </p>
        </div>
        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
        <p className="text-gray-600 mb-4">{blog.content}</p>
        {blog.image && (
          <div className="w-full flex justify-center items-center overflow-hidden rounded-md">
            <img
              src={blog.image}
              alt={blog.title}
              className="max-w-full h-auto object-contain"
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>
        </div>
      </main>
      <Logout open={isLogoutModalOpen} onClose={closeLogoutModal} />
    </div>
  );
};

export default BlogPage;
