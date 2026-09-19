import type { ConstraintMode } from "../data/playground";

export function buildInstruction(
  mode: ConstraintMode,
  schema?: unknown,
  regex?: string
): string {
  return mode === "json_schema"
    ? `Return only JSON matching this schema:\n${JSON.stringify(schema)}`
    : `Return only text matching this regular expression: ${regex}`;
}

export function buildPrompt(
  input: string,
  mode: ConstraintMode,
  schema?: unknown,
  regex?: string
): string {
  return `${input}\n\n${buildInstruction(mode, schema, regex)}`;
}
