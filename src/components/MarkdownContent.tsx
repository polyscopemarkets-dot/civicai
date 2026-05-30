"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: Props) {
  return (
    <div className={className || undefined}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-base font-bold text-gray-900 mt-4 mb-2 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold text-gray-900 mt-4 mb-1.5 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-gray-800 mt-3 mb-1 first:mt-0">{children}</h3>
        ),
        // Paragraph
        p: ({ children }) => (
          <p className="text-sm leading-relaxed text-gray-800 mb-3 last:mb-0">{children}</p>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="text-sm text-gray-800 mb-3 space-y-1 pl-4 list-disc marker:text-green-500">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="text-sm text-gray-800 mb-3 space-y-1 pl-4 list-decimal marker:text-green-600 marker:font-semibold">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed pl-1">{children}</li>
        ),
        // Inline code
        code: ({ children, className: cls }) => {
          const isBlock = cls?.includes("language-");
          if (isBlock) {
            return (
              <pre className="bg-gray-900 text-green-400 text-xs rounded-xl px-4 py-3 overflow-x-auto mb-3 leading-relaxed">
                <code>{children}</code>
              </pre>
            );
          }
          return (
            <code className="bg-gray-100 text-green-700 text-[12px] px-1.5 py-0.5 rounded font-mono">
              {children}
            </code>
          );
        },
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-green-400 pl-4 italic text-gray-600 text-sm mb-3 bg-green-50 py-2 rounded-r-lg">
            {children}
          </blockquote>
        ),
        // Bold / italic
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-700">{children}</em>
        ),
        // Horizontal rule
        hr: () => <hr className="border-gray-200 my-4" />,
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline underline-offset-2 hover:text-green-900"
          >
            {children}
          </a>
        ),
        // Tables (from remark-gfm)
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-100">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-200 px-3 py-2 text-gray-700">{children}</td>
        ),
        tr: ({ children }) => (
          <tr className="even:bg-gray-50">{children}</tr>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
