import React from "react";
import { Clock, Layers, HelpCircle, AlertTriangle, Terminal, CheckCircle2, ListTodo, Info, HelpCircle as HelpIcon, FileCode, CheckSquare } from "lucide-react";
import { StepSpec, VariableSpec } from "../mockData";

interface LivePreviewProps {
  name: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  variables: VariableSpec[];
  steps: StepSpec[];
  tags: string[];
}

export default function LivePreview({
  name,
  description,
  category,
  difficulty,
  estimatedTime,
  variables,
  steps,
  tags
}: LivePreviewProps) {
  // Regex helper to wrap {{var_name}} in a styled tag
  const renderInterpolatedText = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);
    return parts.map((part, index) => {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        const varName = part.slice(2, -2);
        // Find if variable exists in spec
        const variableExists = variables.some((v) => v.name === varName);
        return (
          <span
            key={`preview-var-${index}`}
            className={`inline-flex px-1 py-0.2 rounded font-mono text-[10px] font-bold mx-0.5 border ${
              variableExists
                ? "bg-accent-primary/15 text-accent-primary border-accent-primary/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/15"
            }`}
            title={variableExists ? `Dynamic Variable: ${varName}` : `Warning: Variable "${varName}" not defined in builder!`}
          >
            {varName}
          </span>
        );
      }
      return part;
    });
  };

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
    <div className="border border-box-border bg-box-bg/10 rounded-2xl p-6 h-full flex flex-col justify-between overflow-y-auto max-h-[80vh] shadow-inner select-none relative">
      {/* Background glow watermark */}
      <div className="absolute top-2 right-4 text-[10px] font-mono text-text-muted/30 uppercase tracking-widest pointer-events-none">
        Live SOP Preview
      </div>

      <div className="space-y-6">
        {/* Category & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-accent-primary/10 text-accent-primary border border-accent-primary/15">
              {category || "Category"}
            </span>
            {difficulty && (
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getDifficultyStyles(difficulty)}`}>
                {difficulty}
              </span>
            )}
            {estimatedTime && (
              <span className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-text-muted/65" />
                {estimatedTime}
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight line-clamp-2">
            {name || "Untitled SOP Template"}
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            {description || "Provide a description for your reusable SOP."}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-box-bg/25 border border-box-border/80 text-[9px] font-semibold text-text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Variable list */}
        {variables.length > 0 && (
          <div className="p-3.5 rounded-xl border border-box-border bg-box-bg/10 space-y-2">
            <div className="text-[10px] font-bold text-foreground font-mono uppercase tracking-wider">
              Variables Schema ({variables.length})
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-text-muted">
              {variables.map((v) => (
                <div key={v.name} className="flex justify-between border-b border-box-border/20 pb-1">
                  <span className="text-accent-primary font-semibold">{v.name}</span>
                  <span className="text-text-muted/70">{v.type}{v.required ? "*" : ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps Preview */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-foreground font-mono uppercase tracking-wider">
            Workflow Steps ({steps.length})
          </div>

          {steps.length === 0 ? (
            <div className="text-center py-8 text-xs text-text-muted/50 font-mono">
              (No steps to display)
            </div>
          ) : (
            <div className="space-y-3.5">
              {steps.map((step, index) => (
                <div
                  key={`preview-step-${index}`}
                  className="p-4 rounded-xl border border-box-border bg-box-bg/5 space-y-2.5 relative"
                >
                  {/* Step Title Row */}
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 flex items-center justify-center font-mono text-[9px] font-bold">
                      {index + 1}
                    </span>
                    <h4 className="text-xs font-bold text-foreground">
                      {step.name || `Step ${index + 1}`}
                    </h4>
                  </div>

                  {/* Step Content */}
                  {step.content && (
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {renderInterpolatedText(step.content)}
                    </p>
                  )}

                  {/* Type Specific Elements */}
                  {step.type === "Command" && step.command && (
                    <div className="rounded-lg border border-box-border bg-black/60 p-2.5 font-mono text-[10px] text-accent-primary flex items-start justify-between group">
                      <code className="break-all whitespace-pre-wrap select-text">
                        {renderInterpolatedText(step.command)}
                      </code>
                    </div>
                  )}

                  {step.type === "Warning" && step.warningText && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg border border-accent-warning/20 bg-accent-warning/5 text-[10px] text-accent-warning">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-accent-warning" />
                      <p className="leading-normal">{renderInterpolatedText(step.warningText)}</p>
                    </div>
                  )}

                  {step.type === "Code Block" && step.code && (
                    <pre className="rounded-lg border border-box-border bg-black/50 p-2.5 font-mono text-[9px] text-foreground/80 overflow-x-auto">
                      <code>{renderInterpolatedText(step.code)}</code>
                    </pre>
                  )}

                  {step.type === "Checklist" && step.checklistItems && (
                    <div className="space-y-1.5 pl-2">
                      {step.checklistItems.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2 text-[10px] text-text-muted">
                          <CheckSquare className="w-3.5 h-3.5 text-accent-primary/60 shrink-0" />
                          <span>{renderInterpolatedText(item)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
