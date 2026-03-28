import heroImage from "@/assets/hero-receipts.jpg";

const Home = () => {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-0">
          <div className="flex flex-col md:flex-row items-center gap-0">
            {/* Text Side - overlaps image */}
            <div className="flex-1 z-20 text-center md:text-left md:-mr-24 relative">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                Scan receipts.{" "}
                <span className="text-primary">Understand your spending</span>{" "}
                instantly.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed">
                Upload a photo of your receipt and get automatic insights.
              </p>
            </div>

            {/* Image Side with fade */}
            <div className="flex-1 relative flex items-center justify-center md:flex-[1.3]">
              {/* Left fade into text */}
              <div className="hidden md:block absolute inset-y-0 -left-8 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
              
              {/* Mobile top fade */}
              <div className="md:hidden absolute inset-x-0 -top-4 h-24 bg-gradient-to-b from-background via-background/60 to-transparent z-10" />

              <div className="relative w-full" style={{ WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at center, black 20%, transparent 65%)', maskImage: 'radial-gradient(ellipse 70% 65% at center, black 20%, transparent 65%)' }}>
                <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-3xl" />
                <img
                  src={heroImage}
                  alt="Receipts and groceries flat lay"
                  width={1024}
                  height={1024}
                  className="relative object-cover w-full aspect-[4/3] md:aspect-square"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
