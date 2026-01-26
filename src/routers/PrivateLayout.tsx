import { Outlet, useNavigate } from "react-router";
import { BottomNav } from "../Components/BottomNav/BottomNav";

export const PrivateLayout = () => {
  const navigate = useNavigate();
  return (
    <div className='app-layout'>
      <main className='app-content'>
        <Outlet />
      </main>

      <BottomNav
        items={[
          {
            id: "home",
            label: "Home",
            icon: "🏠",
            active: location.pathname === "/",
            onClick: () => navigate("/"),
          },
          {
            id: "settings",
            label: "Settings",
            icon: "⚙️",
            active: location.pathname === "/settings",
            onClick: () => navigate("/settings"),
          },
          {
            id: "profile",
            label: "Profile",
            icon: "👤",
            active: location.pathname === "/profile",
            onClick: () => navigate("/profile"),
          },
        ]}
      />
    </div>
  );
};
