import { Button } from '@/components/ui/button'
import { toast, useToast } from "@/components/ui/use-toast";
import { FileDown, Loader2 } from "lucide-react";
import React, { useState } from "react";

function ExportToPdf({ aiOutput }: { aiOutput: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const exportToPDF = async () => {
    if (!aiOutput) {
      toast({
        title: "No content to export!",
        description: "Please generate some content first.",
        variant: "destructive",
      });
      console.log("No content to export!");
      return;
    }

    setLoading(true);

    // 🔄 Loading toast
    toast({
      title: "Export To Pdf Start",
      description: (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating PDF, please wait...</span>
        </div>
      ),
    });

    try {
      const res = await fetch("/api/markdown-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown: aiOutput,
        }),
      });

      if (!res.ok) {
        console.log("Error generating PDF!");
        throw new Error("PDF generation failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // 📄 Trigger PDF download
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.pdf";
      a.click();
      window.URL.revokeObjectURL(url);

      // ✅ Success + "Please save" toast
      toast({
        title: "PDF Ready!",
        description: "Your PDF has been generated. Please save your file.",
      });
    } catch (error) {
      console.error("Export failed", error);
      toast({
        title: "Export failed",
        description: "Something went wrong while generating the PDF.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={exportToPDF}
      variant="bgColor"
      className="gap-x-2"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : <FileDown />} Export PDF
    </Button>
  );
}

export default ExportToPdf