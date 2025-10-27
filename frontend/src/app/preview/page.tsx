"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FormSchema } from "@/components/form-builder/types";
import { FormRenderer } from "@/components/form-builder/form-renderer";
import { loadSchemaById } from "@/components/form-builder/storage";
import Header from "@/components/header";
import PreviewToolbar from "@/components/previewTool";

const LEGACY_STORAGE_KEY = "formBuilder:schema";

export default function PreviewPage() {
  const search = useSearchParams();
  const id = search.get("id") || undefined;
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const found = loadSchemaById(id);
      setSchema(found);
      return;
    }
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      try {
        setSchema(JSON.parse(raw) as FormSchema);
      } catch {
        setSchema(null);
      }
    } else {
      setSchema(null);
    }
  }, [id]);

  const handleReset = () => {
    console.log("Form reset");
  };

  const handleEditToggle = (active: boolean) => {
    console.log("Edit mode:", active);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6">
      <header className=" flex items-center justify-between">
        <h1 className="text-base font-semibold">Preview</h1>
        <Header onToggleMobileNav={() => setMobileNavOpen((v) => !v)}>
          <div className="flex items-center gap-2">
            <Link
              href={id ? `/builder?id=${id}` : "/builder"}
              className="rounded-md border px-4 py-2 text-lg hover:bg-accent hover:text-accent-foreground"
            >
              Back to Builder
            </Link>
            <Link
              href="/"
              className="rounded-md border px-4 py-2 text-lg hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </Link>
          </div>
        </Header>
      </header>

      {!schema ? (
        <p className="text-sm text-muted-foreground">
          No saved form found. Go back to the builder and click Save.
        </p>
      ) : (
        <div className=" mt-6 border h-full rounded-lg">
          <PreviewToolbar
            onReset={handleReset}
            onEditToggle={handleEditToggle}
          />

          <FormRenderer schema={schema} />
        </div>
      )}
    </div>
  );
}
