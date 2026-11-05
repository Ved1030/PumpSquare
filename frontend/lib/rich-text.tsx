import type { ReactNode } from "react";

const VOID_TAGS = new Set(["br"]);
const ALLOWED_TAGS = new Set(["p", "strong", "em", "ul", "ol", "li", "br", "h3"]);
const DROP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "template", "svg", "math"]);

/**
 * Renders administrator-authored rich text without dangerouslySetInnerHTML:
 * anything that is not a paragraph, list, heading, bold, italic or line break
 * is unwrapped to its text. The admin editor writes the same subset.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  return <div className={className}>{renderChildren(html)}</div>;
}

type Token =
  | { type: "text"; value: string }
  | { type: "open"; tag: string }
  | { type: "close"; tag: string };

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /<\s*(\/?)\s*([a-z0-9]+)[^>]*>|([^<]+)|</gi;
  let match: RegExpExecArray | null;
  let dropped: string | null = null;

  while ((match = pattern.exec(html))) {
    const [, closing, rawName, text] = match;
    if (text !== undefined) {
      if (!dropped) tokens.push({ type: "text", value: decodeEntities(text) });
      continue;
    }
    if (rawName === undefined) {
      if (!dropped) tokens.push({ type: "text", value: "<" });
      continue;
    }
    const tag = rawName.toLowerCase();
    if (DROP_WITH_CONTENT.has(tag)) {
      if (!closing) dropped = tag;
      else if (dropped === tag) dropped = null;
      continue;
    }
    if (dropped || !ALLOWED_TAGS.has(tag) || VOID_TAGS.has(tag)) continue;
    tokens.push({ type: closing ? "close" : "open", tag });
  }
  return tokens;
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function renderChildren(html: string): ReactNode[] {
  const tokens = tokenize(html);
  const out: ReactNode[] = [];
  const stack: { tag: string; children: ReactNode[] }[] = [];
  const push = (node: ReactNode) => (stack.length ? stack[stack.length - 1].children.push(node) : out.push(node));

  tokens.forEach((token, index) => {
    if (token.type === "text") {
      push(token.value);
      return;
    }
    if (token.type === "open") {
      if (token.tag === "br") {
        push(<br key={index} />);
        return;
      }
      stack.push({ tag: token.tag, children: [] });
      return;
    }
    const position = stack.map((entry) => entry.tag).lastIndexOf(token.tag);
    if (position === -1) return;
    while (stack.length > position + 1) {
      const orphan = stack.pop()!;
      push(orphan.children);
    }
    const node = stack.pop()!;
    push(
      <FragmentTag key={index} tag={node.tag}>
        {node.children}
      </FragmentTag>,
    );
  });
  while (stack.length) push(stack.pop()!.children);
  return out;
}

function FragmentTag({ tag, children }: { tag: string; children: ReactNode[] }) {
  switch (tag) {
    case "p":
      return <p>{children}</p>;
    case "strong":
      return <strong>{children}</strong>;
    case "em":
      return <em>{children}</em>;
    case "ul":
      return <ul>{children}</ul>;
    case "ol":
      return <ol>{children}</ol>;
    case "li":
      return <li>{children}</li>;
    case "h3":
      return <h3>{children}</h3>;
    default:
      return <>{children}</>;
  }
}

/** Plain-text version for meta tags and accessible labels. */
export function richTextToPlain(html: string) {
  return tokenize(html)
    .map((token) => (token.type === "text" ? token.value : " "))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasRichText(html: string) {
  return richTextToPlain(html).length > 0;
}
