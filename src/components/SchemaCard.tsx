import { AlertCircle, Braces, RotateCcw } from "lucide-react";
import { Badge, Button, Card } from "../theme";
import type { JsonSchema } from "../types";
import { getTypeHint } from "../utils/schema";

interface SchemaCardProps {
  schema: JsonSchema;
  editing: boolean;
  schemaText: string;
  error?: string;
  onToggleEdit: () => void;
  onSchemaTextChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}

export default function SchemaCard({
  schema,
  editing,
  schemaText,
  error,
  onToggleEdit,
  onSchemaTextChange,
  onReset,
  className = "",
}: SchemaCardProps) {
  return (
    <Card className={`flex min-h-72 flex-col overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Schema
          </p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {editing ? "JSON Schema" : "The shape you need"}
          </p>
        </div>
        <Button variant="quiet" onClick={onToggleEdit}>
          <Braces className="h-3.5 w-3.5" />
          {editing ? "View template" : "Edit schema"}
        </Button>
      </div>
      {editing ? (
        <div className="relative flex flex-1 flex-col">
          <textarea
            aria-label="JSON Schema editor"
            value={schemaText}
            onChange={(event) => onSchemaTextChange(event.target.value)}
            spellCheck={false}
            className="min-h-56 flex-1 resize-none bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200 outline-none"
          />
          <div className="flex items-center justify-between border-t border-slate-700 bg-slate-900 px-4 py-2">
            <span
              className={`flex items-center gap-1.5 text-xs ${error ? "text-red-300" : "text-green-300"}`}
            >
              {error ? <AlertCircle className="h-3.5 w-3.5" /> : null}
              {error || "Valid schema · template updated"}
            </span>
            <button
              onClick={onReset}
              className="text-slate-400 hover:text-white"
              title="Reset schema"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid flex-1 content-start gap-2 p-4 sm:grid-cols-2">
          {Object.entries(schema.properties).map(([key, property]) => (
            <div
              key={key}
              className="rounded-lg border border-dashed border-slate-300 bg-stone-50 px-3.5 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-semibold text-slate-600">
                  {property.title || key}
                </span>
                <Badge className="max-w-36 truncate">
                  {getTypeHint(property)}
                </Badge>
              </div>
              <span className="mt-2 block font-mono text-sm text-slate-300">
                —
              </span>
            </div>
          ))}
          <p className="col-span-full mt-1 px-1 text-xs leading-5 text-slate-400">
            A schema is a template. The model can only fill these slots.
          </p>
        </div>
      )}
    </Card>
  );
}
