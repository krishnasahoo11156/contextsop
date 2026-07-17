import React, { useState } from "react";
import {
  CheckCircle2,
  X,
  Play,
  ArrowLeft,
  ArrowRight,
  Clipboard,
  Check,
  RotateCw,
  AlertTriangle,
  Terminal,
  Layers,
  FileCode,
  StickyNote,
  ListTodo,
  Info,
  ChevronRight,
  ClipboardCopy
} from "lucide-react";
import { Template } from "../mockData";

interface SopViewerProps {
  template: Template;
  variables: Record<string, string>;
  onClose: () => void;
  onComplete: () => void;
}

export default function SopViewer({ template, variables, onClose, onComplete }: SopViewerProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
  
  // Verification Checks States
  const [verifyingStepId, setVerifyingStepId] = useState<string | null>(null);
  const [verificationLogs, setVerificationLogs] = useState<{ timestamp: string; stepName: string; log: string }[]>([]);

  // Clipboard state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Checklist states
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Input states
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const steps = template.stepsSpec;
  const currentStep = steps[currentStepIdx];

  // Helper: Variable Interpolation
  const interpolate = (text: string | undefined) => {
    if (!text) return "";
    let res = text;
    Object.entries(variables).forEach(([key, val]) => {
      res = res.replaceAll(`{{${key}}}`, val);
    });
    return res;
  };

  // Copy to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Trigger verification simulation
  const runVerification = (stepId: string, stepName: string) => {
    setVerifyingStepId(stepId);
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString();
      const successLog = {
        timestamp,
        stepName: interpolate(stepName),
        log: `SUCCESS: System validation query completed. Targets parsed and verify OK.`
      };
      setVerificationLogs((prev) => [successLog, ...prev]);
      setVerifyingStepId(null);
      // Auto-complete the step
      handleCompleteStep();
    }, 1500);
  };

  const handleCompleteStep = () => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps((prev) => [...prev, currentStep.id]);
    }
    setSkippedSteps((prev) => prev.filter((id) => id !== currentStep.id));
    
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleSkipStep = () => {
    if (!skippedSteps.includes(currentStep.id)) {
      setSkippedSteps((prev) => [...prev, currentStep.id]);
    }
    setCompletedSteps((prev) => prev.filter((id) => id !== currentStep.id));

    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  // Checklist handler
  const handleCheckItem = (key: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [key]: checked }));
  };

  const percentComplete = Math.round(
    ((completedSteps.length + skippedSteps.length) / steps.length) * 100
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground -m-6 md:-m-8">
      {/* Top Header Panel */}
      <div className="bg-sidebar-bg/95 border-b border-box-border px-6 py-4 flex items-center justify-between select-none shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-box-border bg-box-bg/25 text-text-muted hover:text-foreground hover:bg-box-bg/50 transition-colors cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
              Running SOP: {template.name}
            </h1>
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
              Execution Mode • Version v{template.version}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 transition-colors cursor-pointer"
        >
          Abort Run
        </button>
      </div>

      {/* Progress tracker bar */}
      <div className="bg-box-bg/10 border-b border-box-border/60 px-6 py-3 select-none flex items-center justify-between gap-4 shrink-0">
        <div className="flex-1 max-w-md bg-sidebar-border h-2 rounded-full overflow-hidden">
          <div
            className="bg-accent-primary h-full transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        <div className="text-xs font-mono text-text-muted shrink-0">
          {completedSteps.length} / {steps.length} Complete ({skippedSteps.length} Skipped)
        </div>
      </div>

      {/* Main Grid: Stepper on Left, logs/configs on Right */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        {/* Left Interactive Execution Panel (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Step navigation indicator */}
            <div className="flex gap-1.5 select-none overflow-x-auto pb-1">
              {steps.map((s, idx) => {
                const isActive = idx === currentStepIdx;
                const isCompleted = completedSteps.includes(s.id);
                const isSkipped = skippedSteps.includes(s.id);
                
                return (
                  <button
                    key={`step-nav-${s.id}`}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-accent-primary/10 border-accent-primary text-accent-primary font-bold shadow-md shadow-accent-primary/5"
                        : isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                        : isSkipped
                        ? "bg-sidebar-border/30 border-sidebar-border/60 text-text-muted"
                        : "bg-box-bg/25 border-box-border text-text-muted hover:bg-box-bg/50"
                    }`}
                  >
                    {idx + 1}. {s.name}
                  </button>
                );
              })}
            </div>

            {/* Active Step Panel */}
            <div className="p-6 rounded-2xl border border-box-border/80 bg-box-bg/5 space-y-5 shadow-lg relative">
              {/* Step Type Icon + Header */}
              <div className="flex items-center justify-between gap-3 border-b border-box-border/40 pb-3 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center font-mono text-xs font-bold border border-accent-primary/25">
                    {currentStepIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-foreground tracking-tight leading-none mb-1">
                      {currentStep.name}
                    </h3>
                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
                      {currentStep.type} Step
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Content Description */}
              {currentStep.content && (
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {interpolate(currentStep.content)}
                </p>
              )}

              {/* Interactive Widget depending on Type */}
              
              {/* Command Widget */}
              {currentStep.type === "Command" && currentStep.command && (
                <div className="rounded-xl border border-box-border bg-black/75 p-4 font-mono text-xs text-accent-primary relative group shadow-inner">
                  <div className="absolute right-3 top-3 select-none">
                    <button
                      onClick={() => handleCopy(currentStep.id, interpolate(currentStep.command))}
                      className="p-1.5 rounded-lg border border-box-border/40 text-text-muted hover:text-foreground hover:bg-box-bg/40 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedId === currentStep.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="break-all whitespace-pre-wrap select-text pr-16 pt-1 max-h-40 overflow-y-auto">
                    <code>{interpolate(currentStep.command)}</code>
                  </pre>
                </div>
              )}

              {/* Warning Widget */}
              {currentStep.type === "Warning" && currentStep.warningText && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-accent-warning/20 bg-accent-warning/5 text-xs text-accent-warning leading-relaxed shadow-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-accent-warning" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider text-[10px] mb-1">Attention Required</h5>
                    <p>{interpolate(currentStep.warningText)}</p>
                  </div>
                </div>
              )}

              {/* Code Block Widget */}
              {currentStep.type === "Code Block" && currentStep.code && (
                <div className="rounded-xl border border-box-border bg-black/60 p-4 font-mono text-xs text-foreground/80 relative overflow-hidden shadow-inner">
                  <div className="absolute right-3 top-3 select-none">
                    <button
                      onClick={() => handleCopy(currentStep.id, interpolate(currentStep.code))}
                      className="p-1.5 rounded-lg border border-box-border/40 text-text-muted hover:text-foreground hover:bg-box-bg/40 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === currentStep.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre className="break-all whitespace-pre-wrap select-text pr-12 max-h-52 overflow-y-auto">
                    <code>{interpolate(currentStep.code)}</code>
                  </pre>
                </div>
              )}

              {/* Checklist Widget */}
              {currentStep.type === "Checklist" && currentStep.checklistItems && (
                <div className="space-y-2 pl-2">
                  {currentStep.checklistItems.map((item, itemIdx) => {
                    const itemKey = `${currentStep.id}-${itemIdx}`;
                    const isChecked = checkedItems[itemKey] || false;
                    
                    return (
                      <div
                        key={itemKey}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer select-none ${
                          isChecked
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                            : "bg-box-bg/15 border-box-border text-text-muted hover:text-foreground hover:bg-box-bg/35"
                        }`}
                        onClick={() => handleCheckItem(itemKey, !isChecked)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleCheckItem(itemKey, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-box-border text-accent-primary focus:ring-accent-primary/25 cursor-pointer w-4 h-4 mt-0.5 shrink-0"
                        />
                        <span className={`text-xs leading-normal ${isChecked ? "line-through opacity-85" : ""}`}>
                          {interpolate(item)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Input Widget */}
              {currentStep.type === "Input" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider select-none">
                    Provide Log Output / Input Variable
                  </label>
                  <textarea
                    value={inputValues[currentStep.id] || ""}
                    onChange={(e) => setInputValues((prev) => ({ ...prev, [currentStep.id]: e.target.value }))}
                    placeholder="Type or paste logs here to keep record of execution..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-box-border bg-box-bg/30 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary/20"
                  />
                </div>
              )}

              {/* Verification Widget */}
              {currentStep.type === "Verification" && (
                <div className="p-4 rounded-xl border border-box-border bg-box-bg/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none">
                  <div>
                    <h5 className="text-xs font-bold text-foreground mb-1">Verify Automation Condition</h5>
                    <p className="text-[10px] text-text-muted">Runs system validation query checks to verify safety state.</p>
                  </div>
                  <button
                    type="button"
                    disabled={verifyingStepId === currentStep.id}
                    onClick={() => runVerification(currentStep.id, currentStep.name)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-accent-primary bg-accent-primary text-slate-950 hover:bg-accent-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {verifyingStepId === currentStep.id ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-3.5 h-3.5" />
                        Run Verification Check
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex gap-4 pt-6 border-t border-box-border/60 select-none">
            <button
              onClick={handlePreviousStep}
              disabled={currentStepIdx === 0}
              className="flex-1 py-3 text-xs font-semibold rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleSkipStep}
              className="flex-1 py-3 text-xs font-semibold rounded-xl border border-box-border bg-box-bg/35 text-text-muted hover:text-foreground hover:bg-box-bg/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              Skip Step
            </button>

            {currentStepIdx === steps.length - 1 ? (
              <button
                onClick={onComplete}
                className="flex-[2] py-3 text-xs font-bold rounded-xl bg-accent-primary text-slate-950 hover:bg-accent-primary/95 hover:scale-[1.01] shadow-lg shadow-accent-primary/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                Complete Run
              </button>
            ) : (
              <button
                onClick={handleCompleteStep}
                className="flex-[2] py-3 text-xs font-bold rounded-xl bg-accent-primary text-slate-950 hover:bg-accent-primary/95 hover:scale-[1.01] shadow-lg shadow-accent-primary/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Info Panel: Variables State & Verification Logs (col-span-1) */}
        <div className="bg-sidebar-bg/95 border-l border-box-border p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh] space-y-6 select-none relative z-10">
          
          {/* Active Variable values */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-box-border/60 pb-2">
              <Layers className="w-3.5 h-3.5 text-accent-primary" />
              Variables Configured
            </h3>
            <div className="space-y-2 font-mono text-[11px]">
              {Object.entries(variables).map(([name, val]) => (
                <div key={name} className="flex flex-col gap-0.5 border-b border-box-border/20 pb-1.5">
                  <span className="text-text-muted">{name}</span>
                  <span className="text-foreground font-semibold break-all">{val || "(empty)"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Logs panel */}
          <div className="flex-1 flex flex-col min-h-[300px] justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-box-border/60 pb-2">
                <Terminal className="w-3.5 h-3.5 text-accent-primary" />
                Verification Logs ({verificationLogs.length})
              </h3>
              
              {verificationLogs.length === 0 ? (
                <div className="text-center py-12 text-xs font-mono text-text-muted/50 border border-dashed border-box-border rounded-xl bg-box-bg/5">
                  (No logs generated yet)
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto font-mono text-[10px] pr-1.5">
                  {verificationLogs.map((log, idx) => (
                    <div
                      key={`verification-log-${idx}`}
                      className="p-3.5 rounded-xl border border-box-border bg-black/60 text-slate-300 space-y-1.5 animate-fadeIn shadow-sm"
                    >
                      <div className="flex justify-between text-text-muted text-[9px] border-b border-box-border/30 pb-1">
                        <span>{log.stepName}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-emerald-400 break-all leading-normal">{log.log}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
