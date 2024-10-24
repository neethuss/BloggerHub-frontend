import Blog from "./Blog";

export default interface ModalContextProps {
  showModal: boolean;
  openModal: (blog?: Blog) => void; 
  closeModal: () => void;
  activeBlog?: Blog | null;
}