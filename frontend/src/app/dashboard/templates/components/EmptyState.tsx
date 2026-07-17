import React from "react";
import { FolderOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  selectedCategories: string[];
  onCreateTemplate: () => void;
}

export default function EmptyState({ searchTerm, selectedCategories, onCreateTemplate }: EmptyStateProps) {
  const isFilterActive = searchTerm !== "" || selectedCategories.length > 0;

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-box-border bg-box-bg/10 backdrop-blur-sm select-none">
      <div className="w-16 h-16 rounded-2xl bg-box-bg/30 border border-box-border flex items-center justify-center text-text-muted mb-4 shadow-inner">
        <FolderOpen className="w-8 h-8 text-text-muted/80 animate-pulse" />
      </div>
      
      <h3 className="text-lg font-extrabold text-foreground tracking-tight mb-1">
        {isFilterActive ? "No Matching Templates" : "No Templates Yet"}
      </h3>
      
      <p className="text-xs md:text-sm text-text-muted max-w-sm leading-relaxed mb-6">
        {isFilterActive
          ? "No templates match your search criteria or category filters. Try clearing some filters or searching for something else."
          : "Create your first reusable SOP template to standardize workflows and speed up incident remediation."}
      </p>

      {!isFilterActive && (
        <button
          onClick={onCreateTemplate}
          className="button button-primary px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      )}
    </div>
  );
}
