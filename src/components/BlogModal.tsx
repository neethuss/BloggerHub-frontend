"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { ModalContext } from "../context/ModalContext";
import Button from "./Button";
import Label from "./Label";
import Input from "./Input";
import { Upload } from "lucide-react";
import { postBlog, updateBlog } from "../api/blogApi";
import { validateBlog } from "../utils/blogValidation";
import {toast, Toaster} from 'sonner'
import Blog from "../interface/Blog";

interface BlogModalProps {
  onBlogUpdate: (blog: Blog) => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ onBlogUpdate }) => {
  
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [generalError, setGeneralError] = useState<string>("");
  const [oldImage, setOldImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const context = useContext(ModalContext);
  

  useEffect(() => {
    if (context && context.activeBlog) {
      setTitle(context.activeBlog.title);
      setContent(context.activeBlog.content);
      setOldImage(context.activeBlog.image || null);
      setImagePreview(context.activeBlog.image || null);
    } else {
      setTitle("");
      setContent("");
      setOldImage(null);
      setImagePreview(null);
    }
  }, [context]);

  if (!context) {
    return null;
  }

  const { showModal, closeModal, activeBlog } = context;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async () => {
    const { errors, isValid, isAnyFieldEmpty } = validateBlog(
      title,
      content,
      image,
      Boolean(activeBlog)
    );
    setErrors(errors);
    if (isAnyFieldEmpty) {
      setGeneralError("All fields must be filled out.");
      return;
    } else {
      setGeneralError("");
    }
    console.log("submitting", title, content, image);
    if (isValid) {
      try {
        if (activeBlog) {
          const imageToUpload = image || oldImage ? image : null;
          const data = await updateBlog(
            activeBlog._id,
            title,
            content,
            imageToUpload
          );
          onBlogUpdate(data.updatedBlog);

          const promise = () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: "Blog" }), 2000)
            );

          toast.promise(promise, {
            loading: "Loading...",
            success: (data) => {
              const result = data as { name: string };
              return `${result.name} has been updated`;
            },
            error: "Error",
          });
          console.log(data);
        } else {
          const data = await postBlog(title, content, image);
          onBlogUpdate(data.newBlog);

          const promise = () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: "Blog" }), 2000)
            );

          toast.promise(promise, {
            loading: "Loading...",
            success: (data) => {
              const result = data as { name: string };
              return `${result.name} has been added`;
            },
            error: "Error",
          });
          console.log(data);
        }

        setTitle("");
        setContent("");
        setImagePreview("");
        closeModal();
      } catch (error) {
        console.error(error);
        setGeneralError("An error occurred while submitting the blog.");
      }
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none font-sans">
        <div className="relative w-full max-w-3xl mx-auto my-6 px-4">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                {activeBlog ? "Edit blog" : "Create a new blog"}
              </h3>
              <Button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </Button>
            </div>
            {generalError && (
              <p className="text-red-500 mb-4 text-center">{generalError}</p>
            )}

            <div className="relative p-6 flex-auto">
              <div className="mb-4">
                <Label htmlFor="blog-title">Blog Title</Label>
                <Input
                  id="blog-title"
                  placeholder="Enter your blog title"
                  value={title}
                  className="border rounded-md px-2 w-full text-bold"
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="blog-content">Blog Content</Label>
                <textarea
                  id="blog-content"
                  placeholder="Enter your blog content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="border rounded-md px-2 w-full"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="blog-image">Add Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="blog-image"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <Button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#7B5C4C] text-white active:bg-[#4E3B30] font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={handleSubmit}
              >
                {activeBlog ? "Update Blog" : "Create Blog"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      <Toaster position="top-right"/>
    </>
  );
};

export default BlogModal;
