"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FieldPalette } from "@/components/form-builder/field-palette";
import { Canvas } from "@/components/form-builder/canvas";
import { FieldSettings } from "@/components/form-builder/field-settings";
import type { FormSchema, FieldSchema } from "@/components/form-builder/types";
import {
  upsertFormIndex,
  saveSchemaById,
  loadSchemaById,
} from "@/components/form-builder/storage";
import Header from "@/components/header";

export default function BuilderPage() {
  const search = useSearchParams();
  const router = useRouter();
  const formIdFromUrl = search.get("id") || undefined;
  const createNewRequested = search.get("new") === "1";

  const initialForm: FormSchema = useMemo(
    () => ({
      id: formIdFromUrl || "current",
      name: "Untitled Form",
      fields: [],
    }),
    [formIdFromUrl]
  );

  const [form, setForm] = useState<FormSchema>(initialForm);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Load existing schema if id provided
  useEffect(() => {
    if (!formIdFromUrl) return;
    const loaded = loadSchemaById(formIdFromUrl);
    if (loaded) setForm(loaded);
  }, [formIdFromUrl]);

  // If ?new=1, generate id and redirect
  useEffect(() => {
    if (!createNewRequested) return;
    const newId = crypto.randomUUID();
    const next: FormSchema = { id: newId, name: "Untitled Form", fields: [] };
    saveSchemaById(newId, next);
    upsertFormIndex(newId, next.name);
    router.replace(`/builder?id=${newId}`);
  }, [createNewRequested, router]);

  function save() {
    if (formIdFromUrl) {
      saveSchemaById(formIdFromUrl, form);
      upsertFormIndex(formIdFromUrl, form.name);
      alert("Saved form.");
    } else {
      // Legacy fallback: no id in URL, do nothing special
      alert(
        "Tip: open this builder from the Dashboard to save to a specific form id."
      );
    }
  }

  function addField(f: FieldSchema) {
    const next = { ...form, fields: [...form.fields, f] };
    setForm(next);
    setSelectedId(f.id);
  }

  function moveField(from: number, to: number) {
    setForm((prev) => {
      const copy = [...prev.fields];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return { ...prev, fields: copy };
    });
  }

  function removeField(id: string) {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
    if (selectedId === id) setSelectedId(undefined);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex w-full flex-col">
        <Header onToggleMobileNav={() => setMobileNavOpen((v) => !v)}>
          <HeaderUpdate
            formName={form.name}
            onSave={save}
            formId={formIdFromUrl}
          />
        </Header>
        <main className="mx-auto w-full flex-1 px-4 py-6">
          <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)_320px]">
            <aside className="rounded-md border bg-card p-4 bg-zinc-900">
              <FieldPalette />
            </aside>

            <section className="flex flex-col gap-4 bg-zinc-950">
              <NameEditor
                name={form.name}
                onChange={(name) => setForm({ ...form, name })}
              />
              <Canvas
                form={form}
                onAddField={addField}
                onMoveField={moveField}
                onSelect={(id) => setSelectedId(id)}
                selectedId={selectedId}
                onRemoveField={removeField}
              />
            </section>

            <aside className="rounded-md border bg-card p-4 bg-zinc-900">
              <FieldSettings
                form={form}
                selectedId={selectedId}
                onChange={(next) => setForm(next)}
              />
            </aside>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

function HeaderUpdate({
  formName,
  onSave,
  formId,
}: {
  formName: string;
  onSave: () => void;
  formId?: string;
}) {
  return (
    <header className="sticky top-0 z-10  bg-background">
      <div className="mx-auto flex w-full  items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-lg hover:bg-accent hover:text-accent-foreground"
          >
            Back to Dashboard
          </Link>

          <Link
            href={formId ? `/preview?id=${formId}` : "/preview"}
            className="rounded-md bg-primary px-4 py-2 text-lg font-medium text-primary-foreground hover:opacity-90"
          >
            Preview
          </Link>
          <button
            type="button"
            onClick={onSave}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </header>
  );
}

function NameEditor({
  name,
  onChange,
}: {
  name: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium" htmlFor="form-name">
        Form name
      </label>
      <input
        id="form-name"
        className="max-w-sm flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Untitled Form"
        aria-label="Form name"
      />
    </div>
  );
}
