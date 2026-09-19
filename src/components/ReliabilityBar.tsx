import { ChevronRight, X } from "lucide-react";
import { Badge, Card } from "../theme";
import type { ReliabilityRun } from "../types";

interface ReliabilityBarProps {
  before: ReliabilityRun[];
  after: ReliabilityRun[];
  selected?: ReliabilityRun;
  onSelect: (run?: ReliabilityRun) => void;
  className?: string;
}

function Row({
  label,
  runs,
  onSelect,
}: {
  label: string;
  runs: ReliabilityRun[];
  onSelect: (run: ReliabilityRun) => void;
}) {
  const successes = runs.filter((run) => run.valid).length;
  return (
    <div className="grid gap-2 sm:grid-cols-reliability sm:items-center">
      <div className="flex items-center justify-between sm:block">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="ml-2 font-mono text-xs text-slate-400">
          {runs.length ? `${successes}/${runs.length}` : "—"}
        </span>
      </div>
      <div className="grid grid-cols-25 gap-1.5">
        {Array.from({ length: 25 }, (_, index) => {
          const run = runs[index];
          return (
            <button
              key={index}
              aria-label={
                run
                  ? `${label} run ${index + 1}: ${run.valid ? "valid" : "failed"}`
                  : `Empty run ${index + 1}`
              }
              disabled={!run}
              onClick={() => run && !run.valid && onSelect(run)}
              className={`aspect-square min-w-2 rounded-sm border transition hover:scale-125 ${
                !run
                  ? "border-slate-200 bg-stone-100"
                  : run.valid
                    ? "border-green-500 bg-green-500"
                    : "border-red-500 bg-red-500"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function ReliabilityBar({
  before,
  after,
  selected,
  onSelect,
  className = "",
}: ReliabilityBarProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="space-y-4 p-5">
        <Row label="Before" runs={before} onSelect={onSelect} />
        <Row label="Now" runs={after} onSelect={onSelect} />
      </div>
      {selected ? (
        <div className="border-t border-red-200 bg-red-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge tone="red">failed</Badge>
              <span className="text-xs font-semibold text-red-900">
                {selected.reason}
              </span>
            </div>
            <button
              onClick={() => onSelect(undefined)}
              aria-label="Close failure details"
              className="rounded p-1 text-red-700 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-red-950 p-4 font-mono text-xs leading-5 text-red-100">
            {selected.raw}
          </pre>
        </div>
      ) : before.some((run) => !run.valid) ? (
        <button
          onClick={() => onSelect(before.find((run) => !run.valid))}
          className="flex w-full items-center justify-between border-t border-line px-5 py-3 text-xs font-semibold text-slate-500 hover:bg-stone-50 hover:text-ink"
        >
          Tap a red tile to inspect the model’s raw output
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </Card>
  );
}
