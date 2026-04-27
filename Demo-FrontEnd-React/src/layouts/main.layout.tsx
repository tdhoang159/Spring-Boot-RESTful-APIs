import { App } from "antd";
import { Outlet } from "react-router";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <App>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </App>
  );
};

export default MainLayout;
