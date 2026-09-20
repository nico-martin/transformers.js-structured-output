import { Check, Copy, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { CodeHighlight } from "../theme";

interface CodeModalProps {
  open: boolean;
  code: string;
  title?: string;
  onClose: () => void;
}

export default function CodeModal({
  open,
  code,
  title = "Executed code",
  onClose,
}: CodeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-card border-2 border-ink bg-ink p-0 text-white shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-xs"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-ink bg-white px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg text-ink sm:text-xl">
              {title}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-muted">
              What the playground runs on Generate
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => void copy()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-white px-4 font-heading text-sm font-bold text-ink transition hover:bg-surface-muted"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-white text-ink transition hover:bg-surface-muted"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>
        <pre className="min-h-0 overflow-auto p-5 font-mono text-xs leading-6 whitespace-pre text-white/90 sm:p-7">
          <CodeHighlight code={code} language="javascript" />
        </pre>
      </div>
    </dialog>
  );
}
