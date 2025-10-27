"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormSchema } from "./types";
import {
  deleteFormIndex,
  deleteSchemaById,
  loadFormsIndex,
  loadSchemaById,
  saveSchemaById,
  schemaKey,
  upsertFormIndex,
  type FormIndexItem,
} from "./storage";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function FormsDashboard() {
  const router = useRouter();
  const [forms, setForms] = useState<FormIndexItem[]>([]);

  useEffect(() => {
    setForms(loadFormsIndex());
  }, []);

  function refresh() {
    setForms(loadFormsIndex());
  }

  const createNew = async () => {
    const response = await fetch("http://localhost:9000/api/forms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Untitled Form", fields: [] }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push(`/builder?id=${data._id}`); // use MongoDB _id
    } else {
      alert("Error creating form");
    }
  };

  function remove(id: string) {
    if (!confirm("Delete this form?")) return;
    deleteSchemaById(id);
    deleteFormIndex(id);
    refresh();
  }

  function duplicate(id: string) {
    const original = loadSchemaById(id);
    if (!original) return;
    const newId = crypto.randomUUID();
    const copy: FormSchema = {
      ...original,
      id: newId,
      name: `Copy of ${original.name}`,
    };
    saveSchemaById(newId, copy);
    upsertFormIndex(newId, copy.name);
    refresh();
  }

  // Migrate legacy single schema into index once for convenience
  const didMigrate = useMemo(() => {
    if (typeof window === "undefined") return true;
    const legacyKey = "formBuilder:schema";
    const raw = window.localStorage.getItem(legacyKey);
    if (!raw) return true;
    try {
      const legacy = JSON.parse(raw) as FormSchema;
      // if already in index, skip
      const exists = loadFormsIndex().some(
        (f) =>
          f.id === legacy.id ||
          window.localStorage.getItem(schemaKey(legacy.id))
      );
      if (!exists) {
        const id = legacy.id || crypto.randomUUID();
        const normalized: FormSchema = { ...legacy, id };
        saveSchemaById(id, normalized);
        upsertFormIndex(id, normalized.name || "Untitled Form");
      }
      window.localStorage.removeItem(legacyKey);
      return true;
    } catch {
      return true;
    }
  }, []);

  return (
    <div className="w-full rounded-md border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold">Forms</h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            Create and manage forms. Select a form to edit or preview.
          </p>
        </div>
        <button
          type="button"
          onClick={createNew}
          className={cn(
            "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
            "hover:opacity-90"
          )}
        >
          + Create New Form
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(!didMigrate || forms.length === 0) && (
          <div className="col-span-full rounded-md border bg-background p-6 text-sm text-muted-foreground">
            No forms yet. Click “Create New Form” to get started.
          </div>
        )}

        {forms.map((item: any) => (
          <Card
            key={item.id}
            className="flex flex-col justify-between rounded-md border bg-background p-8"
          >
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mt-1 text-xs text-muted-foreground">
                Updated {formatDate(item?.updatedAt)}
              </p>
            </CardContent>
            <CardAction>
              {" "}
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/builder?id=${item.id}`}
                  className="rounded-md border px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  Edit
                </Link>
                <Link
                  href={`/preview?id=${item.id}`}
                  className="rounded-md border px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  Preview
                </Link>
                <button
                  type="button"
                  onClick={() => duplicate(item.id)}
                  className="ml-auto rounded-md border px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-md border px-3 py-2 text-xs hover:bg-destructive hover:text-destructive-foreground"
                >
                  Delete
                </button>
              </div>
            </CardAction>
          </Card>
        ))}
      </div>
    </div>
  );
}
