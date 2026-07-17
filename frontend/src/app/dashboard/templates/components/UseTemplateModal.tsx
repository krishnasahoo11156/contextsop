import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Variable, HelpCircle } from "lucide-react";
import { Template } from "../mockData";

interface UseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (variableValues: Record<string, string>) => void;
  template: Template | null;
}

export default function UseTemplateModal({ isOpen, onClose, onConfirm, template }: UseTemplateModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset and pre-fill default values
  useEffect(() => {
    if (template) {
      const initial: Record<string, string> = {};
      template.variablesSpec.forEach((v) => {
        initial[v.name] = v.defaultValue || "";
      });
      setValues(initial);
      setErrors({});
    }
  }, [template, isOpen]);

  if (!template) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let isValid = true;

    template.variablesSpec.forEach((v) => {
      const val = values[v.name]?.trim() || "";
      if (v.required && !val) {
        newErrors[v.name] = `"${v.name}" is a required field.`;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    onConfirm(values);
  };

  const handleValueChange = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[100] backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg bg-sidebar-bg/95 backdrop-blur-xl border border-box-border/95 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-box-border/80 flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                    <Variable className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                      Instantiate SOP Workflow
                    </h3>
                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
                      Parameter Values Input
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-text-muted hover:text-foreground hover:bg-box-bg/50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="bg-box-bg/25 border border-box-border/60 rounded-xl p-3.5 space-y-1 select-none">
                  <h4 className="text-xs font-bold text-foreground">
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="space-y-3.5">
                  {template.variablesSpec.length === 0 ? (
                    <div className="text-center p-4 text-xs font-mono text-text-muted/60 select-none">
                      (No parameters required for this workflow)
                    </div>
                  ) : (
                    template.variablesSpec.map((v) => {
                      const hasError = errors[v.name];

                      return (
                        <div key={v.name} className="space-y-1.5">
                          <label className="text-[10px] font-bold text-foreground font-mono uppercase tracking-wider flex items-center justify-between">
                            <span>
                              {v.name}
                              {v.required && <span className="text-rose-400 ml-0.5">*</span>}
                            </span>
                            <span className="text-[9px] text-text-muted/75 font-normal normal-case">
                              ({v.type})
                            </span>
                          </label>

                          {/* Inputs switcher */}
                          {v.type === "Dropdown" ? (
                            <select
                              value={values[v.name] || ""}
                              onChange={(e) => handleValueChange(v.name, e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-box-border bg-sidebar-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 cursor-pointer"
                            >
                              <option value="" disabled>Select option...</option>
                              {v.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={v.type === "Number" ? "number" : "text"}
                              value={values[v.name] || ""}
                              onChange={(e) => handleValueChange(v.name, e.target.value)}
                              placeholder={v.placeholder || `Enter ${v.name}`}
                              className={`w-full px-3 py-2 rounded-xl border bg-box-bg/30 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 ${
                                hasError ? "border-rose-500/50" : "border-box-border"
                              }`}
                            />
                          )}

                          {/* Description */}
                          {v.description && (
                            <p className="text-[9px] text-text-muted flex items-start gap-1 select-none">
                              <HelpCircle className="w-3 h-3 text-text-muted/60 shrink-0 mt-0.5" />
                              <span>{v.description}</span>
                            </p>
                          )}

                          {/* Error block */}
                          {hasError && (
                            <span className="text-[10px] text-rose-400 font-mono block">
                              {hasError}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="p-5 border-t border-box-border bg-box-bg/10 flex justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-accent-primary text-slate-950 hover:bg-accent-primary/95 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md shadow-accent-primary/5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  Generate SOP
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
