import React, { useContext, useEffect, useState } from "react";
import Blog from "../interface/Blog";
import { Plus } from "lucide-react";
import { getUser } from "../api/userApi";
import { ModalContext } from "../context/ModalContext";
import BlogModal from "../components/BlogModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../components/Button";
import { deleteBlog } from "../api/blogApi";
import EditProfileModal from "../components/Profile";
import { Toaster, toast } from 'sonner'
import useUserStore from "../store/userStore";

const ProfilePage: React.FC = () => {
const {user} = useUserStore()
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const data = await getUser();
      console.log(data);
      const sortedBlogs = data.userBlogs.sort(
        (a: Blog, b: Blog) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBlogs(sortedBlogs || []);
    };
    fetchCurrentUser();
  }, []);

  const handleOptionsClick = (blogId: string) => {
    setShowOptions(showOptions === blogId ? null : blogId);
  };

  const handleEdit = (blog: Blog) => {
    openModal(blog);
    setShowOptions(null);
  };

  const handleDelete = async (blogId: string) => {
    await deleteBlog(blogId);
    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Blog" }), 2000)
      );

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        const result = data as { name: string };
        return `${result.name} has been deleted`;
      },
      error: "Error",
    });
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    setShowOptions(null);
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const context = useContext(ModalContext);
  if (!context) {
    return null;
  }
  const { openModal } = context;

  const handleBlogUpdate = (updatedBlog: Blog) => {
    setBlogs(prevBlogs => {
      const existingBlogIndex = prevBlogs.findIndex(blog => blog._id === updatedBlog._id);
      if (existingBlogIndex !== -1) {
        // Update existing blog
        const newBlogs = [...prevBlogs];
        newBlogs[existingBlogIndex] = updatedBlog;
        return newBlogs;
      } else {
        // Add new blog at the beginning
        return [updatedBlog, ...prevBlogs];
      }
    });
  };

  return (
    <div
      className="flex bg-gray-100 h-screen p-6 font-sans"
      style={{
        backgroundImage: "url('/uploads/blogback.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex-1 flex gap-6 max-w-7xl mx-auto">
        <div className="w-1/3 sticky top-6">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img
              src={user?.image || "/uploads/defaultprofile.jpg"}
              alt={user?.username}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-center mb-2">
              {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Username'}
            </h2>
            <p className="text-gray-600 text-center mb-6">{user?.email}</p>
            <Button onClick={openProfileModal}>Edit Profile</Button>
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <div className="sticky top-6 z-10 bg-gray-100 pb-6">
            <Button
              onClick={() => openModal()}
              className="w-full bg-[#7B5C4C] text-white px-4 py-2 hover:bg-[#4E3B30] rounded-xl transition-colors flex items-center justify-center"
            >
              <Plus className="mr-2" />
              Create New Post
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar">
  <div className="space-y-6 pr-2">
    {blogs.length > 0 ? (
      blogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold mb-2">
              {blog.title}
            </h3>
            <div
              onClick={() => handleOptionsClick(blog._id)}
              className="relative cursor-pointer"
            >
              <BsThreeDotsVertical />
              {showOptions === blog._id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-4">{blog.content}</p>
          {blog.image && (
            <div className="w-full flex justify-center items-center overflow-hidden rounded-md mb-4">
              <img
                src={blog.image}
                alt={blog.title}
                className="max-w-full h-auto object-contain"
              />
            </div>
          )}
          <span className="text-sm text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))
    ) : (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">
          No posts yet. Create your first post!
        </p>
      </div>
    )}
  </div>
</div>
        </div>
      </div>
      <BlogModal onBlogUpdate={handleBlogUpdate} />
      <EditProfileModal open={isProfileModalOpen} onClose={closeProfileModal} />
      <Toaster position="top-right"/>
    </div>
  );
};

export default ProfilePage;
