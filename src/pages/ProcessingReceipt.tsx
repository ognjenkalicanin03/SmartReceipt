import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Receipt, CheckCircle } from "lucide-react";

const ProcessingReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const file = (location.state as { file?: File })?.file;
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"scanning" | "analyzing" | "done">("scanning");

  useEffect(() => {
    if (!file) {
      navigate("/home");
      return;
    }

    // Phase 1: scanning (0-60%)
    const t1 = setTimeout(() => {
      setProgress(60);
      setPhase("analyzing");
    }, 1200);

    // Phase 2: analyzing (60-100%)
    const t2 = setTimeout(() => {
      setProgress(100);
      setPhase("done");
    }, 2400);

    // Navigate to receipts after done
    const t3 = setTimeout(() => {
      navigate("/receipts");
    }, 3200);

    // Smooth progress ticking
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (phase === "scanning" && prev < 55) return prev + 3;
        if (phase === "analyzing" && prev < 95) return prev + 2;
        return prev;
      });
    }, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, [file, navigate]);

  const phaseText = {
    scanning: "Scanning receipt...",
    analyzing: "Analyzing items & prices...",
    done: "Done!",
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] px-6">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        {/* Icon */}
        <div className="relative">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
              phase === "done" ? "bg-green-500/20" : "bg-primary/10"
            }`}
          >
            {phase === "done" ? (
              <CheckCircle className="w-10 h-10 text-green-500 animate-in zoom-in duration-300" />
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
              phase === "done" ? "bg-green-500" : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {phase === "done"
            ? "Redirecting to your receipts..."
            : "This will only take a moment"}
        </p>
      </div>
    </div>
  );
};

export default ProcessingReceipt;
