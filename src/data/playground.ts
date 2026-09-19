import type { JsonSchema } from "../types";

export type ConstraintMode = "json_schema" | "regex";
export type PlaygroundPresetId = "event" | "regex" | "custom";

export interface ConstraintSnapshot {
  mode: ConstraintMode;
  schemaText: string;
  regex: string;
}

export interface PlaygroundPreset {
  id: PlaygroundPresetId;
  label: string;
  hint: string;
  prompt: string;
  mode: ConstraintMode;
  schema?: JsonSchema;
  regex?: string;
  sample: string;
}

export const PLAYGROUND_MODELS = [
  {
    id: "onnx-community/gemma-4-E2B-it-ONNX",
    label: "Gemma 4 E2B",
    dtype: "q4f16",
  },
  {
    id: "onnx-community/LFM2.5-350M-ONNX",
    label: "LFM2.5 350M",
    dtype: "q4",
  },
  {
    id: "onnx-community/granite-4.0-h-micro-ONNX",
    label: "Granite 4.0 H Micro",
    dtype: "q4f16",
  },
] as const;

export const EVENT_SCHEMA: JsonSchema = {
  type: "object",
  properties: {
    title: { type: "string", title: "Event title" },
    date: { type: "string", title: "Date", format: "iso-date" },
    start: { type: "string", title: "Start", description: "HH:MM" },
    duration: {
      type: "integer",
      title: "Duration",
      description: "minutes",
    },
    location: {
      type: "string",
      title: "Location",
      enum: ["office", "remote", "other"],
    },
  },
  required: ["title", "date", "start", "duration", "location"],
  additionalProperties: false,
};

export const CUSTOM_SCHEMA: JsonSchema = {
  type: "object",
  properties: {
    answer: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["answer", "confidence"],
  additionalProperties: false,
};

export const CUSTOM_REGEX = "(yes|no|unsure)";

export const PLAYGROUND_PRESETS: PlaygroundPreset[] = [
  {
    id: "event",
    label: "Event extractor",
    hint: "JSON Schema",
    prompt:
      "Extract an event from this message:\n\nLet's move the design review to Friday, 18 September at 2:30pm. We'll meet in the office for 45 minutes.",
    mode: "json_schema",
    schema: EVENT_SCHEMA,
    sample: JSON.stringify(
      {
        title: "Design review",
        date: "2026-09-18",
        start: "14:30",
        duration: 45,
        location: "office",
      },
      null,
      2
    ),
  },
  {
    id: "regex",
    label: "Ticket triage",
    hint: "Regex",
    prompt:
      "Triage this support message. Reply with a priority (P0 is most urgent), a category, and a short lowercase summary:\n\nOur checkout page has been down for an hour and customers can't pay.",
    mode: "regex",
    regex: "P[0-3] \\| (billing|checkout|account|other) \\| [a-z ]{5,40}",
    sample: "P0 | checkout | checkout page is down and payments fail",
  },
  {
    id: "custom",
    label: "Custom",
    hint: "Start from scratch",
    prompt: "",
    mode: "json_schema",
    schema: CUSTOM_SCHEMA,
    sample: JSON.stringify({ answer: "example", confidence: 0.8 }, null, 2),
  },
];

export const DEFAULT_SCHEMA = EVENT_SCHEMA;

export const INITIAL_CONSTRAINT: ConstraintSnapshot = {
  mode: PLAYGROUND_PRESETS[0].mode,
  schemaText: JSON.stringify(EVENT_SCHEMA, null, 2),
  regex: PLAYGROUND_PRESETS[1].regex ?? "",
};
