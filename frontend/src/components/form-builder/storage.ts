"use client"

import type { FormSchema } from "./types"

export type FormIndexItem = {
  id: string
  name: string
  updatedAt: string
}

export const FORMS_INDEX_KEY = "formBuilder:forms"
export const LEGACY_SCHEMA_KEY = "formBuilder:schema"

export function schemaKey(id: string) {
  return `formBuilder:schema:${id}`
}

export function loadFormsIndex(): FormIndexItem[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(FORMS_INDEX_KEY)
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as FormIndexItem[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function saveFormsIndex(list: FormIndexItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(FORMS_INDEX_KEY, JSON.stringify(list))
}

export function upsertFormIndex(id: string, name: string) {
  const list = loadFormsIndex()
  const idx = list.findIndex((f) => f.id === id)
  const item: FormIndexItem = { id, name, updatedAt: new Date().toISOString() }
  if (idx === -1) list.unshift(item)
  else list[idx] = item
  saveFormsIndex(list)
}

export function deleteFormIndex(id: string) {
  const list = loadFormsIndex().filter((f) => f.id !== id)
  saveFormsIndex(list)
}

export function loadSchemaById(id: string): FormSchema | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(schemaKey(id))
  if (!raw) return null
  try {
    return JSON.parse(raw) as FormSchema
  } catch {
    return null
  }
}

export function saveSchemaById(id: string, schema: FormSchema) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(schemaKey(id), JSON.stringify(schema))
}

export function deleteSchemaById(id: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(schemaKey(id))
}
