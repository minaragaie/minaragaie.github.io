"use client";

import { useState } from "react";
import ResumeDocTemplate from "./ResumeDocTemplate";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import ReactDOMServer from "react-dom/server";

export default function DownloadPDFResume() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const templateHtmlString = ReactDOMServer.renderToString(<ResumeDocTemplate />);

      const response = await fetch(
        "https://resume-backend-service.vercel.app/api/generate-pdf",
        
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer <YOUR_VERSEL_OIDC_TOKEN>" // <-- add your token here
          },
          body: JSON.stringify({ html: templateHtmlString }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mina_Ragaie_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(
        "Error generating PDF. Make sure the backend is deployed, CORS is enabled, and you have a valid token."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="bg-gradient-to-r from-[#007acc] to-[#0086d4] hover:from-[#005a9e] hover:to-[#006bb3] text-white shadow-lg hover:shadow-xl border border-[#007acc]/20"
      onClick={handleDownload}
      disabled={isLoading}
    >
      <Download className="w-4 h-4 mr-2" />
      {isLoading ? "Generating PDF..." : "Download PDF"}
    </Button>
  );
}
