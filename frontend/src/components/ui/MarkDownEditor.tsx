import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "./textarea";
import "../../index.css";
import { Button } from "./button";
import axios from "axios";

const MarkDownEditor = () => {
  const [markdown, setMarkdown] = useState<string>("");

  const handleGenerateIntro = async () => {
    if (markdown.length) return alert("100 or more characters.");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate/generate-intro",
        {
          content: markdown,
        }
      );
      const generatedIntro = response.data.intro;
      setMarkdown(`${generatedIntro}\n\n${markdown}`);
    } catch (error) {
      console.error("Intro generation failed: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col gap-5 items-center justify-center p-2 w-full h-full">
        <h1 className="text-2xl font-bold">Insert Your Text</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write your blog idea here..."
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
      <div className="flex items-center justify-center gap-5 my-3">
        <Button onClick={handleGenerateIntro}>Generate Intro</Button>
      </div>
    </div>
  );
};

export default MarkDownEditor;
