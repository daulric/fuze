"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchBarRef = useRef(null);
  const inputRef = useRef(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();

  const recommended_storage = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const search_storage = JSON.parse(localStorage.getItem("search_storage"));
    return search_storage?.length ? search_storage : [];
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchTerm(value);
    setIsActive(!!value);
    setSelectedIndex(-1);

    setRecommendations(
      value ? recommended_storage.filter(rec => rec.toLowerCase().includes(value.toLowerCase())) : []
    );
  };

  const executeSearch = (search) => {
    if (!search.trim()) return;
    setIsMobileSearchOpen(false);
    setTimeout(() => {
      setRecommendations([]);
      setIsActive(false);
      setIsExpanded(false);
      inputRef.current?.blur();
      if (!recommended_storage.includes(search)) {
        recommended_storage.push(search);
        localStorage.setItem("search_storage", JSON.stringify(recommended_storage));
      }
      router.push(`/search?query=${search}`);
    }, 500);
  };

  const handleRecommendationClick = (recommendation) => {
    setSearchTerm(recommendation);
    executeSearch(recommendation);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        handleRecommendationClick(recommendations[selectedIndex]);
      } else {
        executeSearch(searchTerm);
      }
    } else if (recommendations.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < recommendations.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : recommendations.length - 1));
      } else if (e.key === 'Escape') {
        setIsActive(false);
        setIsExpanded(false);
        setSelectedIndex(-1);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsActive(false);
        setIsExpanded(false);
        setSelectedIndex(-1);
        if (isMobileSearchOpen) setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, { signal: controller.signal });
    return () => controller.abort();
  }, [isMobileSearchOpen]);

  const toggleSearch = () => {
    setIsExpanded((prev) => !prev);
    setIsMobileSearchOpen((prev) => !prev);
    if (!isExpanded) inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-lg" ref={searchBarRef}>
      {/* Desktop Search Bar */}
      <div className="hidden md:block w-full">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsActive(true)}
            className="w-full pl-4 pr-12 py-2 rounded-full bg-gray-700 text-white border-gray-600 focus:border-gray-500"
          />
          <Button 
            onClick={() => executeSearch(searchTerm)}
            disabled={!searchTerm.trim()}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-600"
            variant="ghost"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex justify-end w-full">
        {!isMobileSearchOpen && (
          <Button onClick={toggleSearch} className="p-2 rounded-full hover:bg-gray-600" variant="ghost">
            <Search className="w-5 h-5 text-gray-400" />
          </Button>
        )}

        {isExpanded && (
          <div className="relative top-0 right-0 w-full z-50 bg-transparent p-2 rounded-lg shadow-lg">
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-12 py-2 rounded-full bg-transparent text-white border-gray-600 focus:border-gray-500"
                autoFocus
              />
              <Button 
                onClick={() => executeSearch(searchTerm)}
                disabled={!searchTerm.trim()}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-600"
                variant="ghost"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {isActive && recommendations.length > 0 && (
        <ul className="absolute z-50 w-full bg-gray-700 mt-1 rounded-md shadow-lg border border-gray-600">
          {recommendations.map((rec, index) => (
            <li 
              key={index} 
              className={`px-4 py-2 cursor-pointer text-white flex items-center transition-colors ${
                selectedIndex === index ? 'bg-gray-600' : 'hover:bg-gray-600'
              }`}
              onClick={() => handleRecommendationClick(rec)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <Search className="w-4 h-4 mr-2 text-gray-400" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
