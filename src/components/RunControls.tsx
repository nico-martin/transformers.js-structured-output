import { Gauge, LoaderCircle, Play, Repeat2 } from "lucide-react";
import { Badge, Button, Progress } from "../theme";
import type { RunState } from "../types";

interface RunControlsProps {
  state: RunState;
  batchProgress: number;
  modelProgress: number;
  timing?: string;
  tokens?: number;
  onRunOnce: () => void;
  onRunBatch: () => void;
  className?: string;
}

export default function RunControls({
  state,
  batchProgress,
  modelProgress,
  timing,
  tokens,
  onRunOnce,
  onRunBatch,
  className = "",
}: RunControlsProps) {
  const busy = state === "loading" || state === "running";
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-line bg-white p-3 shadow-card sm:flex-row sm:items-center ${className}`}
    >
      <div className="flex gap-2">
        <Button
          onClick={onRunOnce}
          disabled={busy}
          className="flex-1 sm:flex-none"
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
              : "Run once"}
        </Button>
        <Button
          variant="secondary"
          onClick={onRunBatch}
          disabled={busy}
          className="flex-1 sm:flex-none"
        >
          <Repeat2 className="h-4 w-4" /> Run 25×
        </Button>
      </div>
      <div className="min-w-32 flex-1">
        {modelProgress > 0 && modelProgress < 100 ? (
          <div>
            <div className="mb-1.5 flex justify-between text-xs text-slate-500">
              <span>Downloading once</span>
              <span>{Math.round(modelProgress)}%</span>
            </div>
            <Progress value={modelProgress} />
          </div>
        ) : batchProgress > 0 && batchProgress < 25 ? (
          <div>
            <div className="mb-1.5 flex justify-between text-xs text-slate-500">
              <span>Running locally</span>
              <span>{batchProgress} / 25</span>
            </div>
            <Progress value={batchProgress * 4} />
          </div>
        ) : (
          <p className="hidden text-xs leading-5 text-slate-400 sm:block">
            Same model. Same prompt. The only difference is the constraint.
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:justify-end">
        <Badge>
          <Gauge className="mr-1 h-3 w-3" />
          {timing || "— ms"}
        </Badge>
        <Badge>{tokens ? `${tokens} tok/s` : "— tok/s"}</Badge>
      </div>
    </div>
  );
}
