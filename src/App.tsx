import {
  ArrowRight,
  Braces,
  CheckCircle2,
  LockKeyhole,
  Zap,
} from "lucide-react";
import { useState } from "react";
import InstallSnippet from "./components/InstallSnippet";
import Playground from "./components/Playground";
import PlaygroundHeader from "./components/PlaygroundHeader";
import { INITIAL_CONSTRAINT, type ConstraintSnapshot } from "./data/playground";
import { Badge, CodeHighlight } from "./theme";
import { constraintCode } from "./utils/constraintCode";

const FEATURES = [
  {
    icon: Braces,
    title: "Use the schema you have",
    text: "Enums, nested objects, arrays, bounds, unions, and local references are enforced during generation.",
  },
  {
    icon: Zap,
    title: "No parsing-and-retry loop",
    text: "Invalid tokens are never selected. The completed output already satisfies the constraint.",
  },
  {
    icon: LockKeyhole,
    title: "Entirely local",
    text: "Built for Transformers.js. Model inference and constrained decoding both happen in the browser.",
  },
];

export default function App() {
  const [constraint, setConstraint] =
    useState<ConstraintSnapshot>(INITIAL_CONSTRAINT);
  const [copiedCode, setCopiedCode] = useState(false);
  const webGpu = "gpu" in navigator;

  const code = constraintCode(constraint);
  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1200);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="grain pointer-events-none fixed inset-0" />
      <div className="relative mx-auto max-w-page px-5 sm:px-8 lg:px-10">
        <PlaygroundHeader webGpu={webGpu} />

        <main className="pb-20">
          <section className="flex items-center gap-8 pt-14 pb-12 lg:pt-20">
            <div className="w-1/2">
              <h1 className="max-w-3xl font-serif text-5xl leading-none font-semibold tracking-tight text-balance sm:text-7xl">
                Constrained
                <br />
                generation for
                <br />
                <span className="italic text-coral">Transformers.js</span>
              </h1>
            </div>
            <div className="lg:pb-1 w-1/2">
              <p className="font-serif text-xl leading-8 text-slate-600">
                Constrain generation to a JSON Schema or a regex. Get valid
                output on the first try, directly in the browser.
              </p>
              <div className="mt-6">
                <InstallSnippet />
              </div>
            </div>
          </section>

          <Playground onConstraintChange={setConstraint} />

          <section className="grid gap-4 py-16 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-line bg-white p-5 shadow-card"
              >
                <span className="mb-4 grid h-9 w-9 place-items-center rounded-lg bg-green-50 text-green-700">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </section>

          <section className="grid overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-xl lg:grid-cols-3">
            <div className="p-6 sm:p-8">
              <Badge tone="green" className="mb-5">
                The whole integration
              </Badge>
              <h2 className="font-serif text-3xl font-semibold text-white">
                One processor.
                <br />
                One generate call.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                Pass the processor as a standard Transformers.js logits
                processor. No server, grammar compiler, or runtime dependency
                required. The snippet mirrors the constraint in the playground.
              </p>
              <a
                href="https://www.npmjs.com/package/@huggingface/transformers-structured-output"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300"
                target="_blank"
              >
                Read the package docs <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="relative border-t border-slate-800 bg-slate-900 lg:col-span-2 lg:border-t-0 lg:border-l">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
                <span className="font-mono text-xs text-slate-500">app.ts</span>
                <button
                  onClick={() => void copyCode()}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {copiedCode ? "Copied" : "Copy code"}
                </button>
              </div>
              <pre className="max-h-[32rem] overflow-auto p-5 font-mono text-xs leading-6 whitespace-pre text-slate-300">
                <CodeHighlight code={code} language="javascript" />
              </pre>
            </div>
          </section>

          <footer className="mt-16 flex flex-col gap-3 border-t border-line py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              Dependency-free constraint engine
            </p>
            <p>Apache-2.0 · Built by Hugging Face</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
