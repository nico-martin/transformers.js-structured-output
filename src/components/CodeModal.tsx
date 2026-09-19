import { Check, Copy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-0 text-slate-200 shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="font-mono text-xs text-slate-500">
              What the playground runs on Generate
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => void copy()}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <pre className="overflow-auto p-5 font-mono text-xs leading-6 whitespace-pre text-slate-300">
          <CodeHighlight code={code} language="javascript" />
        </pre>
      </div>
    </dialog>
  );
}
