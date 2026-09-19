import type { ConstraintMode } from "../data/playground";
import { buildPrompt } from "./promptBuilder";

export type CodeVariant = "constrained" | "free";

export interface ExecutedCodeInput {
  variant: CodeVariant;
  modelId: string;
  dtype: string;
  prompt: string;
  mode: ConstraintMode;
  schemaText: string;
  regex: string;
}

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line, index) => (index === 0 ? line : pad + line))
    .join("\n");
}

function templateLiteral(text: string): string {
  return `\`${text
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")}\``;
}

function parseSchema(schemaText: string): unknown {
  try {
    return JSON.parse(schemaText);
  } catch {
    return schemaText;
  }
}

export function executedCode({
  variant,
  modelId,
  dtype,
  prompt,
  mode,
  schemaText,
  regex,
}: ExecutedCodeInput): string {
  const schema = parseSchema(schemaText);
  const content = buildPrompt(
    prompt,
    mode,
    mode === "json_schema" ? schema : undefined,
    regex
  );
  const responseFormat =
    mode === "json_schema"
      ? `{
  type: "json_schema",
  json_schema: ${indent(JSON.stringify(schema, null, 2), 2)},
}`
      : `{
  type: "regex",
  regex: ${JSON.stringify(regex)},
}`;

  const setup = `import { pipeline, TextStreamer } from "@huggingface/transformers";${
    variant === "constrained"
      ? `
import { StructuredOutputProcessor } from "@huggingface/transformers-structured-output";`
      : ""
  }

// 1. Load the model once. Weights are cached in the browser.
const generator = await pipeline(
  "text-generation",
  ${JSON.stringify(modelId)},
  { dtype: ${JSON.stringify(dtype)}, device: "webgpu" }
);

// 2. The chat messages. The instruction is appended to your prompt.
const messages = [
  {
    role: "user",
    content: ${templateLiteral(content)},
  },
];

const streamer = new TextStreamer(generator.tokenizer, {
  skip_prompt: true,
  skip_special_tokens: true,
  callback_function: (chunk) => console.log(chunk),
});`;

  if (variant === "free") {
    return `${setup}

// 3. Generate with sampling and no logits processor.
const output = await generator(messages, {
  max_new_tokens: 256,
  do_sample: true,
  temperature: 1,
  top_p: 0.95,
  top_k: 64,
  tokenizer_encode_kwargs: { enable_thinking: false },
  streamer,
});

console.log(output[0].generated_text.at(-1).content);`;
  }

  return `${setup}

// 3. The constraint, exactly as entered in the playground.
const constraint = new StructuredOutputProcessor(
  generator.tokenizer,
  ${indent(responseFormat, 2)}
);

// 4. Generate greedily. Tokens that break the constraint are masked out.
const output = await generator(messages, {
  max_new_tokens: 256,
  do_sample: false,
  tokenizer_encode_kwargs: { enable_thinking: false },
  streamer,
  logits_processor: constraint,
});

console.log(output[0].generated_text.at(-1).content);`;
}
