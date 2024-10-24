import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const postBlog = async (title?: string, content?: string, image?: File | null) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title || '');
    formData.append('content', content || '');
    if (image) {
      formData.append('file', image);
    }

    const response = await axios.post(`${BACKEND_URL}/blog`, formData, {
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


export const updateBlog = async (blogId:string,title?: string, content?: string, image?: File | null) => {
  try {
    const token = localStorage.getItem('token');
    console.log('updaton')
    const formData = new FormData();
    formData.append('title', title || '');
    formData.append('content', content || '');
    if (image) {
      formData.append('file', image);
    }

    const response = await axios.patch(`${BACKEND_URL}/blog/${blogId}`, formData, {
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

export const deleteBlog = async (blogId:string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BACKEND_URL}/blog/${blogId}` ,{
      headers: {
        Authorization:`Bearer ${token}`
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getBlogs = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BACKEND_URL}/blog/blogs`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
