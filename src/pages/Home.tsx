import { Receipt } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-6">
        <Receipt className="w-10 h-10 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Welcome!</h1>
      <p className="text-muted-foreground text-center text-sm max-w-[280px]">
        You've successfully logged in. This page will be styled soon.
      </p>
    </div>
  );
};

export default Home;
