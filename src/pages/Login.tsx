import { userStore, settingsStore, listStore } from "@/util/state";
import "./Home.css";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import CircularProgress from "@/components/CircularProgress";
import { MediaList, Viewer } from "@/util/aniList";
import { defaultListData, defaultSettings } from "@/types/UserData";
import {rootUrl} from "@/main.tsx";
import {setupMatomo} from "@/util/matomo.ts";

function LoginPage() {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Logging you in");

  const firstTime = useRef(true);
  useEffect(() => {
    setupMatomo();
    
    const loggedIn = userStore.checkLogin();
    if (loggedIn && firstTime.current) {
      // Navigate to /
      setRedirect(rootUrl);
      return;
    }

    firstTime.current = false;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const tokenType = params.get("token_type");
    const expiresIn = params.get("expires_in");

    if (!accessToken || !tokenType || !expiresIn)
      window.location.href =
        "https://anilist.co/api/v2/oauth/authorize?client_id=376&response_type=token";

    // Set token
    userStore.token = {
      accessToken: accessToken!,
      tokenType: tokenType!,
      expiresIn: Number(expiresIn!),
      acquiredAt: Date.now(),
    };

    // Get user
    setStatus("Fetching user data");
    Viewer().then((user) => {
      if (!user) {
        // Navigate to /
        setRedirect(rootUrl);
        return;
      }

      userStore.setData({
        id: user.id,
        name: user.name,
        avatar: {
          large: user.avatar.large,
          medium: user.avatar.medium,
        },
        token: userStore.token,
      });

      // Set settings
      settingsStore.setData({
        ...defaultSettings,
        advancedScoring: user.mediaListOptions.scoring.advancedScoringEnabled,
        advCategories: user.mediaListOptions.scoring.advancedScoring,
        scoreSystem: user.mediaListOptions.scoreFormat,
      });

      // Get lists
      setStatus("Fetching anime list");
      MediaList("ANIME").then((list) => {
        if (!list) {
          // Navigate to /
          setRedirect(rootUrl);
          return;
        }

        // Get rid of custom lists
        const animeFiltered = list.filter((x) => !x.isCustomList);
        // Flatten categories
        const categories = animeFiltered.flatMap((x) => x.entries);

        listStore.setData({
          ...defaultListData,
          entries: {
            anime: categories,
            manga: defaultListData.entries.manga,
          },
        });

        // Get manga list
        setStatus("Fetching manga list");
        MediaList("MANGA").then((list) => {
          if (!list) {
            // Navigate to /
            setRedirect(rootUrl);
            return;
          }

          // Get rid of custom lists
          const mangaFiltered = list.filter((x) => !x.isCustomList);
          // Flatten categories
          const categories = mangaFiltered.flatMap((x) => x.entries);

          listStore.setData({
            ...defaultListData,
            entries: {
              anime: listStore.entries.anime,
              manga: categories,
            },
          });

          // Navigate to /
          setRedirect(rootUrl);
        });
      });
    });
  }, []);

  return (
    <>
      {redirect && <Navigate to={redirect} />}
      <section className="min-h-[calc(100vh-6rem)] flex items-center gap-5">
        <CircularProgress size="lg" />
        <h1 className="text-4xl font-bold">
          {status}
          <span className="animate-pulse">...</span>
        </h1>
      </section>
    </>
  );
}

export default LoginPage;
