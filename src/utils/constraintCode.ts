import type { ConstraintSnapshot } from "../data/playground";

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line, index) => (index === 0 ? line : pad + line))
    .join("\n");
}

export function constraintCode({
  mode,
  schemaText,
  regex,
}: ConstraintSnapshot): string {
  const config =
    mode === "json_schema"
      ? `{
  type: "json_schema",
  json_schema: ${indent(schemaText.trim(), 2)},
}`
      : `{
  type: "regex",
  regex: ${JSON.stringify(regex)},
}`;
  return `import { pipeline } from "@huggingface/transformers";
import { StructuredOutputProcessor } from "@huggingface/transformers-structured-output";

const generator = await pipeline("text-generation", modelId);

const constraint = new StructuredOutputProcessor(
  generator.tokenizer,
  ${indent(config, 2)}
);

const output = await generator(messages, {
  logits_processor: constraint,
});`;
}
