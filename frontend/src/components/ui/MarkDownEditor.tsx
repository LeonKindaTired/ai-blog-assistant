import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "./textarea";
import "../../index.css";

const MarkDownEditor = () => {
  const [markdown, setMarkdown] = useState<string>("");
  return (
    <div className="flex flex-col gap-5 items-center justify-center p-2">
      <h1 className="text-2xl font-bold">Insert Your Text</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write your data here"
          className="min-h-32"
        />
        <div className="border border-gray-300 w-full min-h-32 rounded-lg overflow-auto p-4 markdown-container">
          <ReactMarkdown
            children={markdown}
            components={{
              p: ({ node, ...props }) => (
                <p className="break-words" {...props} />
              ),
              h1: ({ node, ...props }) => (
                <h1 className="break-words" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="break-words" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="break-words" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="break-words" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="break-words" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="break-words" {...props} />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkDownEditor;
