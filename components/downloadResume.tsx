"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useGeneratePDFMutation } from "@/lib/api/apiSlice";

export default function DownloadPDFResume() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatePDF] = useGeneratePDFMutation();

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      // Call the new backend PDF generation endpoint using RTK Query
      const blob = await generatePDF().unwrap();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Mina_Youaness_Resume_${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(
        "Error generating PDF. Please try again or check if the backend service is running."
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
