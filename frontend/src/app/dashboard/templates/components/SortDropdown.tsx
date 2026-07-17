import React, { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export type SortOption = "recently-used" | "recently-created" | "alphabetical" | "most-used" | "favorites";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptionsList: { value: SortOption; label: string }[] = [
  { value: "recently-used", label: "Recently Used" },
  { value: "recently-created", label: "Recently Created" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "most-used", label: "Most Used" },
  { value: "favorites", label: "Favorites" }
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeOption = sortOptionsList.find((opt) => opt.value === value) || sortOptionsList[0];

  return (
    <div className="relative inline-block text-left select-none z-10" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-box-border bg-box-bg/35 text-text-muted hover:bg-box-bg/70 hover:text-foreground active:scale-[0.98] transition-all duration-200 cursor-pointer min-w-[150px]"
      >
        <span className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5" />
          {activeOption.label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 origin-top-right rounded-xl border border-box-border bg-sidebar-bg/95 backdrop-blur-md shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden animate-fadeIn">
          <div className="py-1">
            {sortOptionsList.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-150 flex items-center justify-between ${
                  value === option.value
                    ? "bg-accent-primary/10 text-accent-primary font-bold"
                    : "text-text-muted hover:bg-box-bg hover:text-foreground"
                }`}
              >
                {option.label}
                {value === option.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
