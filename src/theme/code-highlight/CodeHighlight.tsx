import Prism from "prismjs";
import "prismjs/components/prism-json";

interface CodeHighlightProps {
  code: string;
  language?: "javascript" | "json" | "regex";
  className?: string;
}

export default function CodeHighlight({
  code,
  language = "javascript",
  className = "",
}: CodeHighlightProps) {
  const grammar =
    language === "json" ? Prism.languages.json : Prism.languages.javascript;
  const html = Prism.highlight(code, grammar, language);

  return (
    <code
      className={`language-${language} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
