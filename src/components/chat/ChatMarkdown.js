"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders markdown content with chat-appropriate styling.
 * Supports bold, italic, lists, code, links, etc.
 */
export default function ChatMarkdown({ content, className = "" }) {
  return (
    <div className={`chat-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="chat-markdown__p">{children}</p>,
          strong: ({ children }) => <strong className="chat-markdown__strong">{children}</strong>,
          em: ({ children }) => <em className="chat-markdown__em">{children}</em>,
          ul: ({ children }) => <ul className="chat-markdown__ul">{children}</ul>,
          ol: ({ children }) => <ol className="chat-markdown__ol">{children}</ol>,
          li: ({ children }) => <li className="chat-markdown__li">{children}</li>,
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="chat-markdown__code-inline" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`chat-markdown__code-block ${className || ""}`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="chat-markdown__pre">{children}</pre>,
          a: ({ href, children }) => (
            <a href={href} className="chat-markdown__a" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          h1: ({ children }) => <h1 className="chat-markdown__h1">{children}</h1>,
          h2: ({ children }) => <h2 className="chat-markdown__h2">{children}</h2>,
          h3: ({ children }) => <h3 className="chat-markdown__h3">{children}</h3>,
          blockquote: ({ children }) => <blockquote className="chat-markdown__blockquote">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
