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
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="multi-tag-container">
        <div className="tags-input-wrapper">
          {value.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button
                type="button"
                className="tag-remove"
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
            className="tag-input"
            autoComplete="off"
          />
        </div>
        
        {showDropdown && filteredSuggestions.length > 0 && (
          <div ref={dropdownRef} className="suggestions-dropdown">
            {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
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
