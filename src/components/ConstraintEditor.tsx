import { Braces, Regex } from "lucide-react";
import { useRef } from "react";
import type { ConstraintMode } from "../data/playground";
import { CodeHighlight } from "../theme";

interface ConstraintEditorProps {
  mode: ConstraintMode;
  value: string;
  onModeChange: (mode: ConstraintMode) => void;
  onChange: (value: string) => void;
  className?: string;
}

const MODES = [
  { id: "json_schema", label: "JSON", icon: Braces },
  { id: "regex", label: "Regex", icon: Regex },
] as const;

export default function ConstraintEditor({
  mode,
  value,
  onModeChange,
  onChange,
  className = "",
}: ConstraintEditorProps) {
  const highlightRef = useRef<HTMLPreElement>(null);

  return (
    <section className={`flex min-h-80 flex-col bg-slate-950 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex gap-1 rounded-lg bg-slate-900 p-1">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onModeChange(id)}
              aria-pressed={mode === id}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                mode === id
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
        <span className="ml-2 shrink-0 font-mono text-xs text-slate-500">
          {mode === "regex" ? "full-string match" : "JSON Schema 2020-12"}
        </span>
      </div>
      <div className="relative flex flex-1">
        <div className="w-11 shrink-0 select-none border-r border-slate-800 pt-4 text-right font-mono text-xs leading-6 text-slate-600">
          {Array.from(
            { length: Math.max(1, value.split("\n").length) },
            (_, index) => (
              <span key={index} className="block pr-3">
                {index + 1}
              </span>
            )
          )}
        </div>
        <div className="relative min-h-72 flex-1 overflow-hidden">
          <pre
            ref={highlightRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden p-4 font-mono text-xs leading-6 whitespace-pre-wrap text-slate-200"
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
            onScroll={(event) => {
              if (!highlightRef.current) return;
              highlightRef.current.scrollTop = event.currentTarget.scrollTop;
              highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }}
            aria-label={mode === "regex" ? "Regular expression" : "JSON Schema"}
            spellCheck={false}
            className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent p-4 font-mono text-xs leading-6 text-transparent caret-white outline-none selection:bg-coral/40"
          />
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-2 font-mono text-xs text-slate-500">
        Passed to the processor as-is. Unsatisfiable constraints fail at
        generation time.
      </div>
    </section>
  );
}
