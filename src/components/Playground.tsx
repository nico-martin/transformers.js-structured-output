import {
  ChevronDown,
  Code2,
  LoaderCircle,
  LockKeyhole,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  INITIAL_CONSTRAINT,
  PLAYGROUND_MODELS,
  PLAYGROUND_PRESETS,
  type ConstraintMode,
  type ConstraintSnapshot,
  type PlaygroundPreset,
  type PlaygroundPresetId,
} from "../data/playground";
import { Badge, Button, Card, Chip } from "../theme";
import type { JsonSchema, RunState, SchemaProperty } from "../types";
import { executedCode, type CodeVariant } from "../utils/executedCode";
import { validateOutput } from "../utils/schema";
import { enablePersistentModelStorage } from "../utils/storage";
import CodeModal from "./CodeModal";
import ConstraintEditor from "./ConstraintEditor";
import OutputInspector from "./OutputInspector";

interface RunResult {
  valid: boolean;
  label: string;
  elapsed: number;
  tokensPerSecond: number;
}

type Variant = "constrained" | "free";

const VARIANTS: Variant[] = ["constrained", "free"];

interface PanelState {
  output: string;
  result?: RunResult;
  error?: string;
}

const EMPTY_PANEL: PanelState = { output: "" };

interface PlaygroundProps {
  onConstraintChange?: (constraint: ConstraintSnapshot) => void;
}

const INITIAL = PLAYGROUND_PRESETS[0];
const REGEX_PRESET = PLAYGROUND_PRESETS.find(
  (preset) => preset.mode === "regex"
);

function createValue(property: SchemaProperty): unknown {
  if (property.enum?.length) return property.enum[0];
  if (property.type === "string") {
    if (property.format === "iso-date") return "2026-09-18";
    return property.description === "HH:MM" ? "14:30" : "example";
  }
  if (property.type === "integer") return property.minimum ?? 1;
  if (property.type === "number") return property.minimum ?? 1.5;
  if (property.type === "boolean") return true;
  if (property.type === "array") {
    if (!property.items) return [];
    if ("properties" in property.items) {
      return [createObjectFromSchema(property.items)];
    }
    return [createValue(property.items)];
  }
  return null;
}

function createObjectFromSchema(schema: JsonSchema): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(schema.properties).map(([key, property]) => [
      key,
      createValue(property),
    ])
  );
}

function validateGeneratedOutput(
  output: string,
  mode: ConstraintMode,
  schema: unknown,
  regex: string
): Pick<RunResult, "valid" | "label"> {
  if (mode === "regex") {
    try {
      const valid = new RegExp(`^(?:${regex})$`).test(output);
      return { valid, label: valid ? "Full match" : "Does not match" };
    } catch {
      return { valid: true, label: "Generated" };
    }
  }
  try {
    const parsed: unknown = JSON.parse(output);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { valid: false, label: "Not a JSON object" };
    }
  } catch {
    return { valid: false, label: "JSON.parse failed" };
  }
  try {
    const result = validateOutput(output, schema as JsonSchema);
    return {
      valid: result.valid,
      label: result.valid ? "Schema valid" : result.parseStatus,
    };
  } catch {
    return { valid: true, label: "Valid JSON" };
  }
}

export default function Playground({ onConstraintChange }: PlaygroundProps) {
  const [activePreset, setActivePreset] = useState<PlaygroundPresetId>(
    INITIAL.id
  );
  const [modelId, setModelId] = useState<string>(PLAYGROUND_MODELS[0].id);
  const [prompt, setPrompt] = useState(INITIAL.prompt);
  const [mode, setMode] = useState<ConstraintMode>(INITIAL_CONSTRAINT.mode);
  const [schemaText, setSchemaText] = useState(INITIAL_CONSTRAINT.schemaText);
  const [regex, setRegex] = useState(INITIAL_CONSTRAINT.regex);
  const [state, setState] = useState<RunState>("idle");
  const [phase, setPhase] = useState<Variant>("constrained");
  const [panels, setPanels] = useState<Record<Variant, PanelState>>({
    constrained: EMPTY_PANEL,
    free: EMPTY_PANEL,
  });
  const [modelProgress, setModelProgress] = useState(0);
  const [codeFor, setCodeFor] = useState<CodeVariant>();
  const webGpu = "gpu" in navigator;
  const model =
    PLAYGROUND_MODELS.find((item) => item.id === modelId) ??
    PLAYGROUND_MODELS[0];
  const busy = state === "loading" || state === "running";

  useEffect(() => {
    void enablePersistentModelStorage();
  }, []);

  const publishConstraint = (next: Partial<ConstraintSnapshot>) => {
    onConstraintChange?.({ mode, schemaText, regex, ...next });
  };

  const patchPanel = (variant: Variant, patch: Partial<PanelState>) =>
    setPanels((current) => ({
      ...current,
      [variant]: { ...current[variant], ...patch },
    }));

  const resetOutput = () => {
    setPanels({ constrained: EMPTY_PANEL, free: EMPTY_PANEL });
    setState("idle");
  };

  const applyPreset = (preset: PlaygroundPreset) => {
    if (preset.id === "custom" && activePreset === "custom") return;
    const nextSchemaText = preset.schema
      ? JSON.stringify(preset.schema, null, 2)
      : schemaText;
    const nextRegex = preset.regex ?? regex;
    setActivePreset(preset.id);
    setPrompt(preset.prompt);
    setMode(preset.mode);
    setSchemaText(nextSchemaText);
    setRegex(nextRegex);
    resetOutput();
    publishConstraint({
      mode: preset.mode,
      schemaText: nextSchemaText,
      regex: nextRegex,
    });
  };

  const markCustom = () => setActivePreset("custom");

  const changeMode = (nextMode: ConstraintMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    markCustom();
    resetOutput();
    publishConstraint({ mode: nextMode });
  };

  const changeConstraint = (value: string) => {
    markCustom();
    if (mode === "regex") {
      setRegex(value);
      publishConstraint({ regex: value });
      return;
    }
    setSchemaText(value);
    publishConstraint({ schemaText: value });
  };

  const parseConstraint = (): unknown => {
    if (mode !== "json_schema") return undefined;
    return JSON.parse(schemaText);
  };

  const demoOutput = (schema: unknown): string => {
    const preset = PLAYGROUND_PRESETS.find((item) => item.id === activePreset);
    if (mode === "regex") {
      return preset?.mode === "regex"
        ? preset.sample
        : (REGEX_PRESET?.sample ?? "");
    }
    try {
      return JSON.stringify(
        createObjectFromSchema(schema as JsonSchema),
        null,
        2
      );
    } catch {
      return preset?.sample ?? "{}";
    }
  };

  const demoFreeOutput = (schema: unknown): string =>
    mode === "regex"
      ? `Sure! Based on the message, I'd classify this as follows:

${demoOutput(schema)}

Let me know if you'd like me to adjust the priority.`
      : `Here is the extracted information:

\`\`\`json
${demoOutput(schema)}
\`\`\``;

  const runDemo = async (
    variant: Variant,
    schema: unknown
  ): Promise<boolean> => {
    const generated =
      variant === "constrained" ? demoOutput(schema) : demoFreeOutput(schema);
    const started = performance.now();
    for (let index = 1; index <= generated.length; index += 3) {
      patchPanel(variant, { output: generated.slice(0, index) });
      await new Promise((resolve) => window.setTimeout(resolve, 12));
    }
    patchPanel(variant, {
      output: generated,
      result: {
        ...validateGeneratedOutput(generated, mode, schema, regex),
        elapsed: performance.now() - started,
        tokensPerSecond: 38,
      },
    });
    return true;
  };

  const runLocal = async (
    variant: Variant,
    schema: unknown
  ): Promise<boolean> => {
    try {
      const { generateLocalOutput } = await import("../utils/modelRuntime");
      const generated = await generateLocalOutput({
        modelId,
        input: prompt,
        mode,
        schema,
        regex,
        constrained: variant === "constrained",
        onProgress: (progress) => {
          setModelProgress(progress);
          setState(progress < 100 ? "loading" : "running");
        },
        onToken: (text) => patchPanel(variant, { output: text }),
      });
      patchPanel(variant, {
        output: generated.raw,
        result: {
          ...validateGeneratedOutput(generated.raw, mode, schema, regex),
          elapsed: generated.elapsed,
          tokensPerSecond: generated.tokensPerSecond,
        },
      });
      return true;
    } catch (error) {
      console.error(`${variant} generation failed.`, error);
      patchPanel(variant, {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  };

  const run = async () => {
    if (!prompt.trim()) return;
    setPanels({ constrained: EMPTY_PANEL, free: EMPTY_PANEL });

    let schema: unknown;
    try {
      schema = parseConstraint();
    } catch (error) {
      patchPanel("constrained", {
        error: `Schema is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      });
      setState("error");
      return;
    }

    const runVariant = webGpu ? runLocal : runDemo;
    setState(webGpu ? "loading" : "running");
    let constrainedOk = true;
    for (const variant of VARIANTS) {
      setPhase(variant);
      const ok = await runVariant(variant, schema);
      if (variant === "constrained") constrainedOk = ok;
    }
    setState(constrainedOk ? "complete" : "error");
  };

  return (
    <section id="playground" className="scroll-mt-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs font-semibold tracking-wider text-coral uppercase">
            Live playground
          </p>
          <h2 className="mt-1 font-serif text-3xl font-semibold">
            Try a constraint
          </h2>
        </div>
        <p className="hidden text-xs text-slate-400 sm:block">
          First run downloads the model. Then it stays cached.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-none flex gap-2 overflow-x-auto">
            {PLAYGROUND_PRESETS.map((preset) => (
              <Chip
                key={preset.id}
                active={preset.id === activePreset}
                onClick={() => applyPreset(preset)}
                title={preset.hint}
              >
                {preset.label}
              </Chip>
            ))}
          </div>
          <label className="relative flex shrink-0 items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="hidden sm:inline">Model</span>
            <select
              value={modelId}
              onChange={(event) => {
                setModelId(event.target.value);
                setModelProgress(0);
                resetOutput();
              }}
              disabled={busy}
              className="h-9 appearance-none rounded-lg border border-line bg-white py-0 pr-8 pl-3 text-xs font-semibold text-ink outline-none hover:border-slate-400 disabled:opacity-50"
            >
              {PLAYGROUND_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.label} · {model.dtype}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-400" />
          </label>
        </div>

        <div className="border-b border-line bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="prompt"
              className="text-xs font-semibold text-slate-600"
            >
              Prompt
            </label>
            <span className="font-mono text-xs text-slate-400">
              {prompt.length} chars
            </span>
          </div>
          <textarea
            id="prompt"
            value={prompt}
            placeholder="Tell the model what to extract or answer…"
            onChange={(event) => {
              setPrompt(event.target.value);
              markCustom();
            }}
            className="min-h-32 w-full resize-y rounded-lg border border-line bg-stone-50 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col border-b border-line lg:border-r lg:border-b-0">
            <div className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
              <span className="text-xs font-semibold text-white">
                Constraint
              </span>
              <span className="font-mono text-xs text-slate-500">editable</span>
            </div>
            <ConstraintEditor
              mode={mode}
              value={mode === "regex" ? regex : schemaText}
              onModeChange={changeMode}
              onChange={changeConstraint}
              className="flex-1"
            />
            <div className="flex flex-col gap-3 border-t border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                {state === "loading" ? (
                  <span>Downloading model · {Math.round(modelProgress)}%</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <LockKeyhole className="h-3.5 w-3.5" /> Runs locally in this
                    tab
                  </span>
                )}
              </div>
              <Button
                onClick={() => void run()}
                disabled={busy || !prompt.trim()}
                className="sm:min-w-36"
              >
                {busy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
                {state === "loading"
                  ? "Loading model"
                  : state === "running"
                    ? "Generating"
                    : "Generate"}
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            {VARIANTS.map((variant) => {
              const panel = panels[variant];
              const active = busy && phase === variant;
              const panelState: RunState = active
                ? state
                : panel.error
                  ? "error"
                  : panel.result
                    ? "complete"
                    : "idle";
              return (
                <div
                  key={variant}
                  className={`flex flex-1 flex-col ${
                    variant === "constrained" ? "border-b border-line" : ""
                  }`}
                >
                  <OutputInspector
                    title={
                      variant === "constrained"
                        ? "Constrained"
                        : "Unconstrained"
                    }
                    output={panel.output}
                    valid={panel.result?.valid}
                    validationLabel={panel.result?.label || "Waiting"}
                    state={panelState}
                    elapsed={panel.result?.elapsed}
                    tokensPerSecond={panel.result?.tokensPerSecond}
                    error={panel.error}
                    className="flex-1"
                    actions={
                      <button
                        onClick={() => setCodeFor(variant)}
                        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-stone-100 hover:text-ink"
                      >
                        <Code2 className="h-3.5 w-3.5" /> Code
                      </button>
                    }
                    badge={
                      !webGpu ? (
                        <Badge tone="amber">demo</Badge>
                      ) : variant === "constrained" ? (
                        <Badge tone="green">
                          {mode === "regex" ? "regex" : "json schema"}
                        </Badge>
                      ) : (
                        <Badge>no processor</Badge>
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <CodeModal
        open={codeFor !== undefined}
        onClose={() => setCodeFor(undefined)}
        title={
          codeFor === "free"
            ? "Unconstrained generation"
            : "Constrained generation"
        }
        code={executedCode({
          variant: codeFor ?? "constrained",
          modelId: model.id,
          dtype: model.dtype,
          prompt,
          mode,
          schemaText,
          regex,
        })}
      />
    </section>
  );
}
