"use client";
import React from "react";
import { useDrop, useDrag } from "react-dnd";
import { PALETTE_ITEM } from "./field-palette";
import type { FieldSchema, FieldType, FormSchema } from "./types";
import { cn } from "@/lib/utils";

export const CANVAS_ITEM = "CANVAS_ITEM";

function newFieldOfType(type: FieldType): FieldSchema {
  const id = crypto.randomUUID();
  switch (type) {
    case "text":
      return { id, type, label: "Text", placeholder: "Enter text" };
    case "email":
      return { id, type, label: "Email", placeholder: "you@example.com" };
    case "number":
      return { id, type, label: "Number", placeholder: "0" };
    case "dropdown":
      return {
        id,
        type,
        label: "Dropdown",
        options: [
          { id: crypto.randomUUID(), label: "Option A", value: "A" },
          { id: crypto.randomUUID(), label: "Option B", value: "B" },
        ],
      };
    case "checkbox":
      return {
        id,
        type,
        label: "Checkbox Group",
        options: [
          { id: crypto.randomUUID(), label: "Option 1", value: "1" },
          { id: crypto.randomUUID(), label: "Option 2", value: "2" },
        ],
      };
    case "radio":
      return {
        id,
        type,
        label: "Radio Group",
        options: [
          { id: crypto.randomUUID(), label: "Yes", value: "yes" },
          { id: crypto.randomUUID(), label: "No", value: "no" },
        ],
      };
    case "date":
      return { id, type, label: "Date" };
    case "file":
      return { id, type, label: "File Upload" };
    default:
      return { id, type, label: "Field" };
  }
}

type CanvasProps = {
  form: FormSchema;
  onAddField: (f: FieldSchema) => void;
  onMoveField: (fromIndex: number, toIndex: number) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
  onRemoveField: (id: string) => void;
};

export function Canvas({
  form,
  onAddField,
  onMoveField,
  onSelect,
  selectedId,
  onRemoveField,
}: CanvasProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [PALETTE_ITEM],
      drop: (item: { type: FieldType }) => {
        onAddField(newFieldOfType(item.type));
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    }),
    [onAddField]
  );

  return (
    <div
      ref={drop as any}
      className={cn(
        "min-h-[400px] rounded-md border bg-card p-4 bg-zinc-950",
        isOver && "ring-2 ring-primary"
      )}
      aria-label="Form canvas drop area"
    >
      {form.fields.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-500 text-lg">
          🪄 Drag fields here to start building your form
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {form.fields.map((f, index) => (
            <CanvasFieldRow
              key={f.id}
              field={f}
              index={index}
              isSelected={selectedId === f.id}
              onClick={() => onSelect(f.id)}
              onMove={onMoveField}
              onRemove={() => onRemoveField(f.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CanvasFieldRow({
  field,
  index,
  isSelected,
  onClick,
  onMove,
  onRemove,
}: {
  field: FieldSchema;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: CANVAS_ITEM,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [, drop] = useDrop(
    () => ({
      accept: CANVAS_ITEM,
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          onMove(item.index, index);
          item.index = index;
        }
      },
    }),
    [index, onMove]
  );

  return (
    <li
      ref={(node) => {
        if (node) drag(drop(node));
      }}
      className={cn(
        "cursor-move rounded-md border p-3 transition",
        "bg-card hover:bg-accent hover:text-accent-foreground",
        isSelected && "ring-2 ring-primary",
        isDragging && "opacity-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <div className="font-medium">{field.label}</div>
          <div className="text-xs text-muted-foreground">{field.type}</div>
        </div>
        <button
          type="button"
          className="rounded-md border px-2 py-1 text-xs hover:bg-destructive hover:text-destructive-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove field"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
