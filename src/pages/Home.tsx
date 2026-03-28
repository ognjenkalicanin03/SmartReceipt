import heroImage from "@/assets/hero-receipts.jpg";

const Home = () => {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-0">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0">
            {/* Text Side */}
            <div className="flex-1 z-10 text-center md:text-left md:pr-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                Scan receipts.{" "}
                <span className="text-primary">Understand your spending</span>{" "}
                instantly.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed">
                Upload a photo of your receipt and get automatic insights powered by AI.
              </p>
            </div>

            {/* Image Side with fade */}
            <div className="flex-1 relative flex items-center justify-center">
              {/* Fade overlay between text and image */}
              <div className="hidden md:block absolute inset-y-0 -left-16 w-32 bg-gradient-to-r from-background to-transparent z-10" />
              
              {/* Mobile top fade */}
              <div className="md:hidden absolute inset-x-0 -top-4 h-16 bg-gradient-to-b from-background to-transparent z-10" />

              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-secondary/30 rounded-3xl blur-2xl" />
                <img
                  src={heroImage}
                  alt="Receipts and groceries flat lay"
                  width={1024}
                  height={1024}
                  className="relative rounded-2xl shadow-2xl object-cover w-full aspect-square"
                />
                {/* Bottom fade on mobile */}
                <div className="md:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent rounded-b-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
