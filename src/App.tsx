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
import {listStore, settingsStore, userStore} from "@/util/state.ts";
import {toast} from "sonner";
import {fetchScoringSettings, MediaList, testListIntegrity} from "@/util/aniList.ts";
import {setupMatomo} from "@/util/matomo.ts";
import {List} from "@/types/UserData.ts";

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState<Location>(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");
  const settings = settingsStore.useState();
  
  const firstTime = useRef(true);

  useEffect(() => {
    if (firstTime.current) {
      const integrityViolated = testListIntegrity();
      if (integrityViolated && userStore.checkLogin()) {
        toast("Your list is not in a valid state!", {
          duration: 5000,
          description: "Re-fetching your data..."
        });

        MediaList("MANGA").then(mangaList => {
          MediaList("ANIME").then(animeList => {
            if (!mangaList || !animeList) {
              toast("Failed to fetch your list data!", {duration: 3000});
              return;
            }

            const compare = (list: List) => {
              if (list.name === "Completed" && settings.enabledLists.completed)
                return true;
              if (list.name === "Watching" && settings.enabledLists.current)
                return true;
              if (list.name === "Planning" && settings.enabledLists.planning)
                return true;
              if (list.name === "Paused" && settings.enabledLists.paused) return true;
              if (list.name === "Dropped" && settings.enabledLists.dropped) return true;
              return false;
            };

            // Get rid of lists that aren't enabled
            const _a = animeList.filter((list) => {
              return compare(list);
            });
            const _m = mangaList.filter((list) => {
              return compare(list);
            });

            // Set a fromList property on each entry
            for (const list of _a) {
              for (const entry of list.entries) {
                const i = _a.indexOf(list);
                const j = _a[i].entries.indexOf(entry);
                _a[i].entries[j].fromList = list.name;
              }
            }

            // Flatten the list
            const flatAnimeList = _a.flatMap((list) => list.entries);
            const flatMangaList = _m.flatMap((list) => list.entries);

            listStore.animeList = flatAnimeList;
            listStore.mangaList = flatMangaList;

            toast("Successfully fetched your list data!");
          });
        });
      }
      
      setupMatomo();
      
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
  }, [location, displayLocation, settings.lastFetched, settings.enabledLists]);

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
