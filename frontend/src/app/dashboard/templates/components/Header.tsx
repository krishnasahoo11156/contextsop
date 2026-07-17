import React from "react";
import { Plus, LayoutTemplate } from "lucide-react";

interface HeaderProps {
  onNewTemplate: () => void;
}

export default function Header({ onNewTemplate }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-sidebar-border/40 select-none">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sidebar-border text-text-muted border border-sidebar-border/80">
            Reusable Workflow Templates
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <LayoutTemplate className="w-8 h-8 text-accent-primary shrink-0" />
          Template Library
        </h1>
        <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
          Create, organize and reuse SOP workflows across your organization.
        </p>
      </div>

      <button
        onClick={onNewTemplate}
        className="button button-primary px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 self-start md:self-center"
      >
        <Plus className="w-4 h-4" />
        New Template
      </button>
    </div>
  );
}
