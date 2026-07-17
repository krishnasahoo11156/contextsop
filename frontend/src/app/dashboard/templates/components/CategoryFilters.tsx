import React from "react";

const categories = [
  "All",
  "DevOps",
  "Docker",
  "Kubernetes",
  "AWS",
  "Linux",
  "Networking",
  "Database",
  "Monitoring",
  "Security"
];

interface CategoryFiltersProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategoryFilters({ selectedCategories, onChange }: CategoryFiltersProps) {
  const handleChipClick = (category: string) => {
    if (category === "All") {
      onChange([]);
      return;
    }

    let newSelected: string[];
    if (selectedCategories.includes(category)) {
      newSelected = selectedCategories.filter((c) => c !== category);
    } else {
      newSelected = [...selectedCategories, category];
    }
    onChange(newSelected);
  };

  const isAllActive = selectedCategories.length === 0;

  return (
    <div className="flex flex-wrap gap-2 select-none">
      {categories.map((category) => {
        const isActive = category === "All" ? isAllActive : selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => handleChipClick(category)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isActive
                ? "bg-accent-primary text-slate-950 border-accent-primary font-bold shadow-md shadow-accent-primary/10"
                : "bg-box-bg/35 text-text-muted border-box-border hover:bg-box-bg/70 hover:text-foreground"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
