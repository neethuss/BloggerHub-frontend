import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BACKEND_URL}/user`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (username:string, email:string,  image?: File | null) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('username', username || '');
    formData.append('email', email || '');
    if (image) {
      formData.append('file', image);
    }

    const response = await axios.patch(`${BACKEND_URL}/user`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:`Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
