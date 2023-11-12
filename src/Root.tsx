import { Outlet } from "react-router-dom";
import NavComp from "./components/Nav";
import BackgroundComponent from "./components/Background";

const RootPage = () => {
  return (
    <>
      <BackgroundComponent />
      <NavComp />
      <Outlet />
    </>
  );
};

export default RootPage;
