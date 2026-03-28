import { useRef } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-receipts.jpg";

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    navigate("/processing", { state: { file } });
  };

  const handleScanReceipt = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) processFile(file);
    };
    input.click();
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  return (
    <div className="flex-1">
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-0">
          <div className="flex flex-col md:flex-row items-center gap-0">
            {/* Text Side */}
            <div className="flex-1 z-20 text-center md:text-left md:-mr-24 relative">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                Scan receipts.{" "}
                <span className="text-primary">Understand your spending</span>{" "}
                instantly.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed">
                Upload a photo of your receipt and get automatic insights.
              </p>

              {/* Desktop CTA */}
              <div className="hidden md:flex flex-col items-start gap-3 mt-8">
                <Button size="lg" onClick={handleScanReceipt} className="gap-2 text-base">
                  📷 Scan Receipt
                </Button>
                <button
                  onClick={handleUploadImage}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Or upload from gallery
                </button>
              </div>
            </div>

            {/* Image Side */}
            <div className="flex-1 relative flex items-center justify-center md:flex-[1.3]">
              <div className="hidden md:block absolute inset-y-0 -left-8 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
              <div className="md:hidden absolute inset-x-0 -top-4 h-24 bg-gradient-to-b from-background via-background/60 to-transparent z-10" />
              <div
                className="relative w-full"
                style={{
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                  maskComposite: "intersect",
                }}
              >
                <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-3xl" />
                <img src={heroImage} alt="Receipts and groceries flat lay" width={1024} height={1024} className="relative object-cover w-full aspect-[4/3] md:aspect-square" />
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="flex md:hidden flex-col items-center gap-3 mt-6 w-full z-20">
              <Button size="lg" onClick={handleScanReceipt} className="gap-2 text-base w-full max-w-xs">
                📷 Scan Receipt
              </Button>
              <button
                onClick={handleUploadImage}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Upload className="w-4 h-4" />
                Or upload from gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelected} />
    </div>
  );
};

export default Home;
