// Admin-side sanitiser for contenteditable output. Only paragraphs, lists,
// headings, bold, italic and line breaks survive; pasted markup is cleaned.
const ALLOWED = new Set(["p", "strong", "em", "ul", "ol", "li", "br", "h3"]);
const DROP_WITH_CONTENT = "script,style,iframe,object,embed,template,svg,math,noscript";

export function sanitizeRichText(html: string) {
  if (typeof document === "undefined") return html;
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll(DROP_WITH_CONTENT).forEach((node) => node.remove());
  template.content.querySelectorAll("b, i").forEach((node) => {
    const replacement = document.createElement(node.tagName === "B" ? "strong" : "em");
    replacement.append(...Array.from(node.childNodes));
    node.replaceWith(replacement);
  });
  template.content.querySelectorAll("div").forEach((node) => {
    const paragraph = document.createElement("p");
    paragraph.append(...Array.from(node.childNodes));
    node.replaceWith(paragraph);
  });

  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT);
  const toUnwrap: Element[] = [];
  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    if (!ALLOWED.has(element.tagName.toLowerCase())) toUnwrap.push(element);
  }
  toUnwrap.forEach((element) => element.replaceWith(...Array.from(element.childNodes)));
  template.content.querySelectorAll("*").forEach((node) => {
    for (const attribute of Array.from(node.attributes)) {
      if (node.tagName === "OL" && attribute.name === "start") continue;
      node.removeAttribute(attribute.name);
    }
  });
  return template.innerHTML.trim();
}

export function plainText(html: string) {
  if (typeof document === "undefined") return html;
  const template = document.createElement("template");
  template.innerHTML = html;
  return (template.content.textContent ?? "").replace(/\s+/g, " ").trim();
}
