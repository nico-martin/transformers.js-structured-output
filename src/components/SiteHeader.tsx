import { Braces } from "lucide-react";
import { Badge } from "../theme";

interface SiteHeaderProps {
  webGpu: boolean;
}

const LINK =
  "font-heading text-sm font-bold text-body no-underline transition hover:text-ink hover:no-underline";

export default function SiteHeader({ webGpu }: SiteHeaderProps) {
  return (
    <header className="wrap flex h-20 items-center justify-between gap-4">
      <a
        href="#top"
        aria-label="Back to top"
        className="flex min-w-0 items-center gap-3 text-ink no-underline hover:text-ink hover:no-underline"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-tile bg-brand text-white">
          <Braces className="size-5" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-heading text-lg font-black tracking-display">
            structured<span className="text-brand">.output</span>
          </span>
          <span className="hidden font-mono text-xs text-muted sm:block">
            for Transformers.js
          </span>
        </span>
      </a>
      <nav className="flex items-center gap-5">
        <Badge tone={webGpu ? "brand" : "yellow"}>
          <span
            className={`size-1.5 rounded-full ${webGpu ? "bg-brand" : "bg-yellow-ink"}`}
          />
          {webGpu ? "WebGPU ready" : "Demo mode"}
        </Badge>
        <a
          href="https://www.npmjs.com/package/@huggingface/transformers-structured-output"
          target="_blank"
          rel="noreferrer"
          className={LINK}
        >
          npm
        </a>
        <a
          href="https://github.com/huggingface/transformers.js/tree/main/packages/transformers-structured-output"
          target="_blank"
          rel="noreferrer"
          className={`hidden sm:inline ${LINK}`}
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
