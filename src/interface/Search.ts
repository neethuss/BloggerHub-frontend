export default interface SerachProps{
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  className?: string;
  type?:string
}