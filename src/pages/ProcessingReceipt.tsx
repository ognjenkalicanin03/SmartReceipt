import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Receipt, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProcessingReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const file = (location.state as { file?: File })?.file;
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"uploading" | "scanning" | "analyzing" | "done" | "error">("uploading");
  const processedRef = useRef(false);

  useEffect(() => {
    if (!file || processedRef.current) {
      if (!file) navigate("/home");
      return;
    }
    processedRef.current = true;

    const processReceipt = async () => {
      try {
        // Phase 1: uploading (0-20%)
        setProgress(15);

        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const imageBase64 = btoa(binary);

        setProgress(30);
        setPhase("scanning");

        // Phase 2: call edge function
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) {
          throw new Error("Not authenticated");
        }

        setProgress(45);
        setPhase("analyzing");

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-receipt`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageBase64,
              mimeType: file.type || "image/jpeg",
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Processing failed");
        }

        const result = await response.json();

        setProgress(100);
        setPhase("done");

        setTimeout(() => {
          toast.success(`Receipt from ${result.receipt?.store || "store"} processed!`);
          navigate("/receipts");
        }, 800);
      } catch (err) {
        console.error("Processing error:", err);
        setPhase("error");
        toast.error(err instanceof Error ? err.message : "Failed to process receipt");
        setTimeout(() => navigate("/home"), 2500);
      }
    };

    processReceipt();

    // Smooth progress ticking
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (phase === "uploading" && prev < 25) return prev + 2;
        if (phase === "scanning" && prev < 45) return prev + 1;
        if (phase === "analyzing" && prev < 90) return prev + 0.5;
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [file, navigate]);

  const phaseText = {
    uploading: "Uploading receipt...",
    scanning: "Scanning receipt...",
    analyzing: "AI is analyzing items & prices...",
    done: "Done!",
    error: "Something went wrong",
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] px-6">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        {/* Icon */}
        <div className="relative">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
              phase === "done"
                ? "bg-green-500/20"
                : phase === "error"
                ? "bg-destructive/20"
                : "bg-primary/10"
            }`}
          >
            {phase === "done" ? (
              <CheckCircle className="w-10 h-10 text-green-500 animate-in zoom-in duration-300" />
            ) : phase === "error" ? (
              <AlertCircle className="w-10 h-10 text-destructive animate-in zoom-in duration-300" />
            ) : (
              <Receipt className="w-10 h-10 text-primary animate-pulse" />
            )}
          </div>
        </div>

        {/* File name */}
        {file && (
          <p className="text-sm text-muted-foreground truncate max-w-full">
            {file.name}
          </p>
        )}

        {/* Phase text */}
        <h2 className="text-xl font-semibold text-foreground">{phaseText[phase]}</h2>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              phase === "done"
                ? "bg-green-500"
                : phase === "error"
                ? "bg-destructive"
                : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {phase === "done"
            ? "Redirecting to your receipts..."
            : phase === "error"
            ? "Redirecting back..."
            : "This may take a few seconds"}
        </p>
      </div>
    </div>
  );
};

export default ProcessingReceipt;
