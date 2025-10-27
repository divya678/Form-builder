"use client";

import { useDrag } from "react-dnd";
import type { FieldType } from "./types";
import { cn } from "@/lib/utils";
import {
  Type,
  Mail,
  Hash,
  List,
  CheckSquare,
  CircleDot,
  Calendar,
  Upload,
} from "lucide-react";

export const PALETTE_ITEM = "PALETTE_ITEM";

const PALETTE: Array<{
  type: FieldType;
  label: string;
  icon: React.ElementType;
}> = [
  { type: "text", label: "Text", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "number", label: "Number", icon: Hash },
  { type: "dropdown", label: "Dropdown", icon: List },
  { type: "checkbox", label: "Checkbox Group", icon: CheckSquare },
  { type: "radio", label: "Radio Group", icon: CircleDot },
  { type: "date", label: "Date", icon: Calendar },
  { type: "file", label: "File Upload", icon: Upload },
];

function PaletteItem({
  type,
  label,
  Icon,
}: {
  type: FieldType;
  label: string;
  Icon: React.ElementType;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: PALETTE_ITEM,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag as any}
      type="button"
      className={cn(
        "flex w-full rounded-md border bg-card px-8 py-2 text-sm transition",
        "hover:bg-accent hover:text-accent-foreground bg-zinc-900",
        isDragging && "opacity-50"
      )}
      aria-label={`Drag ${label} field`}
    >
      <Icon className="w-4 h-4 mr-4 text-gray-400" />
      {label}
    </button>
  );
}

export function FieldPalette() {
  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="text-sm font-medium">Fields</h2>
      <div className="grid gap-2 ">
        {PALETTE.map((p) => (
          <PaletteItem
            key={p.type}
            type={p.type}
            label={p.label}
            Icon={p.icon}
          />
        ))}
      </div>
    </div>
  );
}
