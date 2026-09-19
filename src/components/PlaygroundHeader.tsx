import { Box, Code2, ExternalLink } from "lucide-react";
import { Badge } from "../theme";

interface PlaygroundHeaderProps {
  webGpu: boolean;
  className?: string;
}

export default function PlaygroundHeader({
  webGpu,
  className = "",
}: PlaygroundHeaderProps) {
  return (
    <header
      className={`flex h-16 items-center justify-between border-b border-line ${className}`}
    >
      <a
        href="https://www.npmjs.com/package/@huggingface/transformers-structured-output"
        className="flex min-w-0 items-center gap-3"
        target="_blank"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-white">
          <Box className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-mono text-sm font-semibold text-ink">
            transformers-structured-output
          </span>
          <span className="hidden text-xs text-slate-400 sm:block">
            by Hugging Face
          </span>
        </span>
      </a>
      <div className="flex items-center gap-1 sm:gap-3">
        <Badge tone={webGpu ? "green" : "amber"}>
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${webGpu ? "bg-green-500" : "bg-amber-500"}`}
          />
          {webGpu ? "WebGPU" : "Demo mode"}
        </Badge>
        <a
          href="https://github.com/huggingface/transformers.js"
          aria-label="View source on GitHub"
          target="_blank"
          className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-ink"
        >
          <Code2 className="h-4 w-4" />
        </a>
        <a
          href="https://www.npmjs.com/package/@huggingface/transformers-structured-output"
          className="hidden items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink sm:flex"
          target="_blank"
        >
          npm <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}
