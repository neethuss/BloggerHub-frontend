import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const postSignup = async (username :string, email:string, password:string) => {
  try {
    console.log( username, email, password)
    const response = await axios.post(`${BACKEND_URL}/user/signup`,{
      username, email, password
    })
    return response
  } catch (error) {
    console.log(error)
  }
}