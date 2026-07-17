import React, { useState, useRef, useEffect } from "react";
import { Clock, Layers, HelpCircle, Variable, CheckSquare, MoreVertical, Play, Edit3, Trash2, Copy, Eye } from "lucide-react";
import { Template } from "../mockData";
import FavoriteButton from "./FavoriteButton";

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUse: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
  onToggleFavorite: (template: Template) => void;
}

export default function TemplateCard({
  template,
  onPreview,
  onUse,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite
}: TemplateCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Category badges styles
  const getCategoryBadgeStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "kubernetes":
        return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "database":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "docker":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "devops":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "aws":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "linux":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "networking":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "monitoring":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "security":
        return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";
      default:
        return "bg-slate-500/10 text-text-muted border-slate-500/20";
    }
  };

  // Difficulty badge colors
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-emerald-400 bg-emerald-500/5 border-emerald-500/10";
      case "Medium":
        return "text-amber-400 bg-amber-500/5 border-amber-500/10";
      case "Hard":
        return "text-rose-400 bg-rose-500/5 border-rose-500/10";
      default:
        return "text-text-muted bg-slate-500/5 border-slate-500/10";
    }
  };

  return (
    <div className="relative group rounded-2xl border border-box-border bg-box-bg/20 backdrop-blur-md p-5 flex flex-col justify-between hover:bg-box-bg/45 hover:border-accent-primary/45 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
      {/* Background soft gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top section: Category, Favorite, Menu */}
      <div className="flex items-center justify-between gap-3 mb-4 select-none relative z-20">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeStyles(template.category)}`}>
          {template.category}
        </span>

        <div className="flex items-center gap-1">
          <FavoriteButton
            isFavorite={template.isFavorite}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(template);
            }}
          />

          {/* Action Menu (Duplicate/Delete) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-full border border-transparent text-text-muted hover:text-foreground hover:bg-box-bg/50 transition-colors cursor-pointer"
              aria-label="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded-xl border border-box-border bg-sidebar-bg/95 backdrop-blur-md shadow-lg ring-1 ring-black/5 overflow-hidden z-20 animate-fadeIn">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onDuplicate(template);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-text-muted hover:bg-box-bg hover:text-foreground transition-colors duration-150 flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onDelete(template);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors duration-150 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main card info: Title & Description */}
      <div className="mb-5 flex-1 relative z-10">
        <h3 className="text-base font-extrabold text-foreground tracking-tight group-hover:text-accent-primary transition-colors duration-200 mb-2 line-clamp-1">
          {template.name}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-box-border text-[11px] font-mono text-text-muted mb-5 select-none relative z-10">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-text-muted/70 shrink-0" />
          <span>{template.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-text-muted/70 shrink-0" />
          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${getDifficultyStyles(template.difficulty)}`}>
            {template.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Variable className="w-3.5 h-3.5 text-text-muted/70 shrink-0" />
          <span>{template.variables.length} Variables</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-text-muted/70 shrink-0" />
          <span>{template.steps.length} Steps</span>
        </div>
        <div className="col-span-2 text-[10px] text-text-muted/65 flex justify-between pt-1 border-t border-box-border/20 mt-1">
          <span>Used {template.timesUsed} times</span>
          <span>Last: {template.lastUsed}</span>
        </div>
      </div>

      {/* Actions: Preview, Use, Edit */}
      <div className="flex gap-2 items-center relative z-10">
        <button
          onClick={() => onPreview(template)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 hover:scale-[1.02] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>

        <button
          onClick={() => onUse(template)}
          className="flex-1 py-2 text-xs font-bold rounded-xl bg-accent-primary text-slate-950 hover:bg-accent-primary/95 hover:scale-[1.02] shadow-md shadow-accent-primary/5 hover:shadow-accent-primary/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          Use
        </button>

        <button
          onClick={() => onEdit(template)}
          className="p-2 rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 hover:scale-[1.02] transition-all duration-200 cursor-pointer flex items-center justify-center"
          title="Edit template"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
