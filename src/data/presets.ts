import type { Preset } from "../types";

export const PRESETS: Preset[] = [
  {
    id: "calendar",
    label: "Email → calendar",
    eyebrow: "Extract an event",
    inputLabel: "Pasted email",
    defaultInput:
      "Hey team — let’s move the design review to Friday, 18 September at 2:30pm. We’ll meet in the 4th floor studio for 45 minutes. See you there! — Maya",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", title: "Event title" },
        date: { type: "string", title: "Date", format: "iso-date" },
        start: { type: "string", title: "Start time", description: "HH:MM" },
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
    },
    sample: {
      title: "Design review",
      date: "2026-09-18",
      start: "14:30",
      duration: 45,
      location: "office",
    },
    payoff: "Added to calendar",
  },
  {
    id: "review",
    label: "Review → rating",
    eyebrow: "Understand feedback",
    inputLabel: "Product review",
    defaultInput:
      "The speakers sound excellent and setup took two minutes. The battery lasted all weekend. I wish the buttons were easier to see, but at this price I’d absolutely recommend it.",
    schema: {
      type: "object",
      properties: {
        rating: { type: "integer", title: "Rating", minimum: 1, maximum: 5 },
        pros: { type: "array", title: "Pros", items: { type: "string" } },
        cons: { type: "array", title: "Cons", items: { type: "string" } },
        recommend: { type: "boolean", title: "Recommend" },
      },
      required: ["rating", "pros", "cons", "recommend"],
      additionalProperties: false,
    },
    sample: {
      rating: 4,
      pros: ["Excellent sound", "Easy setup", "Long battery life"],
      cons: ["Buttons are hard to see"],
      recommend: true,
    },
    payoff: "Rating card rendered",
  },
  {
    id: "order",
    label: "Order → form",
    eyebrow: "Fill an order",
    inputLabel: "Free-text order",
    defaultInput:
      "Send 2 black desk lamps and one walnut monitor stand to Alex Morgan, 18 River Street, Portland. Standard delivery is fine.",
    schema: {
      type: "object",
      properties: {
        customer: { type: "string", title: "Customer" },
        address: { type: "string", title: "Address" },
        items: { type: "array", title: "Items", items: { type: "string" } },
        delivery: {
          type: "string",
          title: "Delivery",
          enum: ["standard", "express", "pickup"],
        },
      },
      required: ["customer", "address", "items", "delivery"],
      additionalProperties: false,
    },
    sample: {
      customer: "Alex Morgan",
      address: "18 River Street, Portland",
      items: ["2 × Black desk lamp", "1 × Walnut monitor stand"],
      delivery: "standard",
    },
    payoff: "Order form filled",
  },
];

export const MODELS = [
  {
    id: "onnx-community/gemma-4-E2B-it-ONNX",
    label: "Gemma 4 · E2B",
    size: "WebGPU",
  },
  {
    id: "onnx-community/SmolLM2-360M-Instruct-ONNX",
    label: "SmolLM2 · 360M",
    size: "386 MB",
  },
] as const;
