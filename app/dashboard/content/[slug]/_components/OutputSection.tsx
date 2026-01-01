"use client";

import { Editor } from "@toast-ui/react-editor";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ExportToPdf from "@/app/dashboard/_components/ExportToPdf";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { useTheme } from "next-themes";
import HeaderOutSection from "./HeaderOutSection";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

interface OutputSectionProps {
  aiOutput: string;
}

export const OutputSection: React.FC<OutputSectionProps> = ({ aiOutput }) => {
  const editorRef = useRef<Editor>(null);
  const { toast } = useToast();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [editorContent, setEditorContent] = useState(aiOutput || "");

  // 👇 next-themes doesn't have `theme` available on first render (SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // When AI output changes, set it in editor
  useEffect(() => {
    if (editorRef.current && aiOutput) {
      const instance = editorRef.current.getInstance();
      instance.setMarkdown(aiOutput);
      setEditorContent(aiOutput);
    }
  }, [aiOutput]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const instance = editorRef.current.getInstance();
      const content = instance.getMarkdown();
      setEditorContent(content);
    }
  };

  // 🧠 Re-render the Editor only when the theme changes
  const currentTheme = mounted && theme === "dark" ? "dark" : "light";

  // Prevents hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="col-span-2 h-fit border">
      <HeaderOutSection aiOutput={aiOutput} editorRef={editorRef} />
      <div className="h-full w-full">
        {/* 🔥 Key prop forces re-render on theme change */}
        <Editor
          key={currentTheme}
          ref={editorRef}
          initialValue="Your result will appear here!"
          initialEditType="wysiwyg"
          height="650px"
          theme={currentTheme}
          useCommandShortcut={true}
          onChange={handleEditorChange}
          plugins={[colorSyntax]}
        />
      </div>
    </div>
  );
};
