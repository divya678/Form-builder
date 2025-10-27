"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { FormSchema } from "./form-builder/types";
import { useRouter } from "next/navigation";
const Header = ({
  onToggleMobileNav,
  children,
}: {
  onToggleMobileNav: () => void;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  // Simple theme toggle: toggles html.dark and persists to localStorage
  function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
      // initialize from localStorage or prefers-color-scheme
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const shouldDark = stored ? stored === "dark" : prefersDark;
      setIsDark(shouldDark);
      if (shouldDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);

    function toggle() {
      const next = !isDark;
      setIsDark(next);
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }

    return (
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle theme"
        className="inline-flex font-medium items-center rounded-md border border-border px-4 py-2 text-lg hover:bg-accent hover:text-accent-foreground"
      >
        <span className="sr-only">Toggle theme</span>
        <span className="font-mono">{isDark ? "Dark" : "Light"}</span>
      </button>
    );
  }
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/";
  const createNew = async () => {
    const response = await fetch(`${url}api/forms`, {
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

  return (
    <header className="sticky top-0 pt-4 z-10 w-full bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full  items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent"
            onClick={onToggleMobileNav}
            aria-label="Toggle navigation"
          >
            {/* hamburger */}
            <span className="block h-0.5 w-4 bg-foreground" />
            <span className="mt-1 block h-0.5 w-4 bg-foreground" />
            <span className="mt-1 block h-0.5 w-4 bg-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={createNew}
            className={cn(
              "rounded-md bg-primary px-4 py-2 text-lg font-medium text-primary-foreground",
              "hover:opacity-90 cursor-pointer"
            )}
          >
            + Create New Form
          </button>
          {children && children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
