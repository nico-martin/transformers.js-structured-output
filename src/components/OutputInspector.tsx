import { CheckCircle2, CircleAlert, Clock3, Gauge } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, CodeHighlight } from "../theme";
import type { RunState } from "../types";

interface OutputInspectorProps {
  output: string;
  valid?: boolean;
  validationLabel: string;
  state: RunState;
  elapsed?: number;
  tokensPerSecond?: number;
  className?: string;
  badge?: ReactNode;
  error?: string;
  title?: string;
  actions?: ReactNode;
}

function formatOutput(output: string): string {
  try {
    return JSON.stringify(JSON.parse(output), null, 2);
  } catch {
    return output;
  }
}

export default function OutputInspector({
  output,
  valid,
  validationLabel,
  state,
  elapsed,
  tokensPerSecond,
  className = "",
  badge,
  error,
  title = "Output",
  actions,
}: OutputInspectorProps) {
  const busy = state === "loading" || state === "running";
  const visibleOutput = formatOutput(output);
  const outputLanguage: "json" | "javascript" = (() => {
    try {
      JSON.parse(output);
      return "json";
    } catch {
      return "javascript";
    }
  })();

  return (
    <section className={`flex min-h-72 flex-col bg-white ${className}`}>
      <div className="flex h-14 items-center justify-between border-b border-line px-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-ink">{title}</span>
          {badge}
        </div>
        {actions}
      </div>
      <div className="relative flex flex-1 flex-col">
        {error ? (
          <div className="flex min-h-56 flex-1 flex-col p-5">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
                <CircleAlert className="h-3.5 w-3.5" /> Generation failed
              </p>
              <pre className="mt-2 font-mono text-xs leading-5 whitespace-pre-wrap text-red-800">
                {error}
              </pre>
            </div>
            {output ? (
              <pre className="prism-light mt-4 flex-1 overflow-auto font-mono text-sm leading-7 whitespace-pre-wrap text-slate-500">
                <CodeHighlight code={output} language={outputLanguage} />
              </pre>
            ) : null}
          </div>
        ) : output ? (
          <pre className="prism-light min-h-56 flex-1 overflow-auto p-5 font-mono text-sm leading-7 whitespace-pre-wrap text-slate-700">
            <CodeHighlight code={visibleOutput} language={outputLanguage} />
            {busy ? <span className="stream-cursor" /> : null}
          </pre>
        ) : (
          <div className="flex min-h-56 flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-dashed border-slate-300 text-slate-400">
              {busy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-coral" />
              ) : (
                <span className="font-mono text-lg">{`{ }`}</span>
              )}
            </span>
            <p className="text-sm font-semibold text-slate-600">
              {busy
                ? "Loading the local model"
                : "Your constrained output appears here"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Generated locally. Nothing is sent to a server.
            </p>
          </div>
        )}
      </div>
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-t border-line bg-stone-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {error ? (
            <Badge tone="red">
              <CircleAlert className="mr-1 h-3 w-3" />
              constraint failed
            </Badge>
          ) : valid === undefined ? (
            <Badge>
              <Clock3 className="mr-1 h-3 w-3" />
              waiting
            </Badge>
          ) : valid ? (
            <Badge tone="green">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {validationLabel}
            </Badge>
          ) : (
            <Badge tone="red">
              <CircleAlert className="mr-1 h-3 w-3" />
              {validationLabel}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            {elapsed ? `${(elapsed / 1000).toFixed(1)}s` : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            {tokensPerSecond ? `${tokensPerSecond} tok/s` : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}
