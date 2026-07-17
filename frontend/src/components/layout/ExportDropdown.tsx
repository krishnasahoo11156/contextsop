"use client";

import React, { useState, useRef, useEffect } from "react";
import { FileDown, Loader2, FileText, Code, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { WorkflowDsl } from "@/lib/workflow";

interface ExportDropdownProps {
  dslPayload: WorkflowDsl;
  title: string;
}

export default function ExportDropdown({
  dslPayload,
  title,
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format: "markdown" | "html" | "pdf" | "json") => {
    setExportingType(format);
    setError(null);
    setIsOpen(false);

    try {
      const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

      if (format === "json") {
        // Client-side JSON export
        const jsonStr = JSON.stringify(dslPayload, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        handleDownload(blob, `${sanitizedTitle}.json`);
        setExportingType(null);
        return;
      }

      // Supabase Authentication session retrieval
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Backend export request
      const response = await fetch(`/api/v1/export/${format}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || "mock-token"}`,
        },
        body: JSON.stringify(dslPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error?.message || `Failed to export as ${format}`,
        );
      }

      const blob = await response.blob();
      const extension = format === "markdown" ? "md" : format;
      handleDownload(blob, `${sanitizedTitle}.${extension}`);
    } catch (err: unknown) {
      console.error(`Export to ${format} failed:`, err);
      setError(err instanceof Error ? err.message : "Export failed");
      // Clear error after 4 seconds
      setTimeout(() => setError(null), 4000);
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={exportingType !== null}
          className="inline-flex items-center justify-center gap-2 border border-box-border bg-[#182335]/60 hover:bg-[#202e44]/80 text-xs font-semibold py-2 px-4 rounded-xl text-foreground transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {exportingType ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Runbook</span>
            </>
          )}
        </button>
      </div>

      {/* Error alert toast */}
      {error && (
        <div className="absolute right-0 bottom-full mb-2 z-50 w-64 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs shadow-2xl backdrop-blur-sm animate-fadeIn">
          {error}
        </div>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-box-border bg-[#0f172a]/95 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden divide-y divide-box-border/30">
          <div className="py-1.5">
            <button
              onClick={() => handleExport("markdown")}
              className="group flex w-full items-center gap-3 px-4 py-2.5 text-xs text-text-muted hover:text-foreground hover:bg-[#1e293b]/60 transition-colors duration-150 text-left"
            >
              <FileText className="w-4 h-4 text-[#91a3b9] group-hover:text-accent-primary" />
              <div className="flex flex-col">
                <span className="font-semibold">Export as Markdown</span>
                <span className="text-[9px] text-[#5c6f84]">
                  Offline standard .md runbook
                </span>
              </div>
            </button>
            <button
              onClick={() => handleExport("html")}
              className="group flex w-full items-center gap-3 px-4 py-2.5 text-xs text-text-muted hover:text-foreground hover:bg-[#1e293b]/60 transition-colors duration-150 text-left"
            >
              <Globe className="w-4 h-4 text-[#91a3b9] group-hover:text-emerald-400" />
              <div className="flex flex-col">
                <span className="font-semibold">Export as HTML</span>
                <span className="text-[9px] text-[#5c6f84]">
                  Self-contained interactive page
                </span>
              </div>
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="group flex w-full items-center gap-3 px-4 py-2.5 text-xs text-text-muted hover:text-foreground hover:bg-[#1e293b]/60 transition-colors duration-150 text-left"
            >
              <FileText className="w-4 h-4 text-[#91a3b9] group-hover:text-red-400" />
              <div className="flex flex-col">
                <span className="font-semibold">Export as PDF</span>
                <span className="text-[9px] text-[#5c6f84]">
                  Print-ready formatted document
                </span>
              </div>
            </button>
          </div>
          <div className="py-1.5">
            <button
              onClick={() => handleExport("json")}
              className="group flex w-full items-center gap-3 px-4 py-2.5 text-xs text-text-muted hover:text-foreground hover:bg-[#1e293b]/60 transition-colors duration-150 text-left"
            >
              <Code className="w-4 h-4 text-[#91a3b9] group-hover:text-amber-400" />
              <div className="flex flex-col">
                <span className="font-semibold">Export as DSL JSON</span>
                <span className="text-[9px] text-[#5c6f84]">
                  Raw Workflow DSL representation
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
