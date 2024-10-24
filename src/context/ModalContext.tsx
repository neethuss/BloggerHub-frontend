import { createContext, useState } from "react";
import ModalContextProps from "../interface/Modal";
import Blog from "../interface/Blog";

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null); 

  const openModal = (blog?: Blog) => {
    setActiveBlog(blog || null);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setActiveBlog(null); 
  };

  return (
    <ModalContext.Provider value={{ showModal, openModal, closeModal, activeBlog }}>
      {children}
    </ModalContext.Provider>
  );
};
