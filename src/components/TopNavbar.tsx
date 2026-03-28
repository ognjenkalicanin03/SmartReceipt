import { Receipt, LogOut, Settings, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Receipt className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground text-lg">SmartReceipt</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none focus:ring-2 focus:ring-ring">
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-accent text-accent-foreground text-sm font-semibold">
                U
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/receipts")} className="cursor-pointer gap-2">
            <span>🧾</span>
            <span>My Receipts</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer gap-2">
            <span>⚙️</span>
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
            <span>🚪</span>
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TopNavbar;
