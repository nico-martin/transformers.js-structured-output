import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";

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
    <button
      onClick={() => void copy()}
      className={`group flex max-w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left shadow-lg ${className}`}
    >
      <Terminal className="h-4 w-4 shrink-0 text-green-400" />
      <code className="truncate font-mono text-xs text-slate-200 sm:text-sm">
        <span className="text-slate-500">$ </span>
        {INSTALL_COMMAND}
      </code>
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-green-400" />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-white" />
      )}
    </button>
  );
}
