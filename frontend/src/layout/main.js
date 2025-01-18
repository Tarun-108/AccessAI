import { Outlet } from "react-router-dom";

const MainLayout = ({ children }) => {
  return (
    <div>
      {/* <Header /> */}
      <Outlet />
    </div>
  );
};

export default MainLayout;