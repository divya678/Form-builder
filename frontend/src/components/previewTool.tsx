"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  RotateCcw,
  Edit3,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function PreviewToolbar({
  onReset,
  onEditToggle,
}: {
  onReset?: () => void;
  onEditToggle?: (active: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [compact, setCompact] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleEditToggle = () => {
    const next = !isEditMode;
    setIsEditMode(next);
    onEditToggle?.(next);
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-b-lg",
        "backdrop-blur-md border border-border/60 shadow-sm bg-background/80"
      )}
    >
      <div className="flex items-center gap-2 flex-wrap">
        {/* 🌗 Theme Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          title="Toggle Light/Dark Mode"
          className="flex items-center gap-1"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" /> Light
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" /> Dark
            </>
          )}
        </Button>

        {/* 🔄 Reset Form */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onReset}
          title="Reset Form"
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>

        {/* ✏️ Edit Mode */}
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={handleEditToggle}
          title="Toggle Edit Mode"
          className="flex items-center gap-1"
        >
          <Edit3 className="h-4 w-4" />
          {isEditMode ? "Editing" : "View Only"}
        </Button>

        {/* 🔳 Compact / Full */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCompact(!compact)}
          title="Toggle Compact / Full Preview"
          className="flex items-center gap-1"
        >
          {compact ? (
            <>
              <Maximize2 className="h-4 w-4" /> Full
            </>
          ) : (
            <>
              <Minimize2 className="h-4 w-4" /> Compact
            </>
          )}
        </Button>
      </div>

      {/* Status badge */}
      <span
        className={cn(
          "text-xs font-medium px-3 py-1 rounded-md transition-all",
          isEditMode
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isEditMode ? "Edit Mode Active" : "Preview Mode"}
      </span>
    </div>
  );
}
