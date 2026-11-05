"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, List, ListOrdered, Pilcrow } from "lucide-react";
import { sanitizeRichText } from "@/lib/rich-text-editor";
import { cn } from "@/lib/utils";

type Tool = { command: string; argument?: string; label: string; Icon: typeof Bold };

const TOOLS: Tool[] = [
  { command: "bold", label: "Bold", Icon: Bold },
  { command: "italic", label: "Italic", Icon: Italic },
  { command: "insertUnorderedList", label: "Bulleted list", Icon: List },
  { command: "insertOrderedList", label: "Numbered list", Icon: ListOrdered },
  { command: "formatBlock", argument: "p", label: "Paragraph", Icon: Pilcrow },
];

export default function RichTextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const editor = useRef<HTMLDivElement>(null);

  // Only write the DOM when the incoming value differs, so the caret is not
  // reset on every keystroke.
  useEffect(() => {
    const node = editor.current;
    if (node && node.innerHTML !== value) node.innerHTML = value;
  }, [value]);

  function run(command: string, argument?: string) {
    editor.current?.focus();
    document.execCommand(command, false, argument);
    if (editor.current) onChange(sanitizeRichText(editor.current.innerHTML));
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="mt-1.5 overflow-hidden rounded-md border border-line bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <div className="flex flex-wrap gap-0.5 border-b border-line bg-slate-50 p-1" role="toolbar" aria-label={`${label} formatting`}>
          {TOOLS.map(({ command, argument, label: toolLabel, Icon }) => (
            <button
              key={command}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => run(command, argument)}
              className="rounded p-1.5 text-muted hover:bg-white hover:text-primary"
              aria-label={toolLabel}
              title={toolLabel}
            >
              <Icon aria-hidden="true" className="size-3.5" />
            </button>
          ))}
        </div>
        <div
          id={id}
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          data-placeholder={placeholder}
          onInput={(event) => onChange(sanitizeRichText(event.currentTarget.innerHTML))}
          onBlur={(event) => onChange(sanitizeRichText(event.currentTarget.innerHTML))}
          onPaste={(event) => {
            event.preventDefault();
            const text = event.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
          }}
          style={{ minHeight: `${rows * 1.5}rem` }}
          className={cn(
            "px-3 py-2 text-sm leading-relaxed text-ink focus:outline-none",
            "empty:before:text-muted empty:before:content-[attr(data-placeholder)]",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_h3]:my-1 [&_h3]:font-bold",
          )}
        />
      </div>
    </div>
  );
}
