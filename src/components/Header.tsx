import { ExternalLink, LockKeyhole } from "lucide-react";
import { Badge } from "../theme";

interface HeaderProps {
  webGpu: boolean;
  storagePersisted: boolean;
  className?: string;
}

export default function Header({
  webGpu,
  storagePersisted,
  className = "",
}: HeaderProps) {
  return (
    <header className={`flex items-center justify-between py-5 ${className}`}>
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-coral font-serif text-lg font-bold text-white">
          S
        </span>
        <span className="font-serif text-lg font-bold tracking-tight">
          shape
        </span>
        <span className="hidden text-xs text-slate-400 sm:inline">
          / structured output
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={webGpu ? "green" : "amber"}>
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${webGpu ? "bg-green-500" : "bg-amber-500"}`}
          />
          {webGpu ? "WebGPU ready" : "Demo mode"}
        </Badge>
        <Badge className="hidden sm:inline-flex">
          <LockKeyhole className="mr-1 h-3 w-3" />
          {storagePersisted ? "cache persistent" : "stays on device"}
        </Badge>
        <a
          href="https://github.com/huggingface/transformers.js"
          aria-label="Transformers.js on GitHub"
          className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-ink"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
