import React from "react";
import { Star } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export default function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-full border transition-all duration-200 active:scale-90 cursor-pointer ${
        isFavorite
          ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:scale-110 shadow-sm shadow-amber-500/5"
          : "bg-box-bg/20 border-box-border/80 text-text-muted hover:border-text-muted hover:text-foreground hover:scale-105"
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={`w-4 h-4 transition-transform duration-300 ${
          isFavorite ? "fill-amber-400 scale-110 rotate-[72deg]" : ""
        }`}
      />
    </button>
  );
}
