import User from "./User"

export default interface Blog{
  _id:string
  title :string
  content:string
  image:string 
  user: User
  createdAt : Date
}