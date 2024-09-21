// components/SearchBar.js

import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{ width: "300px", padding: "10px" }}
      />
      <button type="submit" style={{ padding: "10px" }}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
