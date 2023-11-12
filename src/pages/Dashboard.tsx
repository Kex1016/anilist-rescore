import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  Switch,
  Skeleton,
  Chip,
} from "@nextui-org/react";

import { MdList, MdStar, MdHistory } from "react-icons/md";
import { List, UserData, maxScores, scoreSystemNames } from "../types/UserData";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { checkLogin } from "../util/checkLogin";
import { MediaList, Viewer } from "../util/aniList";

const DashboardPage = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("data") as string) as UserData
  );

  const [loadingStates, setLoadingStates] = useState({
    scoringSettings: true,
    listSettings: true,
    historySettings: true,
  });

  const averageScores = () => {
    let totalScore = 0;
    let totalEntries = 0;

    userData.lists.entries.anime.forEach((entry) => {
      if (entry.score) {
        totalScore += entry.score;
        totalEntries++;
      }
    });

    userData.lists.entries.manga.forEach((entry) => {
      if (entry.score) {
        totalScore += entry.score;
        totalEntries++;
      }
    });

    return (totalScore / totalEntries).toFixed(1);
  };

  const fetchScoringSettings = async () => {
    setLoadingStates({
      ...loadingStates,
      scoringSettings: false,
    });

    const _v = await Viewer();

    if (!_v) {
      return;
    }

    const _d = {
      ...userData,
      settings: {
        ...userData.settings,
        scoreSystem: _v.mediaListOptions.scoreFormat,
        advancedScoring: _v.mediaListOptions.scoring.advancedScoringEnabled,
        advCategories: _v.mediaListOptions.scoring.advancedScoring,
      },
    };

    localStorage.setItem("data", JSON.stringify(_d));
    setUserData(_d);

    setLoadingStates({
      ...loadingStates,
      scoringSettings: true,
    });
  };

  const fetchListSettings = async () => {
    setLoadingStates({
      ...loadingStates,
      listSettings: false,
    });

    const animeList = await MediaList("ANIME");
    const mangaList = await MediaList("MANGA");

    if (!animeList || !mangaList) {
      return;
    }

    const compare = (list: List) => {
      if (list.name === "Completed" && userData.settings.enabledLists.completed)
        return true;
      if (list.name === "Watching" && userData.settings.enabledLists.current)
        return true;
      if (list.name === "Planning" && userData.settings.enabledLists.planning)
        return true;
      if (list.name === "Paused" && userData.settings.enabledLists.paused)
        return true;
      if (list.name === "Dropped" && userData.settings.enabledLists.dropped)
        return true;
      return false;
    };

    // FIXME: This can definitely be optimized (maybe)
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

    // Save the user data
    const _d: UserData = {
      ...userData,
      lists: {
        ...userData.lists,
        entries: {
          ...userData.lists.entries,
          anime: flatAnimeList,
          manga: flatMangaList,
        },
      },
      settings: {
        ...userData.settings,
        lastFetched: Date.now(),
      },
    };

    localStorage.setItem("data", JSON.stringify(_d));
    setUserData(_d);

    setLoadingStates({
      ...loadingStates,
      listSettings: true,
    });
  };

  return (
    <>
      {!checkLogin(userData) && <Navigate to="/" />}
      <section className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full mt-24 mb-10">
        <section className="gap-5">
          <div className="text-3xl font-bold tracking-tight">Dashboard</div>
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card>
              <CardHeader>Total anime cached</CardHeader>
              <Divider />
              <CardBody>{userData.lists.entries.anime.length}</CardBody>
            </Card>
            <Card>
              <CardHeader>Total manga cached</CardHeader>
              <Divider />
              <CardBody>{userData.lists.entries.manga.length}</CardBody>
            </Card>
            <Card>
              <CardHeader>Average score</CardHeader>
              <Divider />
              <CardBody>
                {averageScores()} / {maxScores[userData.settings.scoreSystem]}
              </CardBody>
            </Card>
          </div>

          <Card className="mt-5">
            <CardHeader>
              <div className="icon text-4xl mr-3">
                <MdStar />
              </div>
              <div className="flex flex-col">
                <p className="text-md">Scoring settings</p>
                <p className="text-small text-default-500">
                  Change how your list is scored
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="w-full flex justify-center">
                <Button
                  onClick={async () => {
                    await fetchScoringSettings();
                  }}
                  isLoading={!loadingStates.scoringSettings}
                  isDisabled={!loadingStates.scoringSettings}
                >
                  Fetch scoring settings from AniList
                </Button>
              </div>
              <div className="mt-3 w-full flex flex-col gap-3">
                <p className="text-small text-default-500">
                  Current scoring settings
                </p>
                <Divider />
                <div className="flex flex-row gap-2">
                  <span>Advanced scoring:</span>
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={loadingStates.scoringSettings}
                  >
                    <Code>
                      {userData.settings.advancedScoring
                        ? "Enabled"
                        : "Disabled"}
                    </Code>
                  </Skeleton>
                </div>
                <div className="flex flex-row gap-2">
                  <span>Scoring system:</span>
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={loadingStates.scoringSettings}
                  >
                    <Code>
                      {scoreSystemNames[userData.settings.scoreSystem]}
                    </Code>
                  </Skeleton>
                </div>
                {userData.settings.advancedScoring && (
                  <div className="flex flex-col gap-2">
                    <span>Advanced scoring categories:</span>
                    <Skeleton
                      classNames={{
                        base: "rounded-lg data-[loaded=true]:!bg-transparent",
                        content: "flex flex-col gap-2",
                      }}
                      isLoaded={loadingStates.scoringSettings}
                    >
                      {userData.settings.advCategories.map((category) => (
                        <Code key={category}>{category}</Code>
                      ))}
                    </Skeleton>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          <Card className="mt-5">
            <CardHeader>
              <div className="icon text-4xl mr-3">
                <MdList />
              </div>
              <div className="flex flex-col">
                <p className="text-md">List settings</p>
                <p className="text-small text-default-500">
                  Change how your list is fetched
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="w-full flex flex-col gap-3">
                <p className="text-small text-default-500">
                  Current list settings:
                </p>
                <Divider />
                <Switch
                  isDisabled={!loadingStates.listSettings}
                  isSelected={userData.settings.enabledLists.completed}
                  onValueChange={(value) => {
                    setUserData({
                      ...userData,
                      settings: {
                        ...userData.settings,
                        enabledLists: {
                          ...userData.settings.enabledLists,
                          completed: value,
                        },
                      },
                    });
                    localStorage.setItem("data", JSON.stringify(userData));
                  }}
                >
                  Fetch "Completed" list(s)
                </Switch>
                <Switch
                  isDisabled={!loadingStates.listSettings}
                  isSelected={userData.settings.enabledLists.current}
                  onValueChange={(value) => {
                    setUserData({
                      ...userData,
                      settings: {
                        ...userData.settings,
                        enabledLists: {
                          ...userData.settings.enabledLists,
                          current: value,
                        },
                      },
                    });
                    localStorage.setItem("data", JSON.stringify(userData));
                  }}
                >
                  Fetch "Watching/Reading" list
                </Switch>
                <Switch
                  isDisabled={!loadingStates.listSettings}
                  isSelected={userData.settings.enabledLists.planning}
                  onValueChange={(value) => {
                    setUserData({
                      ...userData,
                      settings: {
                        ...userData.settings,
                        enabledLists: {
                          ...userData.settings.enabledLists,
                          planning: value,
                        },
                      },
                    });
                    localStorage.setItem("data", JSON.stringify(userData));
                  }}
                >
                  Fetch "Plan to Read/Watch" list
                </Switch>
                <Switch
                  isDisabled={!loadingStates.listSettings}
                  isSelected={userData.settings.enabledLists.paused}
                  onValueChange={(value) => {
                    setUserData({
                      ...userData,
                      settings: {
                        ...userData.settings,
                        enabledLists: {
                          ...userData.settings.enabledLists,
                          paused: value,
                        },
                      },
                    });
                    localStorage.setItem("data", JSON.stringify(userData));
                  }}
                >
                  Fetch "Paused" list
                </Switch>
                <Switch
                  isDisabled={!loadingStates.listSettings}
                  isSelected={userData.settings.enabledLists.dropped}
                  onValueChange={(value) => {
                    setUserData({
                      ...userData,
                      settings: {
                        ...userData.settings,
                        enabledLists: {
                          ...userData.settings.enabledLists,
                          dropped: value,
                        },
                      },
                    });
                    localStorage.setItem("data", JSON.stringify(userData));
                  }}
                >
                  Fetch "Dropped" list
                </Switch>
              </div>
              <div className="w-full flex flex-col gap-1 items-center mt-3">
                <Button
                  onClick={async () => {
                    await fetchListSettings();
                  }}
                  isLoading={!loadingStates.listSettings}
                  isDisabled={!loadingStates.listSettings}
                  className="w-fit"
                >
                  Re-fetch lists from AniList
                </Button>
                <Skeleton
                  isLoaded={loadingStates.listSettings}
                  classNames={{
                    base: "rounded-lg data-[loaded=true]:!bg-transparent",
                    content: "flex flex-col gap-2",
                  }}
                >
                  <div className="text-foreground-300">
                    Last fetched:{" "}
                    {new Date(
                      userData.settings.lastFetched as number
                    ).toLocaleString()}
                  </div>
                </Skeleton>
              </div>
            </CardBody>
          </Card>
          <Card className="mt-5">
            <CardHeader>
              <div className="icon text-4xl mr-3">
                <MdHistory />
              </div>
              <div className="flex flex-col">
                <p className="text-md">History settings</p>
                <p className="text-small text-default-500">
                  Change how your history is handled
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-row gap-1">
                Coming with{" "}
                <Chip variant="faded" size="sm" className="text-xs">
                  v1.1
                </Chip>
              </div>
            </CardBody>
          </Card>
        </section>
      </section>
    </>
  );
};

export default DashboardPage;
