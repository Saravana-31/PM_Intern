import React, { useState, useRef, useEffect } from 'react';

const MultiTagInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  suggestions = [], 
  showSuggestions = false,
  onSuggestionClick,
  onInputChange,
  preDefinedOptions = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Combine predefined options with API suggestions
  const allSuggestions = [...new Set([...preDefinedOptions, ...suggestions])];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowDropdown(newValue.length >= 1);
    
    if (onInputChange) {
      onInputChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(value.length - 1);
    }
  };

  const addTag = (tag) => {
    if (tag && !value.includes(tag)) {
      const newTags = [...value, tag];
      onChange(newTags);
      setInputValue('');
      setShowDropdown(false);
    }
  };

  const removeTag = (index) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const filteredSuggestions = allSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(suggestion)
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="min-h-[42px] border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <div className="flex flex-wrap gap-1">
            {value.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {tag}
                <button
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                  onClick={() => removeTag(index)}
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowDropdown(inputValue.length >= 1)}
              placeholder={value.length === 0 ? placeholder : ''}
              className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm"
              autoComplete="off"
            />
          </div>
        </div>
        
        {showDropdown && filteredSuggestions.length > 0 && (
          <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiTagInput;
