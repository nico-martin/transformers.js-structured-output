import type { JsonSchema } from "../types";

export type ConstraintMode = "json_schema" | "regex";
export type PlaygroundPresetId = "event" | "palette" | "slug" | "custom";

export interface ConstraintSnapshot {
  mode: ConstraintMode;
  schemaText: string;
  regex: string;
}

export interface PlaygroundPreset {
  id: PlaygroundPresetId;
  label: string;
  hint: string;
  prompts: Record<ConstraintMode, string>;
  mode: ConstraintMode;
  schema: JsonSchema;
  regex: string;
  samples: Record<ConstraintMode, string>;
}

export const PLAYGROUND_MODELS = [
  {
    id: "onnx-community/LFM2.5-350M-ONNX",
    label: "LFM2.5 350M",
    dtype: "q4",
  },
  {
    id: "onnx-community/gemma-4-E2B-it-ONNX",
    label: "Gemma 4 E2B",
    dtype: "q4f16",
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

const EVENT_INPUT =
  "Let's move the design review to Friday, 18 September 2026 at 2:30pm. We'll meet in the office for 45 minutes.";
const PALETTE_TASK = "Create a three-color palette for a cozy autumn café.";
const SLUG_TASK =
  "Turn this article headline into a short URL slug: A Beginner's Guide to Running AI Locally.";

export const PLAYGROUND_PRESETS: PlaygroundPreset[] = [
  {
    id: "event",
    label: "Event extractor",
    hint: "JSON / Regex",
    prompts: {
      json_schema: `Extract the event from this message as JSON with the fields title, date (YYYY-MM-DD), start (HH:MM), duration (minutes) and location (office, remote or other).\n\n${EVENT_INPUT}`,
      regex: `Extract the event from this message. Return only title | date | start | duration | location, with spaces around each pipe. Use YYYY-MM-DD for date, 24-hour HH:MM for start, an integer number of minutes for duration, and office, remote or other for location.\n\n${EVENT_INPUT}`,
    },
    mode: "json_schema",
    schema: EVENT_SCHEMA,
    regex:
      "[^|\\r\\n]{1,80} \\| [0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) \\| ([01][0-9]|2[0-3]):[0-5][0-9] \\| [0-9]{1,4} \\| (office|remote|other)",
    samples: {
      regex: "Design review | 2026-09-18 | 14:30 | 45 | office",
      json_schema: JSON.stringify(
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
  },
  {
    id: "palette",
    label: "Color palette",
    hint: "JSON / Regex",
    prompts: {
      json_schema: `${PALETTE_TASK} Return a JSON object with a colors array containing exactly three uppercase hex colors.`,
      regex: `${PALETTE_TASK} Return three uppercase hex colors separated by commas, with no spaces.`,
    },
    mode: "regex",
    regex: "#[0-9A-F]{6}(,#[0-9A-F]{6}){2}",
    schema: {
      type: "object",
      properties: {
        colors: {
          type: "array",
          items: {
            type: "string",
            minLength: 7,
            maxLength: 7,
            description: "Uppercase hex color, such as #8B4513",
          },
          minItems: 3,
          maxItems: 3,
        },
      },
      required: ["colors"],
      additionalProperties: false,
    },
    samples: {
      json_schema: JSON.stringify(
        { colors: ["#8B4513", "#D2691E", "#FFF8DC"] },
        null,
        2
      ),
      regex: "#8B4513,#D2691E,#FFF8DC",
    },
  },
  {
    id: "slug",
    label: "URL slug",
    hint: "JSON / Regex",
    mode: "regex",
    prompts: {
      json_schema: `${SLUG_TASK} Return a JSON object with a slug field. Use lowercase ASCII letters and digits, with single hyphens between words.`,
      regex: `${SLUG_TASK} Return only the slug. Use lowercase ASCII letters and digits, with single hyphens between words.`,
    },
    schema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          minLength: 1,
          description:
            "Lowercase ASCII letters and digits, with single hyphens between words",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    regex: "[a-z0-9]+(-[a-z0-9]+)*",
    samples: {
      json_schema: JSON.stringify(
        { slug: "a-beginners-guide-to-running-ai-locally" },
        null,
        2
      ),
      regex: "a-beginners-guide-to-running-ai-locally",
    },
  },
  {
    id: "custom",
    label: "Custom",
    hint: "Start from scratch",
    prompts: { json_schema: "", regex: "" },
    mode: "json_schema",
    schema: CUSTOM_SCHEMA,
    regex: CUSTOM_REGEX,
    samples: {
      json_schema: JSON.stringify(
        { answer: "example", confidence: 0.8 },
        null,
        2
      ),
      regex: "yes",
    },
  },
];

export const DEFAULT_SCHEMA = EVENT_SCHEMA;

export const INITIAL_CONSTRAINT: ConstraintSnapshot = {
  mode: PLAYGROUND_PRESETS[0].mode,
  schemaText: JSON.stringify(EVENT_SCHEMA, null, 2),
  regex: PLAYGROUND_PRESETS[0].regex,
};
