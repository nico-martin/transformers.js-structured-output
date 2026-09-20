import { CheckCircle2, CircleAlert, Clock3, Gauge } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, CodeHighlight } from "../theme";
import type { RunState } from "../types";
import cn from "../utils/classnames";

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
    <section className={cn("flex min-h-72 flex-col bg-white", className)}>
      <div className="flex h-14 items-center justify-between gap-3 border-b-2 border-ink px-5">
        <div className="flex min-w-0 items-center gap-3">
          <h3 className="text-base">{title}</h3>
          {badge}
        </div>
        {actions}
      </div>
      <div className="relative flex flex-1 flex-col">
        {error ? (
          <div className="flex min-h-56 flex-1 flex-col p-5">
            <div className="rounded-tile border-2 border-alert/40 bg-alert-tint p-4">
              <p className="flex items-center gap-1.5 font-heading text-xs font-bold text-alert">
                <CircleAlert className="size-4" /> Generation failed
              </p>
              <pre className="mt-2 font-mono text-xs leading-5 whitespace-pre-wrap text-ink">
                {error}
              </pre>
            </div>
            {output ? (
              <pre className="prism-light mt-4 flex-1 overflow-auto font-mono text-sm leading-7 whitespace-pre-wrap text-muted">
                <CodeHighlight code={output} language={outputLanguage} />
              </pre>
            ) : null}
          </div>
        ) : output ? (
          <pre className="prism-light min-h-56 flex-1 overflow-auto p-5 font-mono text-sm leading-7 whitespace-pre-wrap text-ink">
            <CodeHighlight code={visibleOutput} language={outputLanguage} />
            {busy ? <span className="stream-cursor" /> : null}
          </pre>
        ) : (
          <div className="flex min-h-56 flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid size-14 place-items-center rounded-tile bg-surface-muted font-mono text-lg text-muted">
              {busy ? (
                <span className="size-5 animate-spin rounded-full border-2 border-brand-tint-strong border-t-brand" />
              ) : (
                "{ }"
              )}
            </span>
            <p className="font-heading text-sm font-bold text-ink">
              {busy
                ? "Loading the local model"
                : "Your constrained output appears here"}
            </p>
            <p className="mt-1 text-xs text-muted">
              Generated locally. Nothing is sent to a server.
            </p>
          </div>
        )}
      </div>
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-t-2 border-ink bg-surface-muted px-5 py-2.5">
        <div className="flex items-center gap-2">
          {error ? (
            <Badge tone="alert">
              <CircleAlert className="size-3" />
              constraint failed
            </Badge>
          ) : valid === undefined ? (
            <Badge>
              <Clock3 className="size-3" />
              waiting
            </Badge>
          ) : valid ? (
            <Badge tone="brand">
              <CheckCircle2 className="size-3" />
              {validationLabel}
            </Badge>
          ) : (
            <Badge tone="alert">
              <CircleAlert className="size-3" />
              {validationLabel}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock3 className="size-3" />
            {elapsed ? `${(elapsed / 1000).toFixed(1)}s` : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="size-3" />
            {tokensPerSecond ? `${tokensPerSecond} tok/s` : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}
