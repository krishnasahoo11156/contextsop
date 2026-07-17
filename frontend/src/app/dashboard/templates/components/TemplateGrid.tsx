import React from "react";
import { Template } from "../mockData";
import TemplateCard from "./TemplateCard";

interface TemplateGridProps {
  templates: Template[];
  onPreview: (template: Template) => void;
  onUse: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
  onToggleFavorite: (template: Template) => void;
}

export default function TemplateGrid({
  templates,
  onPreview,
  onUse,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite
}: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onPreview={onPreview}
          onUse={onUse}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
