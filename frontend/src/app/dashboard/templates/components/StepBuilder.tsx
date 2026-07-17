import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Copy, ChevronDown, ChevronRight, CheckSquare } from "lucide-react";
import { StepSpec, StepType } from "../mockData";

interface StepBuilderProps {
  steps: StepSpec[];
  onChange: (steps: StepSpec[]) => void;
  errors?: Record<string, string>;
}

const stepTypes: StepType[] = [
  "Information",
  "Warning",
  "Command",
  "Verification",
  "Checklist",
  "Input",
  "Code Block",
  "Notes"
];

export default function StepBuilder({ steps, onChange, errors = {} }: StepBuilderProps) {
  const [collapsedSteps, setCollapsedSteps] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addStep = () => {
    const id = `s_${Date.now()}`;
    const newStep: StepSpec = {
      id,
      type: "Information",
      name: `Step ${steps.length + 1}`,
      content: ""
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    onChange(steps.filter((s) => s.id !== id));
  };

  const duplicateStep = (step: StepSpec) => {
    const id = `s_${Date.now()}`;
    const copyStep: StepSpec = {
      ...step,
      id,
      name: `${step.name} Copy`
    };
    const index = steps.findIndex((s) => s.id === step.id);
    const updated = [...steps];
    updated.splice(index + 1, 0, copyStep);
    onChange(updated);
  };

  const updateStep = (id: string, updates: Partial<StepSpec>) => {
    const updated = steps.map((s) => {
      if (s.id === id) {
        const next = { ...s, ...updates };
        // Handle step-type conversions to make sure proper spec is loaded
        if (updates.type) {
          if (updates.type === "Checklist" && !next.checklistItems) {
            next.checklistItems = ["Check task 1", "Check task 2"];
          }
          if (updates.type === "Command" && !next.command) {
            next.command = "echo 'Running command...'";
          }
          if (updates.type === "Code Block" && !next.code) {
            next.code = "// Write your script here";
          }
          if (updates.type === "Warning" && !next.warningText) {
            next.warningText = "Warning: High Risk Execution";
          }
        }
        return next;
      }
      return s;
    });
    onChange(updated);
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === steps.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleChecklistChange = (id: string, itemsText: string) => {
    const checklistItems = itemsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    updateStep(id, { checklistItems });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-box-border/60 pb-2 select-none">
        <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">
          Workflow Steps Configuration ({steps.length})
        </h3>
        <button
          type="button"
          onClick={addStep}
          className="px-2.5 py-1 rounded-lg border border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Step
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="text-center p-8 rounded-xl border border-dashed border-box-border/80 bg-box-bg/5 select-none">
          <p className="text-xs text-text-muted">No steps defined yet. Click "Add Step" to initialize your workflow.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCollapsed = collapsedSteps[step.id] || false;
            const hasError = errors[step.id];

            return (
              <div
                key={`step-builder-${step.id}`}
                className={`rounded-xl border bg-box-bg/5 transition-all overflow-hidden ${
                  hasError ? "border-rose-500/50" : "border-box-border/80 hover:border-box-border"
                }`}
              >
                {/* Step Bar Header */}
                <div className="flex items-center justify-between gap-3 p-3 bg-box-bg/15 border-b border-box-border/40 select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleCollapse(step.id)}
                      className="p-1 rounded text-text-muted hover:text-foreground cursor-pointer"
                    >
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <span className="w-5 h-5 rounded-full bg-accent-primary/15 text-accent-primary flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                      {index + 1}
                    </span>

                    <h4 className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-sm md:max-w-md">
                      {step.name || "(Unnamed Step)"}
                    </h4>

                    <span className="inline-block px-1.5 py-0.5 rounded bg-sidebar-border text-text-muted text-[8px] font-mono uppercase font-semibold border border-sidebar-border/85">
                      {step.type}
                    </span>
                  </div>

                  {/* Top Bar Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveStep(index, "up")}
                      className="p-1 rounded text-text-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === steps.length - 1}
                      onClick={() => moveStep(index, "down")}
                      className="p-1 rounded text-text-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => duplicateStep(step)}
                      className="p-1 rounded text-text-muted hover:text-foreground cursor-pointer"
                      title="Duplicate step"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="p-1 rounded text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Step Form Body (visible if expanded) */}
                {!isCollapsed && (
                  <div className="p-4 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                          Step Title
                        </label>
                        <input
                          type="text"
                          value={step.name}
                          onChange={(e) => updateStep(step.id, { name: e.target.value })}
                          placeholder="e.g. Restart API server"
                          className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
                        />
                      </div>

                      {/* Type input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                          Step Type
                        </label>
                        <select
                          value={step.type}
                          onChange={(e) => updateStep(step.id, { type: e.target.value as StepType })}
                          className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-sidebar-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 cursor-pointer"
                        >
                          {stepTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                        Content / Description (use variables like `{"{{"}`var_name`{"}}"}`)
                      </label>
                      <textarea
                        value={step.content}
                        onChange={(e) => updateStep(step.id, { content: e.target.value })}
                        placeholder="Explain what to do in this step. Variables get automatically replaced."
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 resize-none font-sans"
                      />
                    </div>

                    {/* Custom editor per Type */}
                    {step.type === "Command" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                          Command Code block
                        </label>
                        <textarea
                          value={step.command || ""}
                          onChange={(e) => updateStep(step.id, { command: e.target.value })}
                          placeholder="e.g. systemctl restart {{service_name}}"
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-accent-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 font-mono resize-y"
                        />
                      </div>
                    )}

                    {step.type === "Code Block" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                          Source Code block
                        </label>
                        <textarea
                          value={step.code || ""}
                          onChange={(e) => updateStep(step.id, { code: e.target.value })}
                          placeholder="Write code block..."
                          rows={3}
                          className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 font-mono resize-y"
                        />
                      </div>
                    )}

                    {step.type === "Warning" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                          Warning Alert details
                        </label>
                        <input
                          type="text"
                          value={step.warningText || ""}
                          onChange={(e) => updateStep(step.id, { warningText: e.target.value })}
                          placeholder="e.g. Critical: Reverting schema alters raw postgres metadata."
                          className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
                        />
                      </div>
                    )}

                    {step.type === "Checklist" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider flex items-center justify-between">
                          <span>Checklist Items</span>
                          <span className="text-[9px] text-text-muted font-normal lowercase tracking-normal">One item per line</span>
                        </label>
                        <textarea
                          value={step.checklistItems?.join("\n") || ""}
                          onChange={(e) => handleChecklistChange(step.id, e.target.value)}
                          placeholder="Check item 1&#10;Check item 2"
                          rows={3}
                          className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 resize-y font-sans"
                        />
                      </div>
                    )}

                    {/* Error display */}
                    {hasError && (
                      <span className="text-[10px] text-rose-400 font-mono block">
                        {hasError}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
