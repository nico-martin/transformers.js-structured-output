import {
  env,
  pipeline,
  TextStreamer,
  type TextGenerationPipeline,
} from "@huggingface/transformers";
import { StructuredOutputProcessor } from "@huggingface/transformers-structured-output";
import type { ResponseFormat } from "@huggingface/transformers-structured-output";
import { PLAYGROUND_MODELS, type ConstraintMode } from "../data/playground";
import { buildPrompt } from "./promptBuilder";

interface ProgressInfo {
  status: string;
  progress?: number;
}

interface LoadedRuntime {
  modelId: string;
  generator: TextGenerationPipeline;
}

let runtimePromise: Promise<LoadedRuntime> | undefined;
let loadedRuntime: LoadedRuntime | undefined;

env.useBrowserCache = true;

async function loadRuntime(
  modelId: string,
  onProgress: (progress: number) => void
): Promise<LoadedRuntime> {
  if (loadedRuntime?.modelId === modelId) return loadedRuntime;
  if (loadedRuntime && loadedRuntime.modelId !== modelId) {
    await loadedRuntime.generator.dispose();
    loadedRuntime = undefined;
    runtimePromise = undefined;
  }
  if (!runtimePromise) {
    runtimePromise = (async () => {
      const modelConfig = PLAYGROUND_MODELS.find((item) => item.id === modelId);
      if (!modelConfig) throw new Error(`Unsupported model: ${modelId}`);
      const generator = await pipeline("text-generation", modelId, {
        dtype: modelConfig.dtype,
        device: "webgpu",
        progress_callback: (info: ProgressInfo) => {
          if (info.status === "progress_total" && info.progress !== undefined) {
            onProgress(info.progress);
          }
        },
      });
      StructuredOutputProcessor.warmup(generator.tokenizer);
      loadedRuntime = { modelId, generator };
      onProgress(100);
      return loadedRuntime;
    })();
  }
  return runtimePromise;
}

export async function generateLocalOutput({
  modelId,
  input,
  mode,
  schema,
  regex,
  constrained,
  onProgress,
  onToken,
}: {
  modelId: string;
  input: string;
  mode: ConstraintMode;
  schema?: unknown;
  regex?: string;
  constrained: boolean;
  onProgress: (progress: number) => void;
  onToken: (text: string) => void;
}): Promise<{ raw: string; elapsed: number; tokensPerSecond: number }> {
  const { generator } = await loadRuntime(modelId, onProgress);
  const messages = [
    { role: "user", content: buildPrompt(input, mode, schema, regex) },
  ];
  let raw = "";
  let tokenCount = 0;
  const started = performance.now();
  const streamer = new TextStreamer(generator.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (text) => {
      raw += text;
      onToken(raw);
    },
    token_callback_function: (tokens) => {
      tokenCount += tokens.length;
    },
  });
  const responseFormat = (mode === "json_schema"
    ? { type: "json_schema", json_schema: schema }
    : { type: "regex", regex }) as unknown as ResponseFormat;
  const logitsProcessor = constrained
    ? new StructuredOutputProcessor(generator.tokenizer, responseFormat)
    : undefined;

  const output = await generator(messages, {
    max_new_tokens: 256,
    do_sample: !constrained,
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    tokenizer_encode_kwargs: { enable_thinking: false },
    streamer,
    logits_processor: logitsProcessor,
  });
  const elapsed = performance.now() - started;
  const reply = output[0].generated_text.at(-1)?.content;
  const text = typeof reply === "string" ? reply : raw;
  return {
    raw: text.trim(),
    elapsed,
    tokensPerSecond: Math.round((tokenCount / elapsed) * 1000),
  };
}
