import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

function ExportToPdf({aiOutput}: {aiOutput: string}) {
    const [loading, setLoading] = useState(false);

    const exportToPDF = async () => {
        if (!aiOutput) {
            console.log("No content to export!");
            return;
        }
        setLoading(true);
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
                return;
            }
            console.log(res);

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "output.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed", error);
        } finally {
            setLoading(false);
        }
    };

  return (
      <Button onClick={exportToPDF} variant="bgColor" className="gap-x-2" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <FileDown />} Export PDF
      </Button>
  )
}

export default ExportToPdf