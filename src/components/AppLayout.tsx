import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />
      <main className="flex-1 pb-14 md:pb-0">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default AppLayout;
