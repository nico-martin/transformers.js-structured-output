export type PresetId = "calendar" | "review" | "order";
export type RunState = "idle" | "loading" | "running" | "complete" | "error";

export interface JsonSchema {
  type: "object";
  properties: Record<string, SchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface SchemaProperty {
  type: "string" | "number" | "integer" | "boolean" | "array";
  title?: string;
  description?: string;
  format?: string;
  enum?: Array<string | number>;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  items?: SchemaProperty | JsonSchema;
}

export interface Preset {
  id: PresetId;
  label: string;
  eyebrow: string;
  inputLabel: string;
  defaultInput: string;
  schema: JsonSchema;
  sample: Record<string, unknown>;
  payoff: string;
}

export interface FieldResult {
  key: string;
  value: unknown;
  valid: boolean;
  reason?: string;
}

export interface GenerationResult {
  raw: string;
  data: Record<string, unknown> | null;
  fields: FieldResult[];
  parseStatus: string;
  valid: boolean;
  elapsed: number;
  tokensPerSecond: number;
}

export interface ReliabilityRun {
  valid: boolean;
  raw: string;
  reason?: string;
}
