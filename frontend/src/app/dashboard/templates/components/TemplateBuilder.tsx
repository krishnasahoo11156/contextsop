import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Sparkles, Terminal, Database, Server, Layers, Shield, HelpCircle } from "lucide-react";
import { Template, VariableSpec, StepSpec, StepType } from "../mockData";
import VariableBuilder from "./VariableBuilder";
import StepBuilder from "./StepBuilder";
import LivePreview from "./LivePreview";

interface TemplateBuilderProps {
  template: Template | null;
  onSave: (templateData: Omit<Template, "id" | "lastUsed" | "lastUsedTimestamp" | "createdTimestamp" | "timesUsed" | "isFavorite"> & { id?: string }) => void;
  onCancel: () => void;
}

const categories = [
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

const iconsList = [
  { name: "Terminal", icon: Terminal },
  { name: "Server", icon: Server },
  { name: "Database", icon: Database },
  { name: "Layers", icon: Layers },
  { name: "Shield", icon: Shield }
];

export default function TemplateBuilder({ template, onSave, onCancel }: TemplateBuilderProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("DevOps");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [estimatedTime, setEstimatedTime] = useState("10 mins");
  const [tagsText, setTagsText] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Terminal");

  // Builders State
  const [variables, setVariables] = useState<VariableSpec[]>([]);
  const [steps, setSteps] = useState<StepSpec[]>([]);

  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [variableErrors, setVariableErrors] = useState<Record<string, string>>({});
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // Initialize fields
  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setCategory(template.category);
      setDifficulty(template.difficulty);
      setEstimatedTime(template.estimatedTime);
      setVariables(template.variablesSpec || []);
      setSteps(template.stepsSpec || []);
      setTagsText(template.category); // Default tag
      setSelectedIcon("Terminal");
    } else {
      setName("");
      setDescription("");
      setCategory("DevOps");
      setDifficulty("Easy");
      setEstimatedTime("10 mins");
      setVariables([]);
      setSteps([]);
      setTagsText("");
      setSelectedIcon("Terminal");
    }
    setErrors({});
    setVariableErrors({});
    setStepErrors({});
  }, [template]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newVarErrors: Record<string, string> = {};
    const newStepErrors: Record<string, string> = {};
    let isValid = true;

    // General Validation
    if (!name.trim()) newErrors.name = "Template title is required";
    if (!description.trim()) newErrors.description = "Template description is required";
    if (!estimatedTime.trim()) newErrors.estimatedTime = "Estimated time is required";

    // Variables Validation
    const varNames = new Set<string>();
    variables.forEach((v, idx) => {
      const cleanName = v.name.trim();
      if (!cleanName) {
        newVarErrors[`var_${idx}`] = "Variable name cannot be empty";
        isValid = false;
      } else if (varNames.has(cleanName)) {
        newVarErrors[v.name] = `Duplicate variable name: "${v.name}"`;
        newVarErrors[`var_${idx}`] = `Duplicate variable name: "${v.name}"`;
        isValid = false;
      } else {
        varNames.add(cleanName);
      }

      if (v.type === "Dropdown" && (!v.options || v.options.length === 0)) {
        newVarErrors[v.name] = "Dropdown variable must have at least one option";
        isValid = false;
      }
    });

    // Steps Validation
    if (steps.length === 0) {
      newErrors.steps = "At least one workflow step is required";
      isValid = false;
    } else {
      steps.forEach((s) => {
        if (!s.name.trim()) {
          newStepErrors[s.id] = "Step title is required";
          isValid = false;
        }
        if (!s.content.trim()) {
          newStepErrors[s.id] = "Step content description is required";
          isValid = false;
        }
        if (s.type === "Command" && !s.command?.trim()) {
          newStepErrors[s.id] = "Command script text is required";
          isValid = false;
        }
        if (s.type === "Code Block" && !s.code?.trim()) {
          newStepErrors[s.id] = "Code snippet text is required";
          isValid = false;
        }
        if (s.type === "Warning" && !s.warningText?.trim()) {
          newStepErrors[s.id] = "Warning detail text is required";
          isValid = false;
        }
        if (s.type === "Checklist" && (!s.checklistItems || s.checklistItems.length === 0)) {
          newStepErrors[s.id] = "Checklist must have at least one task item";
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    setVariableErrors(newVarErrors);
    setStepErrors(newStepErrors);

    return Object.keys(newErrors).length === 0 && isValid;
  };

  const handleSave = () => {
    if (!validateForm()) {
      // Find first error and scroll to it
      return;
    }

    // Split tags
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      id: template?.id,
      name,
      description,
      category,
      difficulty,
      estimatedTime,
      variablesSpec: variables,
      stepsSpec: steps,
      variables: variables.map((v) => v.name), // keep in sync
      steps: steps.map((s) => s.name), // keep in sync
      version: template ? template.version + 1 : 1
    });
  };

  const parsedTags = tagsText
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground -m-6 md:-m-8">
      {/* Top sticky bar */}
      <div className="bg-sidebar-bg/95 border-b border-box-border px-6 py-4 flex items-center justify-between select-none shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg border border-box-border bg-box-bg/25 text-text-muted hover:text-foreground hover:bg-box-bg/50 transition-colors cursor-pointer flex items-center justify-center"
            title="Return to library"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-foreground tracking-tight">
              {template ? `Edit SOP: ${template.name}` : "Create Reusable SOP Workflow"}
            </h1>
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
              Template Builder
            </span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-accent-primary text-slate-950 hover:bg-accent-primary/95 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            Save Template
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Form (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-8 border-r border-box-border/60">
          
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider border-b border-box-border/60 pb-2 select-none">
              General Information
            </h3>
            
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                SOP Title
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Restart Kubernetes Deployment"
                className={`w-full px-4 py-2.5 rounded-xl border bg-box-bg/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 ${
                  errors.name ? "border-rose-500/50" : "border-box-border"
                }`}
              />
              {errors.name && <span className="text-[10px] text-rose-400 font-mono">{errors.name}</span>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what scenario this SOP template resolves..."
                rows={2}
                className={`w-full px-4 py-2.5 rounded-xl border bg-box-bg/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none ${
                  errors.description ? "border-rose-500/50" : "border-box-border"
                }`}
              />
              {errors.description && <span className="text-[10px] text-rose-400 font-mono">{errors.description}</span>}
            </div>

            {/* Grid for Cat, Diff, Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="category" className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-box-border bg-sidebar-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label htmlFor="difficulty" className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                  className="w-full px-4 py-2.5 rounded-xl border border-box-border bg-sidebar-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Est. Time */}
              <div className="space-y-1.5">
                <label htmlFor="estTime" className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                  Estimated Time
                </label>
                <input
                  type="text"
                  id="estTime"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="e.g. 15 mins"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-box-bg/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 ${
                    errors.estimatedTime ? "border-rose-500/50" : "border-box-border"
                  }`}
                />
                {errors.estimatedTime && <span className="text-[10px] text-rose-400 font-mono">{errors.estimatedTime}</span>}
              </div>
            </div>

            {/* Tags & Icons selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tags */}
              <div className="space-y-1.5">
                <label htmlFor="tags" className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center justify-between">
                  <span>Tags</span>
                  <span className="text-[9px] text-text-muted font-normal lowercase tracking-normal">Comma separated</span>
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="e.g. prod, crashloop, scaling"
                  className="w-full px-4 py-2.5 rounded-xl border border-box-border bg-box-bg/30 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
                />
              </div>

              {/* Template Icon Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground font-mono uppercase tracking-wider select-none">
                  Template Icon
                </label>
                <div className="flex gap-2">
                  {iconsList.map((ic) => {
                    const Icon = ic.icon;
                    const isSelected = selectedIcon === ic.name;
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() => setSelectedIcon(ic.name)}
                        className={`p-2.5 rounded-xl border flex-1 flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-accent-primary/10 border-accent-primary text-accent-primary"
                            : "bg-box-bg/20 border-box-border text-text-muted hover:text-foreground hover:bg-box-bg/50"
                        }`}
                        title={ic.name}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Variable Builder Component */}
          <VariableBuilder
            variables={variables}
            onChange={setVariables}
            errors={variableErrors}
          />

          {/* Step Builder Component */}
          <div className="space-y-2">
            <StepBuilder
              steps={steps}
              onChange={setSteps}
              errors={stepErrors}
            />
            {errors.steps && (
              <span className="text-xs text-rose-400 font-mono select-none block">
                {errors.steps}
              </span>
            )}
          </div>
        </div>

        {/* Right Sticky Preview (Scrollable) */}
        <div className="bg-box-bg/5 p-6 h-full flex flex-col justify-between overflow-hidden">
          <LivePreview
            name={name}
            description={description}
            category={category}
            difficulty={difficulty}
            estimatedTime={estimatedTime}
            variables={variables}
            steps={steps}
            tags={parsedTags}
          />
        </div>
      </div>
    </div>
  );
}
