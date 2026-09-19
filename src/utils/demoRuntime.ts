import type { JsonSchema, Preset, ReliabilityRun } from "../types";

const FAILURE_STYLES = [
  "fence",
  "commentary",
  "wrongType",
  "extraKey",
  "truncated",
] as const;

export function createFailure(preset: Preset, index = 0): ReliabilityRun {
  const validJson = JSON.stringify(preset.sample, null, 2);
  const style = FAILURE_STYLES[index % FAILURE_STYLES.length];
  if (style === "fence") {
    return {
      valid: false,
      raw: `\`\`\`json\n${validJson}\n\`\`\``,
      reason: "Markdown fences around JSON",
    };
  }
  if (style === "commentary") {
    return {
      valid: false,
      raw: `${validJson}\n\nHope that helps!`,
      reason: "Trailing commentary after JSON",
    };
  }
  if (style === "truncated") {
    return {
      valid: false,
      raw: validJson.slice(0, Math.floor(validJson.length * 0.72)),
      reason: "Truncated JSON",
    };
  }
  const changed = { ...preset.sample };
  if (style === "extraKey") {
    changed.confidence = 0.94;
    return {
      valid: false,
      raw: JSON.stringify(changed, null, 2),
      reason: "Invented key: confidence",
    };
  }
  const firstNumeric = Object.entries(preset.schema.properties).find(
    ([, property]) => property.type === "integer" || property.type === "number"
  );
  const key = firstNumeric?.[0] || Object.keys(preset.schema.properties)[0];
  changed[key] = `about ${String(changed[key])}`;
  return {
    valid: false,
    raw: JSON.stringify(changed, null, 2),
    reason: `Wrong type for ${key}`,
  };
}

export function createBatch(preset: Preset): {
  before: ReliabilityRun[];
  after: ReliabilityRun[];
} {
  const before = Array.from({ length: 25 }, (_, index) =>
    index % 4 === 0 || index % 9 === 0
      ? { valid: true, raw: JSON.stringify(preset.sample) }
      : createFailure(preset, index)
  );
  const after = Array.from({ length: 25 }, () => ({
    valid: true,
    raw: JSON.stringify(preset.sample),
  }));
  return { before, after };
}

export function schemaFromText(text: string): JsonSchema {
  const parsed: unknown = JSON.parse(text);
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("type" in parsed) ||
    !("properties" in parsed)
  ) {
    throw new Error("Schema needs type and properties");
  }
  return parsed as JsonSchema;
}
