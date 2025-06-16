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
    <div className="max-w-6xl w-full mx-auto md:p-6">
      <Card className="bg-background shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                <span className="truncate">Markdown Editor</span>
              </CardTitle>
              <CardDescription className="mt-1 md:mt-2 text-center md:text-left">
                Write in Markdown and preview in real-time
              </CardDescription>
            </div>

            <div className="flex justify-between md:gap-2 flex-wrap">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-1/4 md:h-9 md:w-9 "
                      onClick={saveDraft}
                      disabled={markdown.length === 0}
                    >
                      <Save className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-1/4 md:h-9 md:w-9"
                      onClick={loadDraft}
                    >
                      <FolderOpen className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-1/4 md:h-9 md:w-9"
                      onClick={toggleTheme}
                    >
                      {theme === "light" ? (
                        <Moon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      ) : (
                        <Sun className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
            <TabsList className="w-full max-w-xs mx-auto md:mx-0 mb-4 md:mb-4 md:w-[200px] md:items-start">
              <TabsTrigger value="editor" className="w-full">
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="w-full">
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <div className="space-y-2 md:space-y-3">
                <Label htmlFor="markdown-editor">Your Content</Label>
                <Textarea
                  id="markdown-editor"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Write your Markdown here..."
                  className="min-h-[250px] md:min-h-[300px] w-full font-mono text-xs md:text-sm p-3 md:p-4"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-2 md:space-y-3">
                <Label>Preview</Label>
                <div className="border rounded-lg p-3 min-h-[250px] md:min-h-[300px] bg-white dark:bg-gray-900 text-left text-sm md:text-base">
                  <ReactMarkdown
                    children={markdown || "*Nothing to preview*"}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {summary && (
            <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
              <div className="flex justify-between items-center">
                <Label>AI Summary</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSummary("")}
                >
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" /> Clear
                </Button>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 md:p-4 border border-blue-200 dark:border-blue-800 text-sm">
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
              className="w-full md:w-auto"
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
              className="w-full md:w-auto"
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

      <div className="mt-3 text-center text-xs md:text-sm text-muted-foreground">
        Auto-saves every 10 seconds
      </div>

      <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Scribo • Works on all devices</p>
        <p className="mt-1">Desktop | Tablet | Mobile</p>
      </footer>
    </div>
  );
};

export default MarkDownEditor;
