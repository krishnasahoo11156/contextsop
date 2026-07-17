import React from "react";
import { Plus, Trash2, Settings2, ShieldAlert } from "lucide-react";
import { VariableSpec } from "../mockData";

interface VariableBuilderProps {
  variables: VariableSpec[];
  onChange: (variables: VariableSpec[]) => void;
  errors?: Record<string, string>;
}

export default function VariableBuilder({ variables, onChange, errors = {} }: VariableBuilderProps) {
  const addVariable = () => {
    const name = `var_${variables.length + 1}`;
    onChange([
      ...variables,
      {
        name,
        type: "Text",
        required: true,
        defaultValue: "",
        placeholder: "",
        description: ""
      }
    ]);
  };

  const removeVariable = (index: number) => {
    onChange(variables.filter((_, idx) => idx !== index));
  };

  const updateVariable = (index: number, updates: Partial<VariableSpec>) => {
    const updated = variables.map((v, idx) => {
      if (idx === index) {
        const next = { ...v, ...updates };
        // Reset options if type changes away from Dropdown
        if (updates.type && updates.type !== "Dropdown") {
          delete next.options;
        }
        // Initialize options if type changes to Dropdown
        if (updates.type === "Dropdown" && !next.options) {
          next.options = ["Production", "Staging", "Development"];
        }
        return next;
      }
      return v;
    });
    onChange(updated);
  };

  const handleOptionsChange = (index: number, optionsString: string) => {
    const options = optionsString
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);
    updateVariable(index, { options });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-box-border/60 pb-2">
        <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">
          Variables Configuration ({variables.length})
        </h3>
        <button
          type="button"
          onClick={addVariable}
          className="px-2.5 py-1 rounded-lg border border-accent-primary/20 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Variable
        </button>
      </div>

      {variables.length === 0 ? (
        <div className="text-center p-6 rounded-xl border border-dashed border-box-border/80 bg-box-bg/5 select-none">
          <p className="text-xs text-text-muted">No dynamic variables defined yet. Click "Add Variable" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {variables.map((variable, index) => {
            const hasError = errors[variable.name] || errors[`var_${index}`];
            return (
              <div
                key={`var-builder-${index}`}
                className="p-4 rounded-xl border border-box-border/80 bg-box-bg/5 space-y-3 relative hover:border-box-border transition-colors group"
              >
                {/* Delete button (hover visible on desktop, always visible on mobile) */}
                <button
                  type="button"
                  onClick={() => removeVariable(index)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg border border-transparent text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove variable"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Main fields (Name, Type, Required) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                      Variable Name (use as `{"{{"}`name`{"}}"}`)
                    </label>
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => {
                        const cleanVal = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                        updateVariable(index, { name: cleanVal });
                      }}
                      placeholder="e.g. host_ip"
                      className={`w-full px-3 py-1.5 rounded-lg border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 ${
                        hasError ? "border-rose-500/50" : "border-box-border"
                      }`}
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                      Input Type
                    </label>
                    <select
                      value={variable.type}
                      onChange={(e) =>
                        updateVariable(index, { type: e.target.value as VariableSpec["type"] })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-sidebar-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20 cursor-pointer"
                    >
                      <option value="Text">Text</option>
                      <option value="Number">Number</option>
                      <option value="Dropdown">Dropdown</option>
                    </select>
                  </div>

                  {/* Required Toggle */}
                  <div className="flex items-center gap-2 pt-5 select-none">
                    <input
                      type="checkbox"
                      id={`req-${index}`}
                      checked={variable.required}
                      onChange={(e) => updateVariable(index, { required: e.target.checked })}
                      className="rounded border-box-border text-accent-primary focus:ring-accent-primary/25 cursor-pointer w-4 h-4"
                    />
                    <label
                      htmlFor={`req-${index}`}
                      className="text-xs font-semibold text-foreground cursor-pointer"
                    >
                      Required Field
                    </label>
                  </div>
                </div>

                {/* Extra settings (Default, Placeholder, Options, Description) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-box-border/30">
                  {/* Default Value */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                      Default Value
                    </label>
                    <input
                      type={variable.type === "Number" ? "number" : "text"}
                      value={variable.defaultValue}
                      onChange={(e) => updateVariable(index, { defaultValue: e.target.value })}
                      placeholder="Default input value"
                      className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
                    />
                  </div>

                  {/* Placeholder or Dropdown Options */}
                  {variable.type === "Dropdown" ? (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider flex items-center justify-between">
                        <span>Options</span>
                        <span className="text-[9px] text-text-muted font-normal lowercase tracking-normal">Comma separated</span>
                      </label>
                      <input
                        type="text"
                        value={variable.options?.join(", ") || ""}
                        onChange={(e) => handleOptionsChange(index, e.target.value)}
                        placeholder="e.g. Production, Staging, Dev"
                        className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={variable.placeholder || ""}
                        onChange={(e) => updateVariable(index, { placeholder: e.target.value })}
                        placeholder="e.g. Enter hostname"
                        className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
                      Helper Description
                    </label>
                    <input
                      type="text"
                      value={variable.description || ""}
                      onChange={(e) => updateVariable(index, { description: e.target.value })}
                      placeholder="e.g. Host IP or DNS endpoint targeting active server."
                      className="w-full px-3 py-1.5 rounded-lg border border-box-border bg-box-bg/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
                    />
                  </div>
                </div>

                {/* Inline Errors display */}
                {hasError && (
                  <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-mono select-none">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{hasError}</span>
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
