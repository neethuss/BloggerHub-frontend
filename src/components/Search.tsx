import { useState } from "react";
import SearchProps from "../interface/Search";
import { Search } from "lucide-react";

const SearchComponent: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <Search className="h-5 w-5" />
      </span>
    </form>
  );
};

export default SearchComponent;
