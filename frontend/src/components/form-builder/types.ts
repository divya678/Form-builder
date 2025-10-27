export type FieldType = "text" | "email" | "number" | "dropdown" | "checkbox" | "radio" | "date" | "file"

export type FieldOption = {
  id: string
  label: string
  value: string
}

export type FieldCondition = {
  fieldId: string
  equals?: string
}

export type FieldSchema = {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: FieldOption[] // for dropdown, radio, checkbox (multi)
  condition?: FieldCondition // simple conditional visibility
}

export type FormSchema = {
  id: string
  name: string
  fields: FieldSchema[]
}
