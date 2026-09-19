import {
  CalendarCheck,
  Check,
  CheckCircle2,
  Circle,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Badge, Card } from "../theme";
import type { GenerationResult, Preset } from "../types";
import { getTypeHint } from "../utils/schema";

interface ResultCardProps {
  mode: "before" | "now";
  preset: Preset;
  result?: GenerationResult;
  visibleFields?: number;
  running?: boolean;
  className?: string;
}

function displayValue(value: unknown): string {
  if (value === undefined) return "Waiting…";
  if (Array.isArray(value))
    return value
      .map((item) =>
        typeof item === "object" ? JSON.stringify(item) : String(item)
      )
      .join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function Payoff({ preset }: { preset: Preset }) {
  if (preset.id === "review") {
    const rating = Number(preset.sample.rating);
    return (
      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < rating ? "fill-current" : "text-slate-200"}`}
          />
        ))}
        <span className="ml-2 text-xs font-semibold text-green-800">
          Card rendered
        </span>
      </div>
    );
  }
  const Icon =
    preset.id === "calendar"
      ? CalendarCheck
      : preset.id === "order"
        ? ShoppingBag
        : CheckCircle2;
  return (
    <span className="flex items-center gap-2 text-xs font-semibold text-green-800">
      <Icon className="h-4 w-4" />
      {preset.payoff}
    </span>
  );
}

export default function ResultCard({
  mode,
  preset,
  result,
  visibleFields = 99,
  running = false,
  className = "",
}: ResultCardProps) {
  const structured = mode === "now";
  return (
    <Card
      className={`flex min-h-96 flex-col overflow-hidden ${structured ? "border-green-300 shadow-green" : ""} ${className}`}
    >
      <div
        className={`flex items-center justify-between border-b px-5 py-4 ${structured ? "border-green-200 bg-green-50" : "border-line bg-stone-50"}`}
      >
        <div>
          <p
            className={`text-xs font-semibold tracking-wide uppercase ${structured ? "text-green-700" : "text-slate-400"}`}
          >
            {structured ? "Now" : "Before"}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {structured ? "Structured output" : "Prompt only"}
          </p>
        </div>
        <Badge
          tone={
            structured ? "green" : result && !result.valid ? "red" : "neutral"
          }
        >
          {structured ? <Check className="mr-1 h-3 w-3" /> : null}
          {structured ? "constrained" : "JSON.parse"}
        </Badge>
      </div>
      <div className="grid flex-1 content-start gap-2 p-4 sm:grid-cols-2">
        {Object.entries(preset.schema.properties).map(
          ([key, property], index) => {
            const field = result?.fields.find((item) => item.key === key);
            const visible = index < visibleFields && Boolean(result);
            const valid = structured || field?.valid;
            return (
              <div
                key={key}
                className={`min-h-20 rounded-lg border px-3.5 py-3 transition-all duration-300 ${
                  visible
                    ? valid
                      ? "border-green-200 bg-green-50/70"
                      : "border-red-200 bg-red-50"
                    : "border-dashed border-slate-200 bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-slate-500">
                    {property.title || key}
                  </span>
                  {visible && !valid ? (
                    <Badge tone="red">{field?.reason || "invalid"}</Badge>
                  ) : (
                    <span className="font-mono text-xs text-slate-400">
                      {getTypeHint(property)}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 truncate text-sm font-semibold ${visible ? (valid ? "text-green-950" : "text-red-800") : "text-slate-300"}`}
                >
                  {visible ? (
                    displayValue(field?.value ?? result?.data?.[key])
                  ) : running ? (
                    <span className="stream-cursor">Generating</span>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            );
          }
        )}
      </div>
      <div
        className={`flex min-h-13 items-center justify-between border-t px-5 py-3 ${structured ? "border-green-200 bg-green-50" : "border-line bg-stone-50"}`}
      >
        {result ? (
          structured && result.valid ? (
            <Payoff preset={preset} />
          ) : (
            <span
              className={`flex items-center gap-2 text-xs font-semibold ${result.valid ? "text-green-700" : "text-red-700"}`}
            >
              {result.valid ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4 fill-red-100" />
              )}
              {result.parseStatus}
            </span>
          )
        ) : (
          <span className="text-xs text-slate-400">
            Run the same input through both paths
          </span>
        )}
        <span className="font-mono text-xs text-slate-400">
          {result ? `${(result.elapsed / 1000).toFixed(1)}s` : "—"}
        </span>
      </div>
    </Card>
  );
}
