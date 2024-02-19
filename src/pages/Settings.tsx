import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { List, ListData, Settings, scoreSystemNames } from "@/types/UserData";
import { MediaList, Viewer } from "@/util/aniList";
import { listStore, settingsStore, userStore } from "@/util/state";
import { useState } from "react";
import NotLoggedInPage from "./NotLoggedIn";
import { MdStar, MdList, MdQuestionMark } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";

function SettingsPage() {
  const lists = listStore.useState();
  const settings = settingsStore.useState();

  const [loadingStates, setLoadingStates] = useState({
    scoring: false,
    list: false,
    history: false,
  });

  const fetchScoringSettings = async () => {
    setLoadingStates({
      ...loadingStates,
      scoring: true,
    });

    const _v = await Viewer();

    if (!_v) return;

    const _s: Settings = {
      ...settings,
      scoreSystem: _v.mediaListOptions.scoreFormat,
      advancedScoring: _v.mediaListOptions.scoring.advancedScoringEnabled,
      advCategories: _v.mediaListOptions.scoring.advancedScoring,
      lastFetched: Date.now(),
    };

    settingsStore.setData(_s);

    setLoadingStates({
      ...loadingStates,
      scoring: false,
    });
  };

  const fetchListSettings = async () => {
    setLoadingStates({
      ...loadingStates,
      list: true,
    });

    const animeList = await MediaList("ANIME");
    const mangaList = await MediaList("MANGA");

    if (!animeList || !mangaList) {
      alert("Failed to fetch list data from AniList");
      setLoadingStates({
        ...loadingStates,
        list: false,
      });
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

    // Save the user data
    const _l: ListData = {
      ...lists,
      entries: {
        anime: flatAnimeList,
        manga: flatMangaList,
      },
    };

    const _s: Settings = {
      ...settings,
      lastFetched: Date.now(),
    };

    listStore.setData(_l);
    settingsStore.setData(_s);

    setLoadingStates({
      ...loadingStates,
      list: false,
    });
  };

  if (!userStore.checkLogin()) return <NotLoggedInPage />;

  return <section className="settings container py-10 min-h-[100dvh]">
    {/* SCORING SETTINGS */}
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>
          <MdStar className="inline-block mr-2" /> Scoring
        </CardTitle>
        <CardDescription>
          Scoring settings for your lists.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap gap-5 justify-around mb-5">
          <div className="flex flex-col mb-3">
            <div className="text-lg">
              Score System
            </div>
            <div className="text-muted-foreground">
              {scoreSystemNames[settings.scoreSystem]}
            </div>
          </div>
          <div className="flex flex-col mb-3">
            <div className="text-lg">
              Advanced Scoring
            </div>
            <div className="text-muted-foreground">
              {settings.advancedScoring ? "Enabled" : "Disabled"}
            </div>
          </div>
          {
            settings.advancedScoring &&
            <div className="flex flex-col mb-3">
              <div className="text-lg">
                Advanced Scoring Categories
              </div>
              <div className="text-muted-foreground">
                {settings.advCategories.join(", ")}
              </div>
            </div>
          }
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            variant="secondary"
            onClick={fetchScoringSettings}
            disabled={loadingStates.scoring}
          >
            {loadingStates.scoring ? "Loading..." : "Fetch from AniList"}
          </Button>

          <div>
            Last fetched: {new Date(settings.lastFetched || new Date()).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* LIST SETTINGS */}
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>
          <MdList className="inline-block mr-2" /> List
        </CardTitle>
        <CardDescription>
          List settings for your lists. This includes which lists to fetch from AniList.
        </CardDescription>
      </CardHeader>
      <CardContent>

        <div className="flex flex-row flex-wrap justify-evenly gap-5">
          <div>
            <div className="text-center text-xl font-bold">Anime List</div>
            <div className="flex flex-row gap-5 text-center justify-center mb-5">
              <div className="flex flex-col mb-3">
                <div className="text-lg">
                  List Items
                </div>
                <div className="text-muted-foreground">
                  {lists.entries.anime.length}
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <div className="text-lg">
                  Avg. Score
                </div>
                <div className="text-muted-foreground">
                  {
                    (lists.entries.anime
                      .map((entry) => entry.score)
                      .reduce((a, b) => a + b, 0)
                      / (lists.entries.anime.filter((entry) => entry.score !== 0)).length
                    ).toFixed(2)
                  }
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-center text-xl font-bold">Manga List</div>
            <div className="flex flex-row gap-10 text-center justify-center mb-5">
              <div className="flex flex-col mb-3">
                <div className="text-lg">
                  List Items
                </div>
                <div className="text-muted-foreground">
                  {lists.entries.manga.length}
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <div className="text-lg">
                  Avg. Score
                </div>
                <div className="text-muted-foreground">
                  {
                    (lists.entries.manga
                      .map((entry) => entry.score)
                      .reduce((a, b) => a + b, 0)
                      / (lists.entries.manga.filter((entry) => entry.score !== 0)).length
                    ).toFixed(2)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-5 justify-around mb-5">
          <div className="flex flex-col mb-3">
            <div className="text-lg">
              Completed
            </div>
            <div className="text-muted-foreground flex items-center">
              <Checkbox
                id="completedLists"
                checked={settings.enabledLists.completed}
                onCheckedChange={(e) => {
                  settingsStore.enabledCompletedList = e.valueOf() as boolean;
                }}
              />
              <label htmlFor="completedLists" className="ml-2">
                {settings.enabledLists.completed ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
          <div className="flex flex-col mb-3">
            <div className="text-lg">
              Watching / Reading
            </div>
            <div className="text-muted-foreground flex items-center">
              <Checkbox
                id="currentLists"
                checked={settings.enabledLists.current}
                onCheckedChange={(e) => {
                  settingsStore.enabledCurrentList = e.valueOf() as boolean;
                }}
              />
              <label htmlFor="currentLists" className="ml-2">
                {settings.enabledLists.current ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
          <div className="flex flex-col mb-3">
            <div className="text-lg">
              Planning
            </div>
            <div className="text-muted-foreground flex items-center">
              <Checkbox
                id="planningLists"
                checked={settings.enabledLists.planning}
                onCheckedChange={(e) => {
                  settingsStore.enabledPlanningList = e.valueOf() as boolean;
                }}
              />
              <label htmlFor="planningLists" className="ml-2">
                {settings.enabledLists.planning ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
          <div className="flex flex-col mb-3">
            <div className="text-lg">
              Paused
            </div>
            <div className="text-muted-foreground flex items-center">
              <Checkbox
                id="pausedLists"
                checked={settings.enabledLists.paused}
                onCheckedChange={(e) => {
                  settingsStore.enabledPausedList = e.valueOf() as boolean;
                }}
              />
              <label htmlFor="pausedLists" className="ml-2">
                {settings.enabledLists.paused ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
          <div className="flex flex-col mb-3">
            <div className="text-lg">
              Dropped
            </div>
            <div className="text-muted-foreground flex items-center">
              <Checkbox
                id="droppedLists"
                checked={settings.enabledLists.dropped}
                onCheckedChange={(e) => {
                  settingsStore.enabledDroppedList = e.valueOf() as boolean;
                }}
              />
              <label htmlFor="droppedLists" className="ml-2">
                {settings.enabledLists.dropped ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            variant="secondary"
            onClick={fetchListSettings}
            disabled={loadingStates.list}
          >
            {loadingStates.list ? "Loading..." : "Fetch from AniList"}
          </Button>

          <div>
            Last fetched: {new Date(lists.lastFetched || new Date()).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* OTHER */}
    <Card>
      <CardHeader>
        <CardTitle>
          <MdQuestionMark className="inline-block mr-2" /> More settings may be coming soon!
        </CardTitle>
        <CardDescription>
          Be sure to suggest any features you'd like to see on the GitHub repo!
        </CardDescription>
      </CardHeader>
    </Card>
  </section>;
}

export default SettingsPage;
