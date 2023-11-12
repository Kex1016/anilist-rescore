import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { Spinner } from "@nextui-org/react";
import BackgroundComponent from "../components/Background";
import NavComp from "../components/Nav";
import {
  Settings,
  Viewer as ViewerType,
  defaultSettings,
  ListData,
  defaultViewerData,
} from "../types/UserData";
import { checkLogin } from "../util/checkLogin";
import { MediaList, Viewer } from "../util/aniList";
import { defaultListData } from "../types/UserData";

import {
  userStore,
  UserStore,
  settingsStore,
  SettingsStore,
  listStore,
  ListStore,
} from "../util/store";

const LoginPage = ({
  user = userStore,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  settings = settingsStore,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  list = listStore,
}: {
  user?: UserStore;
  settings?: SettingsStore;
  list?: ListStore;
}) => {
  const userData = user.useState();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (userStore.checkLogin()) {
      setLoggedIn(true);
      return;
    }

    if (!userData) {
      userStore.setData(defaultViewerData);
      localStorage.setItem("userData", JSON.stringify(defaultViewerData));
    }

    const url = new URL(window.location.href.replace("#", "?"));
    const accessToken = url.searchParams.get("access_token");
    const tokenType = url.searchParams.get("token_type");
    const expiresIn = url.searchParams.get("expires_in");

    // FIXME: Nope. Not working. At all.
    if (accessToken && tokenType && expiresIn) {
      console.log("Missing token");

      const _d = {
        ...defaultViewerData,
        token: {
          accessToken: accessToken,
          tokenType: tokenType,
          expiresIn: parseInt(expiresIn) || 0,
          acquiredAt: Date.now(),
        },
      };

      // Set the user token
      userStore.setData(_d);
      localStorage.setItem("userData", JSON.stringify(_d));
    }

    if (!accessToken && !checkLogin(userData)) {
      console.log("Redirecting to login page");
      window.location.href = `https://anilist.co/api/v2/oauth/authorize?client_id=376&response_type=token`;
    }

    const getViewer = async () => {
      console.log("Fetching user data");
      const viewer = await Viewer();

      if (viewer) {
        console.log("Got user data");

        const _d: ViewerType = {
          ...userData,
          id: viewer.id,
          name: viewer.name,
          avatar: viewer.avatar,
          token: {
            accessToken: userData.token.accessToken,
            tokenType: userData.token.tokenType,
            expiresIn: userData.token.expiresIn,
            acquiredAt: userData.token.acquiredAt,
          },
        };
        const _s: Settings = {
          ...defaultSettings,
          scoreSystem: viewer.mediaListOptions.scoreFormat,
          advancedScoring:
            viewer.mediaListOptions.scoring.advancedScoringEnabled,
          advCategories: viewer.mediaListOptions.scoring.advancedScoring,
        };

        // Save the user data
        localStorage.setItem("userData", JSON.stringify(_d));
        userStore.setData(_d);

        localStorage.setItem("settings", JSON.stringify(_s));
        settingsStore.setData(_s);

        // FIXME: This can definitely be optimized
        const animeList = await MediaList("ANIME");

        if (animeList) {
          console.log("Got anime list");

          // Set a fromList property on each entry
          for (const list of animeList) {
            for (const entry of list.entries) {
              const i = animeList.indexOf(list);
              const j = animeList[i].entries.indexOf(entry);
              animeList[i].entries[j].fromList = list.name;
            }
          }

          // Flatten the list
          const flatList = animeList.flatMap((list) => list.entries);
          const _l: ListData = {
            ...defaultListData,
            entries: {
              anime: flatList,
              manga: listStore.mangaList,
            },
          };

          // Save the user data
          localStorage.setItem("lists", JSON.stringify(_l));
          listStore.setData(_l);
        }

        const mangaList = await MediaList("MANGA");

        if (mangaList) {
          console.log("Got manga list");

          // Set a fromList property on each entry
          for (const list of mangaList) {
            for (const entry of list.entries) {
              const i = mangaList.indexOf(list);
              const j = mangaList[i].entries.indexOf(entry);
              mangaList[i].entries[j].fromList = list.name;
            }
          }

          // Flatten the list
          const flatList = mangaList.flatMap((list) => list.entries);
          const _l: ListData = {
            ...defaultListData,
            entries: {
              anime: listStore.animeList,
              manga: flatList,
            },
          };

          // Save the user data
          localStorage.setItem("lists", JSON.stringify(_l));
          listStore.setData(_l);
        }

        // Save the user data
        setLoggedIn(true);
      }
    };

    if (userStore.checkLogin() && !userData.id) getViewer();
  }, [userData]);

  return (
    <>
      <BackgroundComponent />
      <NavComp />
      <div className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full flex justify-center items-center gap-3 h-[calc(100vh_-_65px)]">
        <Spinner size="lg" />
        <div className="text-2xl">Logging in...</div>
        {userStore.checkLogin() && loggedIn && <Navigate to="/" />}
      </div>
    </>
  );
};

export default LoginPage;
