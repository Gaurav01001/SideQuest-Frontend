import React from 'react'

const SearchBar = ({ value, onChange, onClear, placeholder = "Search for users..." }) => {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-gray-400 dark:text-gray-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-[52px] pl-11 pr-10 py-3 rounded-[12px] bg-[#F5F4F1] dark:bg-[#272724] border border-[#E8E6E1] dark:border-[#312F2C] focus:border-[#FF6B47] dark:focus:border-[#FF6B47] text-sm text-[#1A1916] dark:text-[#F0EEE9] placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all focus:ring-1 focus:ring-[#FF6B47]"
      />

      {/* Clear Button */}
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B6860] hover:text-[#1A1916] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9] transition-colors cursor-pointer"
        >
          <svg 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchBar
