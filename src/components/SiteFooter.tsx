const LINKS = [
  [
    "npm",
    "https://www.npmjs.com/package/@huggingface/transformers-structured-output",
  ],
  [
    "GitHub",
    "https://github.com/huggingface/transformers.js/tree/main/packages/transformers-structured-output",
  ],
  ["Hugging Face", "https://huggingface.co"],
] as const;

export default function SiteFooter() {
  return (
    <footer className="bg-ink py-14 text-white">
      <div className="wrap flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-heading text-3xl font-black tracking-display">
            structured<span className="text-brand-tint-strong">.output</span>
          </div>
          <p className="mt-3 max-w-sm text-faint">
            Dependency free constrained decoding for Transformers.js. Model
            inference and the constraint engine both run in the browser.
          </p>
        </div>
        <div className="grid content-start gap-3">
          <span className="font-heading text-xs font-bold tracking-eyebrow text-faint uppercase">
            Elsewhere
          </span>
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-white hover:text-brand-tint-strong"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="wrap mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-white/15 pt-6 text-center font-mono text-xs text-faint">
        <span>Apache-2.0</span>
        <span aria-hidden="true">·</span>
        <span>Built by Hugging Face</span>
      </div>
    </footer>
  );
}
