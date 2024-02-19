import { useEffect, useState } from "react";
import { Location, Route, Routes, useLocation } from "react-router-dom";
import BackgroundElement from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

import "@/App.css";

import HomePage from "@/pages/Home.tsx";
import LoginPage from "@/pages/Login.tsx";
import SettingsPage from "@/pages/Settings.tsx";
import ListPage from "./pages/List.tsx";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/ThemeProvider.tsx";

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState<Location>(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <>
      <ThemeProvider>
        <Toaster />
        <BackgroundElement />
        <Navbar />
        <Container
          className={`${transitionStage}`}
          onAnimationEnd={() => {
            if (transitionStage === "fadeOut") {
              setTransistionStage("fadeIn");
              setDisplayLocation(location);
            }
          }}
          asMain
        >
          <Routes location={displayLocation}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/list/:type" element={<ListPage />} />
          </Routes>
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
