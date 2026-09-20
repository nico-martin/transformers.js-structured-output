import { Braces, Regex } from "lucide-react";
import type { ConstraintMode } from "../data/playground";
import { CodeHighlight } from "../theme";
import cn from "../utils/classnames";

interface ConstraintEditorProps {
  mode: ConstraintMode;
  value: string;
  onModeChange: (mode: ConstraintMode) => void;
  onChange: (value: string) => void;
  className?: string;
}

const MODES = [
  { id: "json_schema", label: "JSON Schema", icon: Braces },
  { id: "regex", label: "Regex", icon: Regex },
] as const;

export default function ConstraintEditor({
  mode,
  value,
  onModeChange,
  onChange,
  className = "",
}: ConstraintEditorProps) {
  return (
    <section className={cn("flex min-h-80 flex-col bg-ink", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-white/15 px-4 py-3">
        <div
          role="group"
          aria-label="Constraint type"
          className="flex gap-1 rounded-full bg-white/10 p-1"
        >
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onModeChange(id)}
              aria-pressed={mode === id}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-heading text-xs font-bold transition",
                mode === id
                  ? "bg-white text-ink"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-3.5" strokeWidth={2.5} /> {label}
            </button>
          ))}
        </div>
        <span className="shrink-0 font-mono text-xs text-white/50">
          {mode === "regex" ? "full-string match" : "draft 2020-12"}
        </span>
      </div>
      <div className="relative flex flex-1">
        <div className="w-11 shrink-0 border-r border-white/15 py-4 text-right font-mono text-xs leading-6 text-white/30 select-none">
          {Array.from(
            { length: Math.max(1, value.split("\n").length) },
            (_, index) => (
              <span key={index} className="block pr-3">
                {index + 1}
              </span>
            )
          )}
        </div>
        <div className="relative min-h-72 flex-1">
          <pre
            aria-hidden="true"
            className="pointer-events-none min-h-72 p-4 font-mono text-xs leading-6 break-words whitespace-pre-wrap text-white/90"
          >
            <CodeHighlight
              code={value}
              language={mode === "regex" ? "regex" : "json"}
            />
            {"\n"}
          </pre>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={mode === "regex" ? "Regular expression" : "JSON Schema"}
            spellCheck={false}
            className="absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent p-4 font-mono text-xs leading-6 break-words whitespace-pre-wrap text-transparent caret-white outline-none selection:bg-brand/50"
          />
        </div>
      </div>
      <div className="border-t border-white/15 px-4 py-2 font-mono text-xs text-white/50">
        Passed to the processor as-is. Unsatisfiable constraints fail at
        generation time.
      </div>
    </section>
  );
}
