import React, { useEffect, useState } from 'react';
import Label from './Label';
import Input from './Input';
import Button from './Button';
import IProfile from '../interface/profile';
import { getUser, updateUser } from '../api/userApi';
import {toast,Toaster} from 'sonner'
import useUserStore from '../store/userStore';

export default function EditProfileModal({ open, onClose }: IProfile) {
  const { setUser,updateUserProfile } = useUserStore();

  const [username, setUsername] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); 
  const [oldImage, setOldImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log('fetching user');
      const data = await getUser();
      setUsername(data.user.username);
      setEmail(data.user.email);
      setOldImage(data.user.image || null); 
      setImagePreview(data.user.image || null);
    };
    fetchCurrentUser();
  }, []);

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

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const data = await updateUser(username, email, image)
    updateUserProfile({
      username,
      email,
      image: data.updatedUser.image || null,
    });
    setUser({  
      id: data.updatedUser._id,
      username: data.updatedUser.username,
      email: data.updatedUser.email,
      image: data.updatedUser.image || null,
    });
    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Profile" }), 2000)
      );

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        const result = data as { name: string };
        return `${result.name} has been updated`;
      },
      error: "Error",
    });
    console.log(data)
    onClose(); 
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <img
              src={imagePreview || oldImage || '/uploads/defaultprofile.jpg'} 
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <Label htmlFor="image" className="cursor-pointer text-blue-500">
              Change Image
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </Label>
          </div>
          <div>
            <Label htmlFor="username" className="block mb-1">Username</Label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <Label htmlFor="email" className="block mb-1">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
      <Toaster position='top-right'/>
    </div>
  );
}
