import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, HelpCircle, Variable, CheckSquare, Play, HelpCircle as HelpIcon } from "lucide-react";
import { Template } from "../mockData";

interface PreviewDrawerProps {
  template: Template | null;
  onClose: () => void;
  onUse: (template: Template) => void;
}

export default function PreviewDrawer({ template, onClose, onUse }: PreviewDrawerProps) {
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
    <AnimatePresence>
      {template && (
        <>
          {/* Backdrop Overlay (Non-blocking transparent overlay to allow clicking to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md md:max-w-lg bg-sidebar-bg/95 backdrop-blur-xl border-l border-box-border shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-box-border/80 flex items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeStyles(template.category)}`}>
                  {template.category}
                </span>
                <span className="text-xs text-text-muted font-mono">Template Preview</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-box-border bg-box-bg/20 text-text-muted hover:text-foreground hover:bg-box-bg/50 transition-colors cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                  {template.name}
                </h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-box-border/60 bg-box-bg/15 font-mono text-xs text-text-muted select-none">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-primary" />
                  <div>
                    <div className="text-[10px] text-text-muted/60">EST. TIME</div>
                    <div className="font-semibold text-foreground">{template.estimatedTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-accent-primary" />
                  <div>
                    <div className="text-[10px] text-text-muted/60">DIFFICULTY</div>
                    <span className={`inline-block px-1.5 py-0.5 mt-0.5 rounded border text-[9px] font-bold ${getDifficultyStyles(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Variable className="w-4 h-4 text-accent-primary" />
                  <div>
                    <div className="text-[10px] text-text-muted/60">VARIABLES</div>
                    <div className="font-semibold text-foreground">{template.variables.length} Dynamic</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-accent-primary" />
                  <div>
                    <div className="text-[10px] text-text-muted/60">STEPS</div>
                    <div className="font-semibold text-foreground">{template.steps.length} Tasks</div>
                  </div>
                </div>
              </div>

              {/* Variables Section */}
              {template.variables.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                    Dynamic Parameters ({template.variables.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable) => (
                      <code
                        key={variable}
                        className="px-2.5 py-1 rounded-md border border-box-border/80 bg-box-bg/25 text-xs text-accent-primary font-mono"
                      >
                        {variable}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                  Workflow Checklist ({template.steps.length} Steps)
                </h3>
                <div className="space-y-2.5">
                  {template.steps.map((step, index) => (
                    <div
                      key={`step-${index}`}
                      className="flex items-start gap-3 p-3 rounded-lg border border-box-border bg-box-bg/10 hover:bg-box-bg/20 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/25 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 select-none">
                        {index + 1}
                      </span>
                      <p className="text-xs text-foreground leading-normal pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="p-6 border-t border-box-border bg-box-bg/10 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-sm font-semibold rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => onUse(template)}
                className="flex-[2] py-3 text-sm font-bold rounded-xl bg-accent-primary text-slate-950 hover:bg-accent-primary/95 hover:scale-[1.01] shadow-lg shadow-accent-primary/5 hover:shadow-accent-primary/15 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Use This Template
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
