"use client";

import type { FieldSchema, FormSchema } from "./types";
import { cn } from "@/lib/utils";

type Props = {
  form: FormSchema;
  selectedId?: string;
  onChange: (next: FormSchema) => void;
};

export function FieldSettings({ form, selectedId, onChange }: Props) {
  const field = form.fields.find((f) => f.id === selectedId);

  if (!field) {
    return (
      <div className="text-lg text-muted-foreground">
        Select a field to edit its settings.
      </div>
    );
  }

  function updateField(partial: Partial<FieldSchema>) {
    const next = {
      ...form,
      fields: form.fields.map((f) =>
        f.id === field?.id ? { ...f, ...partial } : f
      ),
    };
    onChange(next);
  }

  function updateOption(id: string, patch: { label?: string; value?: string }) {
    if (!field?.options) return;
    updateField({
      options: field.options.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    });
  }

  function addOption() {
    const id = crypto.randomUUID();
    updateField({
      options: [...(field?.options || []), { id, label: "Option", value: id }],
    });
  }

  function removeOption(id: string) {
    updateField({
      options: (field?.options || []).filter((o) => o.id !== id),
    });
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <h2 className="text-sm font-medium">Field Settings</h2>

      <div className="grid gap-3">
        <label className="text-xs" htmlFor="label">
          Label
        </label>
        <input
          id="label"
          className={cn("rounded-md border bg-background px-2 py-1 text-sm")}
          value={field.label}
          onChange={(e) => updateField({ label: e.target.value })}
        />
      </div>

      {!("checkbox" === field.type || "radio" === field.type) && (
        <div className="grid gap-3">
          <label className="text-xs" htmlFor="placeholder">
            Placeholder
          </label>
          <input
            id="placeholder"
            className="rounded-md border bg-background px-2 py-1 text-sm"
            value={field.placeholder ?? ""}
            onChange={(e) => updateField({ placeholder: e.target.value })}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          id="required"
          type="checkbox"
          checked={!!field.required}
          onChange={(e) => updateField({ required: e.target.checked })}
        />
        <label className="text-sm" htmlFor="required">
          Required
        </label>
      </div>

      {(field.type === "dropdown" ||
        field.type === "checkbox" ||
        field.type === "radio") && (
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Options</h3>
            <button
              type="button"
              onClick={addOption}
              className="rounded-md border px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
            >
              Add option
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {(field.options || []).map((o) => (
              <li key={o.id} className="flex items-center gap-2">
                <input
                  className="w-1/2 rounded-md border bg-background px-2 py-1 text-sm"
                  value={o.label}
                  aria-label="Option label"
                  onChange={(e) =>
                    updateOption(o.id, { label: e.target.value })
                  }
                />
                <input
                  className="w-1/2 rounded-md border bg-background px-2 py-1 text-sm"
                  value={o.value}
                  aria-label="Option value"
                  onChange={(e) =>
                    updateOption(o.id, { value: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => removeOption(o.id)}
                  className="rounded-md border px-2 py-1 text-xs hover:bg-destructive hover:text-destructive-foreground"
                  aria-label="Remove option"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-2">
        <h3 className="text-sm font-medium">Condition</h3>
        <p className="text-xs text-muted-foreground">
          Show this field only if another field equals a value.
        </p>
        <select
          className="rounded-md border bg-background px-2 py-1 text-sm"
          value={field.condition?.fieldId || ""}
          onChange={(e) =>
            updateField({
              condition: e.target.value
                ? { fieldId: e.target.value, equals: "" }
                : undefined,
            })
          }
        >
          <option value="">No condition</option>
          {form.fields
            .filter((f) => f.id !== field.id)
            .map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
        </select>
        {field.condition?.fieldId && (
          <input
            className="rounded-md border bg-background px-2 py-1 text-sm"
            placeholder="Equals value"
            value={field.condition?.equals || ""}
            onChange={(e) =>
              updateField({
                condition: {
                  fieldId: field.condition!.fieldId,
                  equals: e.target.value,
                },
              })
            }
          />
        )}
      </div>
    </div>
  );
}
