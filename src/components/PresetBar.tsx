import { ChevronDown } from "lucide-react";
import { MODELS, PRESETS } from "../data/presets";
import { Chip } from "../theme";
import type { PresetId } from "../types";

interface PresetBarProps {
  activeId: PresetId;
  modelId: string;
  onPresetChange: (id: PresetId) => void;
  onModelChange: (id: string) => void;
  className?: string;
}

export default function PresetBar({
  activeId,
  modelId,
  onPresetChange,
  onModelChange,
  className = "",
}: PresetBarProps) {
  return (
    <div
      className={`flex flex-col gap-3 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {PRESETS.map((preset) => (
          <Chip
            key={preset.id}
            active={preset.id === activeId}
            onClick={() => onPresetChange(preset.id)}
          >
            {preset.label}
          </Chip>
        ))}
      </div>
      <label className="relative flex shrink-0 items-center gap-2 text-xs font-medium text-slate-500">
        <span>Local model</span>
        <select
          value={modelId}
          onChange={(event) => onModelChange(event.target.value)}
          className="h-9 appearance-none rounded-lg border border-line bg-white py-0 pr-8 pl-3 text-sm font-semibold text-ink outline-none hover:border-slate-400 focus:border-ink"
        >
          {MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.label} · {model.size}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-slate-400" />
      </label>
    </div>
  );
}
