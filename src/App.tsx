import { ArrowRight, Braces, LockKeyhole, Zap } from "lucide-react";
import { useState } from "react";
import InstallSnippet from "./components/InstallSnippet";
import Playground from "./components/Playground";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { INITIAL_CONSTRAINT, type ConstraintSnapshot } from "./data/playground";
import {
  ButtonLink,
  Card,
  CodeHighlight,
  Eyebrow,
  IconTile,
  type IconTileTone,
} from "./theme";
import { constraintCode } from "./utils/constraintCode";

const FEATURES: Array<{
  icon: typeof Braces;
  tone: IconTileTone;
  title: string;
  text: string;
}> = [
  {
    icon: Braces,
    tone: "teal",
    title: "Use the schema you have",
    text: "Enums, nested objects, arrays, bounds, unions, and local references are enforced while the model generates.",
  },
  {
    icon: Zap,
    tone: "yellow",
    title: "No parse-and-retry loop",
    text: "Invalid tokens are never selected. The completed output already satisfies the constraint, on the first try.",
  },
  {
    icon: LockKeyhole,
    tone: "pink",
    title: "Entirely local",
    text: "Built for Transformers.js. Model inference and constrained decoding both happen in the browser, on your device.",
  },
];

const NPM_URL =
  "https://www.npmjs.com/package/@huggingface/transformers-structured-output";

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
    <div id="top" className="flex min-h-dvh flex-col">
      <SiteHeader webGpu={webGpu} />

      <main className="flex-1">
        <section className="relative py-18">
          <div className="wrap relative z-10 grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0 animate-rise">
              <Eyebrow>Transformers.js</Eyebrow>
              <h1 className="display mt-6">
                Constrained
                <br />
                generation for
                <br />
                <span className="text-brand">Transformers.js</span>.
              </h1>
              <p className="lead mt-5 max-w-xl">
                Constrain generation to a JSON Schema or a regex. Get valid
                output on the first try, directly in the browser.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="#playground">
                  Try it live <ArrowRight className="size-4" strokeWidth={3} />
                </ButtonLink>
                <ButtonLink
                  href={NPM_URL}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                >
                  Read the docs
                </ButtonLink>
              </div>
            </div>
            <div className="grid min-w-0 animate-rise place-items-center [animation-delay:90ms] lg:justify-items-end">
              <InstallSnippet />
            </div>
          </div>
        </section>

        <section id="playground" className="wrap section scroll-mt-6">
          <Playground onConstraintChange={setConstraint} />
        </section>

        <section className="wrap section">
          <Eyebrow>Why constrain</Eyebrow>
          <h2 className="section-title mt-5 mb-8">
            Small models, dependable output
          </h2>
          <div className="grid gap-7 md:grid-cols-3">
            {FEATURES.map(({ icon, tone, title, text }) => (
              <Card key={title}>
                <IconTile icon={icon} tone={tone} />
                <h3 className="mt-5 text-xl">{title}</h3>
                <p className="mt-2 mb-0">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="wrap section mb-24">
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="min-w-0">
              <Eyebrow>The whole integration</Eyebrow>
              <h2 className="section-title mt-5">
                One processor.
                <br />
                One generate call.
              </h2>
              <p className="mt-4 max-w-md">
                Pass the processor as a standard Transformers.js logits
                processor. No server, grammar compiler, or runtime dependency
                required. The snippet mirrors the constraint in the playground.
              </p>
              <ButtonLink
                href={NPM_URL}
                target="_blank"
                rel="noreferrer"
                variant="quiet"
                className="mt-6"
              >
                Read the package docs <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
            <div className="min-w-0 overflow-hidden rounded-card bg-ink text-white shadow-soft">
              <div className="flex items-center justify-between border-b border-white/15 px-5 py-3">
                <span className="font-mono text-xs text-white/60">app.ts</span>
                <button
                  onClick={() => void copyCode()}
                  className="font-heading text-xs font-bold text-white/70 transition hover:text-white"
                >
                  {copiedCode ? "Copied" : "Copy code"}
                </button>
              </div>
              <pre className="max-h-[32rem] overflow-auto p-5 font-mono text-xs leading-6 whitespace-pre text-white/90">
                <CodeHighlight code={code} language="javascript" />
              </pre>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
