const steps = [
  {
    number: "01",
    emoji: "📸",
    title: "Scan",
    description: "Upload or take a photo of your receipt — it only takes a second.",
  },
  {
    number: "02",
    emoji: "🤖",
    title: "Analyze",
    description: "AI extracts items & categories automatically from your receipt.",
  },
  {
    number: "03",
    emoji: "📊",
    title: "Insights",
    description: "See where your money goes and get smart spending tips.",
  },
];

const HowItWorks = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
        How It Works
      </h1>
      <p className="text-muted-foreground text-lg mb-12">Three simple steps to financial clarity</p>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-4xl">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex-1 flex flex-col items-center text-center bg-card/60 backdrop-blur rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
          >
            <span className="text-5xl mb-4">{step.emoji}</span>
            <span className="text-xs font-bold tracking-widest text-primary/60 uppercase mb-2">
              Step {step.number}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{step.title}</h2>
            <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
