import { Card } from "../theme";
import type { Preset } from "../types";

interface InputCardProps {
  preset: Preset;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function InputCard({
  preset,
  value,
  onChange,
  className = "",
}: InputCardProps) {
  return (
    <Card className={`flex min-h-72 flex-col overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Input
          </p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {preset.inputLabel}
          </p>
        </div>
        <span className="h-2 w-2 rounded-full bg-slate-300" />
      </div>
      <textarea
        aria-label={preset.inputLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-52 flex-1 resize-none bg-transparent p-5 font-serif text-lg leading-8 text-slate-700 outline-none placeholder:text-slate-300"
      />
    </Card>
  );
}
