"use client";

import type React from "react";

import { useState } from "react";
import type { FieldSchema, FormSchema } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

function shouldShowField(
  field: FieldSchema,
  values: Record<string, any>
): boolean {
  if (!field.condition) return true;
  const targetValue = values[field.condition.fieldId];
  return (
    field.condition.equals === undefined ||
    targetValue === field.condition.equals
  );
}

export function FormRenderer({ schema }: { schema: FormSchema }) {
  const [values, setValues] = useState<Record<string, any>>({});

  function update(id: string, value: any) {
    setValues((v) => ({ ...v, [id]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For demo, just log the submission
    console.log("[v0] Form submitted:", values);
    alert("Submitted! Check console for values.");
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="m-auto mt-8 w-2xl rounded-md border bg-card p-6 "
      >
        <div className="border-b border-neutral-800 pb-2 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-200 capitalize">
            {schema.name || "Untitled Form"}
          </h2>
        </div>

        <div className="grid gap-4">
          {schema.fields.map((f) => {
            if (!shouldShowField(f, values)) return null;
            return (
              <div key={f.id} className="grid gap-2">
                <label className="text-sm font-medium" htmlFor={f.id}>
                  {f.label}
                  {f.required && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </label>
                <FieldInput field={f} value={values[f.id]} onChange={update} />
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-md  px-4 py-2 w-2xs">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: any;
  onChange: (id: string, v: any) => void;
}) {
  if (
    field.type === "text" ||
    field.type === "email" ||
    field.type === "number"
  ) {
    return (
      <input
        id={field.id}
        type={field.type === "number" ? "number" : field.type}
        required={!!field.required}
        placeholder={field.placeholder}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        value={value ?? ""}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    );
  }

  if (field.type === "date") {
    return (
      <input
        id={field.id}
        type="date"
        required={!!field.required}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        value={value ?? ""}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    );
  }

  if (field.type === "file") {
    return (
      <input
        id={field.id}
        type="file"
        required={!!field.required}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        onChange={(e) =>
          onChange(field.id, (e.target as HTMLInputElement).files?.[0] ?? null)
        }
      />
    );
  }

  if (field.type === "dropdown") {
    return (
      <select
        id={field.id}
        required={!!field.required}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        value={value ?? ""}
        onChange={(e) => onChange(field.id, e.target.value)}
      >
        <option value="">Select…</option>
        {(field.options || []).map((o) => (
          <option key={o.id} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="flex flex-col gap-2">
        {(field.options || []).map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={field.id}
              value={o.value}
              checked={value === o.value}
              onChange={(e) =>
                onChange(field.id, (e.target as HTMLInputElement).value)
              }
              required={!!field.required}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "checkbox") {
    const arr: string[] = Array.isArray(value) ? value : [];
    function toggle(v: string) {
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      onChange(field.id, next);
    }
    return (
      <div className="flex flex-col gap-2">
        {(field.options || []).map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={arr.includes(o.value)}
              onChange={() => toggle(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    );
  }

  return null;
}
