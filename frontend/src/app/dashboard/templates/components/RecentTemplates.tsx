import React from "react";
import { Clock, Play, FileText } from "lucide-react";
import { Template } from "../mockData";

interface RecentTemplatesProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

export default function RecentTemplates({ templates, onSelect }: RecentTemplatesProps) {
  // Filter for templates that have been used and sort them by lastUsedTimestamp descending
  const recentTemplates = [...templates]
    .filter((t) => t.timesUsed > 0)
    .sort((a, b) => b.lastUsedTimestamp - a.lastUsedTimestamp)
    .slice(0, 5); // Show top 5 recently used

  if (recentTemplates.length === 0) return null;

  return (
    <div className="space-y-3 select-none">
      <h3 className="text-xs font-bold text-text-muted font-mono uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        Recently Used Workflows
      </h3>
      
      {/* Horizontal Scroll Area */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent -mx-2 px-2">
        {recentTemplates.map((template) => (
          <button
            key={`recent-${template.id}`}
            onClick={() => onSelect(template)}
            className="flex-none w-64 text-left p-4 rounded-xl border border-box-border bg-box-bg/25 backdrop-blur-md hover:bg-box-bg/60 hover:border-accent-primary/40 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-black/5 group"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-accent-primary/10 text-accent-primary border border-accent-primary/15">
                {template.category}
              </span>
              <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                {template.lastUsed}
              </span>
            </div>
            
            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-accent-primary transition-colors duration-150 mb-1">
              {template.name}
            </h4>
            
            <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mt-3 pt-2.5 border-t border-sidebar-border/30">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-text-muted" />
                {template.steps.length} Steps
              </span>
              <span className="flex items-center gap-1 font-semibold text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Play className="w-3 h-3" />
                Quick View
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
