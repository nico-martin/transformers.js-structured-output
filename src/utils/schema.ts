import type {
  FieldResult,
  GenerationResult,
  JsonSchema,
  SchemaProperty,
} from "../types";

export function getTypeHint(property: SchemaProperty): string {
  if (property.enum)
    return property.enum.map((item) => `"${item}"`).join(" | ");
  if (property.format === "iso-date") return "YYYY-MM-DD";
  if (property.description) return property.description;
  if (property.type === "array") {
    const item = property.items;
    if (item && "type" in item && item.type === "object") return "item[]";
    return `${item && "type" in item ? item.type : "value"}[]`;
  }
  return property.type;
}

function validateValue(
  value: unknown,
  property: SchemaProperty
): string | undefined {
  if (property.type === "array") {
    if (!Array.isArray(value)) return "not an array";
    if (property.minItems !== undefined && value.length < property.minItems)
      return `fewer than ${property.minItems} items`;
    if (property.maxItems !== undefined && value.length > property.maxItems)
      return `more than ${property.maxItems} items`;
    if (property.items && property.items.type !== "object") {
      for (const item of value) {
        const reason = validateValue(item, property.items);
        if (reason) return `invalid item: ${reason}`;
      }
    }
    return undefined;
  }
  if (property.type === "integer") {
    if (!Number.isInteger(value)) return "not an integer";
  } else if (typeof value !== property.type) {
    return `not a ${property.type}`;
  }
  if (property.enum && !property.enum.includes(value as string | number)) {
    return "not in enum";
  }
  if (typeof value === "string") {
    const length = Array.from(value).length;
    if (property.minLength !== undefined && length < property.minLength)
      return `shorter than ${property.minLength} characters`;
    if (property.maxLength !== undefined && length > property.maxLength)
      return `longer than ${property.maxLength} characters`;
  }
  if (
    typeof value === "string" &&
    property.pattern &&
    !new RegExp(property.pattern).test(value)
  ) {
    return "does not match pattern";
  }
  if (
    property.format === "iso-date" &&
    (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
  ) {
    return "not a date";
  }
  if (
    typeof value === "number" &&
    property.minimum !== undefined &&
    value < property.minimum
  ) {
    return `below ${property.minimum}`;
  }
  if (
    typeof value === "number" &&
    property.maximum !== undefined &&
    value > property.maximum
  ) {
    return `above ${property.maximum}`;
  }
  return undefined;
}

export function validateOutput(
  raw: string,
  schema: JsonSchema
): GenerationResult {
  const started = performance.now();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      raw,
      data: null,
      fields: Object.keys(schema.properties).map((key) => ({
        key,
        value: undefined,
        valid: false,
        reason: "could not parse",
      })),
      parseStatus: "JSON.parse failed",
      valid: false,
      elapsed: performance.now() - started,
      tokensPerSecond: 0,
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      raw,
      data: null,
      fields: Object.keys(schema.properties).map((key) => ({
        key,
        value: undefined,
        valid: false,
        reason: "not an object",
      })),
      parseStatus: "JSON value is not an object",
      valid: false,
      elapsed: performance.now() - started,
      tokensPerSecond: 0,
    };
  }

  const data = parsed as Record<string, unknown>;
  const fields: FieldResult[] = Object.entries(schema.properties).map(
    ([key, property]) => {
      const value = data[key];
      const missing = value === undefined && schema.required?.includes(key);
      const reason = missing ? "missing field" : validateValue(value, property);
      return { key, value, valid: !reason, reason };
    }
  );
  const extras = Object.keys(data).filter((key) => !schema.properties[key]);
  const valid = fields.every((field) => field.valid) && extras.length === 0;
  return {
    raw,
    data,
    fields,
    parseStatus: valid
      ? "Valid JSON · schema match"
      : extras.length
        ? `Unexpected key: ${extras[0]}`
        : "Parsed JSON · schema mismatch",
    valid,
    elapsed: performance.now() - started,
    tokensPerSecond: 0,
  };
}

export function createValidResult(
  data: Record<string, unknown>,
  schema: JsonSchema,
  elapsed = 1180
): GenerationResult {
  const result = validateOutput(JSON.stringify(data), schema);
  return {
    ...result,
    elapsed,
    tokensPerSecond: Math.round(
      (JSON.stringify(data).length / 4 / elapsed) * 1000
    ),
  };
}
