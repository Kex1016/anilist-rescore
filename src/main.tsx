import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { listStore, settingsStore, userStore } from "@/util/state.ts";
import {
  defaultListData,
  defaultSettings,
  defaultViewerData,
} from "@/types/UserData.ts";

import HomePage from "@/pages/Home.tsx";
import LoginPage from "@/pages/Login.tsx";
import SettingsPage from "@/pages/Settings.tsx";
import ListPage from "./pages/List.tsx";
import EditorPage from "./pages/Editor.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <div>
        <h1>Error</h1>
        <p>There was an error loading the page</p>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/list/:type",
        element: <ListPage />,
      },
      {
        path: "/editor/:type/:id",
        element: <EditorPage />,
      },
    ],
  },
]);

// Set up stores
const settings = localStorage.getItem("settings");
const listData = localStorage.getItem("lists");
const viewerData = localStorage.getItem("user");

if (!settings) {
  console.log("No settings found, setting default settings");
  settingsStore.setData(defaultSettings);
} else {
  settingsStore.setData(JSON.parse(settings));
}

if (!listData) {
  console.log("No list data found, setting default list data");
  listStore.setData(defaultListData);
} else {
  listStore.setData(JSON.parse(listData));
}

if (!viewerData) {
  console.log("No user data found, setting default user data");
  userStore.setData(defaultViewerData);
} else {
  userStore.setData(JSON.parse(viewerData));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
