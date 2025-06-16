import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  Save,
  FolderOpen,
  Sparkles,
  FileText,
  X,
  Wand2,
  RotateCw,
  Sun,
  Moon,
} from "lucide-react";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useThemeContext } from "@/context/themeContext";

const MarkDownEditor = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { theme, setTheme } = useThemeContext();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleGenerateIntro = async () => {
    if (markdown.length <= 100) {
      toast.warning("Content too short", {
        description: "Please enter at least 100 characters",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post(
        "http://localhost:5000/api/generate/generate-intro",
        { content: markdown }
      );
      setMarkdown(`${response.data.intro}\n\n${markdown}`);
      toast.success("Introduction generated!");
    } catch (error) {
      toast.error("Generation failed", {
        description: "Couldn't generate introduction",
      });
      console.error("Intro generation failed: ", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (markdown.length <= 100) {
      toast.warning("Content too short", {
        description: "Please enter at least 100 characters",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post(
        "http://localhost:5000/api/generate/generate-summary",
        { content: markdown }
      );
      setSummary(response.data.summary);
      toast.success("Summary generated!");
    } catch (error) {
      toast.error("Generation failed", {
        description: "Couldn't generate summary",
      });
      console.error("Summary generation failed: ", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDraft = () => {
    localStorage.setItem("draft", markdown);
    toast("Draft has been saved.");
  };

  const loadDraft = () => {
    const draft = localStorage.getItem("draft") ?? "";
    setMarkdown(draft);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (markdown.length > 0) {
        const storedDraft = localStorage.getItem("draft");
        const currentDraft = JSON.stringify(markdown);

        if (storedDraft !== currentDraft) {
          localStorage.setItem("draft", currentDraft);
          toast("Draft auto-saved.");
        }
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [markdown]);

  return (
    <div className="max-w-6xl w-full mx-auto p-4 md:p-6">
      <Card className="bg-background shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Markdown Editor
              </CardTitle>
              <CardDescription className="mt-2">
                Write in Markdown and preview in real-time
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={saveDraft}
                      disabled={markdown.length === 0}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save Draft</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={loadDraft}>
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Load Draft</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleTheme}>
                      {theme === "light" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid grid-cols-2 w-[200px] mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <div className="space-y-3">
                <Label htmlFor="markdown-editor">Your Content</Label>
                <Textarea
                  id="markdown-editor"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Write your Markdown here..."
                  className="min-h-[300px] w-full font-mono text-sm p-4"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-3">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 min-h-[300px] bg-white dark:bg-gray-900 text-left">
                  <ReactMarkdown
                    children={markdown || "*Nothing to preview*"}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {summary && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <Label>AI Summary</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSummary("")}
                >
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <ReactMarkdown children={summary} />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 justify-between border-t pt-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating || markdown.length < 100}
            >
              {isGenerating ? (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Summarize
            </Button>

            <Button
              onClick={handleGenerateIntro}
              disabled={isGenerating || markdown.length < 100}
              variant="secondary"
            >
              {isGenerating ? (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Intro
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {markdown.length} characters
            {markdown.length < 100 && (
              <span className="text-amber-600 dark:text-amber-400 ml-2">
                (min 100 required)
              </span>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Auto-saves every 10 seconds
      </div>
    </div>
  );
};

export default MarkDownEditor;
