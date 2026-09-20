import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Card } from "../theme";

interface InstallSnippetProps {
  className?: string;
}

const INSTALL_COMMAND =
  "npm i @huggingface/transformers-structured-output @huggingface/transformers";

export default function InstallSnippet({
  className = "",
}: InstallSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card
      padded={false}
      className={`w-full max-w-lg overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between border-b-2 border-ink py-2 pr-2 pl-5">
        <span className="font-heading text-xs font-bold tracking-eyebrow text-muted uppercase">
          Install
        </span>
        <button
          onClick={() => void copy()}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 font-heading text-xs font-bold text-ink transition hover:bg-surface-muted"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="scrollbar-none overflow-x-auto bg-ink px-5 py-4 font-mono text-[13px] leading-6 whitespace-pre text-white">
        <span className="text-brand-tint-strong">$ </span>
        {
          "npm i @huggingface/transformers \\\n        @huggingface/transformers-structured-output"
        }
      </pre>
    </Card>
  );
}
