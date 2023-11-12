import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import RootPage from "./Root";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import HomePage from "./pages/Home";
import ErrorPage from "./ErrorPage";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ListViewPage from "./pages/ListView";

import { userStore, listStore, settingsStore } from "./util/store";
import {
  defaultListData,
  defaultSettings,
  defaultViewerData,
  ListData,
  Settings,
  Viewer,
} from "./types/UserData";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        id: "Home",
      },
      {
        path: "/about",
        element: <div className="pt-16">About</div>,
        id: "About",
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
        id: "Dashboard",
      },
      {
        path: "/list",
        element: <div className="pt-16">lists</div>,
        id: "List View",
      },
      {
        path: "/list/:type",
        element: <ListViewPage />,
        id: "List View with type",
      },
    ],
    // TODO: Editor
    // Editor must have a History. (planned for v1.1)
    // TODO: About
    // TODO: List View
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

localStorage.getItem("userData") === null &&
  localStorage.setItem("userData", JSON.stringify(defaultViewerData));

localStorage.getItem("lists") === null &&
  localStorage.setItem("lists", JSON.stringify(defaultListData));

localStorage.getItem("settings") === null &&
  localStorage.setItem("settings", JSON.stringify(defaultSettings));

const initUser = JSON.parse(
  localStorage.getItem("userData") as string
) as Viewer;
const initLists = JSON.parse(
  localStorage.getItem("lists") as string
) as ListData;
const initSettings = JSON.parse(
  localStorage.getItem("settings") as string
) as Settings;

userStore.setData(initUser);
listStore.setData(initLists);
settingsStore.setData(initSettings);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>
);
