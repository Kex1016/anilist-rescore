import {useEffect, useRef, useState} from "react";
import {Location, Route, Routes, useLocation} from "react-router-dom";
import BackgroundElement from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

import "@/App.css";

import HomePage from "@/pages/Home.tsx";
import LoginPage from "@/pages/Login.tsx";
import SettingsPage from "@/pages/Settings.tsx";
import ListPage from "./pages/List.tsx";

import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "./components/ThemeProvider.tsx";
import EditorPage from "./pages/Editor.tsx";
import {settingsStore, userStore} from "@/util/state.ts";
import {toast} from "sonner";
import {fetchScoringSettings} from "@/util/aniList.ts";

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState<Location>(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");
  const settings = settingsStore.useState();
  
  const firstTime = useRef(true);

  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;

      if (!settings.lastFetched || settings.lastFetched + 1000 * 60 * 60 * 24 < Date.now()) {
        if (!userStore.checkLogin()) return;
        
        toast("You changed your list settings!", {
          duration: 30000,
          description: "Do you want to fetch your list settings again?",
          action: {
            label: "Fetch",
            onClick: async () => {
              const _s = await fetchScoringSettings();
              if (!_s) {
                toast("Failed to fetch list settings!", {duration: 3000});
                return;
              }
              settingsStore.setData(_s);
              toast("Successfully fetched list settings!");
            }
          }
        })
      }
      
      return;
    }
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <>
      <ThemeProvider>
        <Toaster/>
        <BackgroundElement/>
        <Navbar/>
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
          {/* Do not question why this is here. If I delete this, the page transitions stop working. */}
          <Routes location={displayLocation}>
            <Route path="*" element={<HomePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="/list/:type" element={<ListPage/>}/>
            <Route path="/editor/:type/:id" element={<EditorPage/>}/>
          </Routes>
        </Container>
        <Footer/>
      </ThemeProvider>
    </>
  );
}

export default App;
