import {useParams} from "react-router-dom";

import "./Editor.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {FC, useEffect, useRef, useState} from "react";
import {listStore, settingsStore} from "@/util/state";
import {Entry, maxScores} from "@/types/UserData";
import {HistoryType} from "../types/UserData";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Link} from "react-router-dom";

import {MdDelete, MdArrowBack, MdArrowForward} from "react-icons/md";
import {isValidForAdvancedScoring, SaveHistory} from "@/util/aniList";
import {rootUrl} from "@/main.tsx";

type EditorPageType = "anime" | "manga";
type EditorPageId = string;

type EditorPageParams = {
  id: EditorPageId | undefined;
  type: EditorPageType | undefined;
};

const StatCard: FC<{ title: string; value: string }> = ({title, value}) => {
  return (
    <div className="bg-background border px-2 py-1 rounded-lg flex flex-col items-center">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-muted-foreground text-base">{value}</p>
    </div>
  );
};

function EditorPage() {
  // TODO: Bulk editor, it has to have a built in history instead of global
  // - edits go through all at once in one api call
  // - can undo/redo from some sidebar

  const {id, type} = useParams<EditorPageParams>();

  const userList = listStore.useState();
  const userSettings = settingsStore.useState();

  function compareEntries(a: Entry, b: Entry) {
    // Compare the scores (advanced or not), if different, return false
    if (userSettings.advancedScoring) {
      for (const key in a.advancedScores) {
        if (a.advancedScores[key] !== b.advancedScores[key]) return false;
      }
    }
    return a.score === b.score;
  }

  const firstRender = useRef(true);
  const lastParam = useRef<EditorPageParams>({
    id: undefined,
    type: undefined,
  });

  const originalEntry = useRef<Entry | undefined>();
  const [entry, setEntry] = useState<Entry | undefined>();
  const [, setHistoryEntry] = useState<HistoryType | undefined>();
  const [error, setError] = useState<string | undefined>();

  // TODO: Replace returns with actual logic.
  useEffect(() => {
    if (!id || !type) {
      setError("Invalid entry");
      return;
    }

    if (firstRender.current) {
      // Get the entry
      const _id = parseInt(id);
      if (isNaN(_id)) {
        setError("Invalid entry id");
        return;
      }

      const entry = userList.entries[type][_id];
      if (!entry) {
        setError("Entry not found");
        return;
      }

      originalEntry.current = entry;
      setEntry(entry);

      firstRender.current = false;
      lastParam.current = {id, type};
      return;
    }

    // If the id or type changes, get the new entry
    if (lastParam.current.id !== id || lastParam.current.type !== type) {
      const _id = parseInt(id);
      if (isNaN(_id)) {
        setError("Invalid entry id");
        return;
      }

      const entry = userList.entries[type][_id];
      if (!entry) {
        setError("Entry not found");
        return;
      }

      originalEntry.current = entry;
      lastParam.current = {id, type};
      setEntry(entry);
    }

    if (lastParam.current.id !== id || lastParam.current.type !== type) {
      lastParam.current = {id, type};
    }
  }, [id, type, userList.entries]);

  if (!id || !type)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] text-3xl font-bold">
        Invalid entry
      </div>
    );

  return (
    <>
      <section className="flex justify-center items-center min-h-[calc(100vh-4rem)] my-5">
        {error && <div className="text-3xl font-bold">{error}</div>}
        {originalEntry.current && entry && (
          <>
            <Card className="w-full md:w-1/2 ml-auto">
              <CardHeader className="flex flex-row items-center gap-3">
                <div>
                  <img
                    src={originalEntry.current.media.coverImage.extraLarge}
                    alt={originalEntry.current.media.title.userPreferred}
                    style={{
                      backgroundColor:
                      originalEntry.current.media.coverImage.color,
                    }}
                    className="w-24 rounded-lg"
                  />
                </div>
                <div>
                  <CardTitle className="text-3xl line-clamp-1">
                    {originalEntry.current.media.title.userPreferred}
                  </CardTitle>
                  <CardDescription className="text-lg flex flex-col">
                    <span className="line-clamp-1">
                      {originalEntry.current.media.title.english} -{" "}
                      {originalEntry.current.media.title.native}
                    </span>
                    <span className="italic text-sm">
                      {originalEntry.current.media.genres.join(", ")}
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div>
                  {
                    // Description
                    originalEntry.current.media.description
                      .split("<br>")
                      .map((line, i) => {
                        if (line.length === 0) return null;
                        if (line.includes("Source:"))
                          return (
                            <p
                              key={i}
                              className="text-sm text-muted-foreground"
                            >
                              {line}
                            </p>
                          );
                        return (
                          <p
                            key={i}
                            className={
                              "text-base mb-2" +
                              (i === 0 ? "" : " line-clamp-2")
                            }
                            dangerouslySetInnerHTML={{__html: line}}
                          />
                        );
                      })
                  }
                </div>
                <div className="flex flex-row gap-3 mx-4 justify-center">
                  {/* Stats */}
                  <StatCard
                    title="Format"
                    value={originalEntry.current.media.format}
                  />
                  <StatCard
                    title="Status"
                    value={originalEntry.current.status}
                  />
                  <StatCard
                    title={
                      type === "anime" ? "Episodes" : "Chapters"
                    }
                    value={
                      type === "anime"
                        ? originalEntry.current.media.episodes!.toString()
                        : originalEntry.current.media.chapters ? originalEntry.current.media.chapters.toString() : "Unknown"
                    }
                  />
                  <StatCard
                    title={
                      userSettings.advancedScoring ? "Average Score" : "Score"
                    }
                    value={originalEntry.current.score.toString()}
                  />
                </div>
                <div>
                  {/* Editor */}
                  <h2 className="text-2xl font-bold mb-2">Edit scores</h2>
                  {
                    // Advanced scores, auto focus on the first input
                    isValidForAdvancedScoring(userSettings) ? (
                      Object.keys(originalEntry.current.advancedScores).map(
                        (key, i) => {
                          return (
                            <div
                              key={key}
                              className="flex flex-row items-center gap-3 mb-2"
                            >
                              <p className="text-lg font-bold">{key}</p>
                              <Input
                                type="number"
                                min={0}
                                max={
                                  maxScores[userSettings.scoreSystem]
                                }
                                // increment by 0.1 if the score system is 10 decimal
                                step={
                                  userSettings.scoreSystem ===
                                  "POINT_10_DECIMAL"
                                    ? 0.1
                                    : 1
                                }
                                value={
                                  entry.advancedScores[key].toString()
                                }
                                onChange={(e) => {
                                  const value =
                                    userSettings.scoreSystem ===
                                    "POINT_10_DECIMAL"
                                      ? parseFloat(e.target.value)
                                      : parseInt(e.target.value);

                                  if (isNaN(value)) return;
                                  if (value < 0) return;
                                  if (
                                    value >
                                    maxScores[userSettings.scoreSystem]
                                  )
                                    return;

                                  setEntry({
                                    ...entry,
                                    advancedScores: {
                                      ...entry.advancedScores,
                                      [key]: value,
                                    },
                                    score: Object.values(
                                      entry.advancedScores
                                    ).reduce((a, b) => a + b),
                                  });
                                }}
                                autoFocus={i === 0}
                              />
                            </div>
                          );
                        }
                      )
                    ) : (
                      <Input
                        type="number"
                        min={0}
                        max={maxScores[userSettings.scoreSystem]}
                        step={
                          userSettings.scoreSystem === "POINT_10_DECIMAL"
                            ? 0.1
                            : 1
                        }
                        value={entry.score}
                        onChange={(e) => {
                          const value =
                            userSettings.scoreSystem === "POINT_10_DECIMAL"
                              ? parseFloat(e.target.value)
                              : parseInt(e.target.value);

                          if (isNaN(value)) return;
                          if (value < 0) return;
                          if (
                            value > maxScores[userSettings.scoreSystem]
                          )
                            return;

                          setEntry({
                            ...entry,
                            score: value,
                          });
                        }}
                        autoFocus
                      />
                    )
                  }
                </div>
              </CardContent>
              <CardFooter className="flex justify-evenly gap-5">
                <div
                  className={
                    "relative transition-all delay-75 " +
                    (userList.entries[type][parseInt(id) - 1] === undefined ? "w-0" : "w-16")
                  }
                >
                  {userList.entries[type][parseInt(id) - 1] && (<>
                    <Button className="text-white w-full" variant="secondary" asChild>
                      <Link to={`${rootUrl}/editor/${type}/${parseInt(id) - 1}`}>
                        <MdArrowBack/>
                      </Link>
                    </Button>
                    {/* The previous entry */}
                    <div
                      className={
                        "media-preview absolute top-0 left-0 transform translate-x-[50%] -translate-y-1/2 " +
                        "bg-card p-2 text-white text-center rounded-lg shadow border " +
                        "flex flex-col gap-3 items-center w-36 opacity-0 transition-opacity pointer-events-none"
                      }
                      style={{zIndex: 100}}
                    >
                      <img
                        src={
                          userList.entries[type][parseInt(id) - 1].media.coverImage
                            .extraLarge
                        }
                        alt={
                          userList.entries[type][parseInt(id) - 1].media.title
                            .userPreferred
                        }
                        style={{
                          backgroundColor:
                          userList.entries[type][parseInt(id) - 1].media
                            .coverImage.color,
                        }}
                        className="w-full rounded-lg"
                      />
                      <p className="text-white text-sm line-clamp-1">
                        {
                          userList.entries[type][parseInt(id) - 1].media.title
                            .userPreferred
                        }
                      </p>
                    </div>
                  </>)}
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!entry) {
                      toast("Entry not found");
                      return;
                    }
                    if (!originalEntry.current) {
                      toast("Original entry not found");
                      return;
                    }
                    if (!type) {
                      toast("Entry type not found");
                      return;
                    }
                    if (!id) {
                      toast("Entry id not found");
                      return;
                    }

                    // Compare the entries
                    if (compareEntries(originalEntry.current, entry)) {
                      // No changes
                      toast("No changes");
                      return;
                    }

                    // Save to history
                    const _id = parseInt(id);
                    if (isNaN(_id)) {
                      toast("Invalid entry id");
                      return;
                    }
                    const history: HistoryType = {
                      entryId: _id,
                      diff: {
                        score: entry.score,
                        advancedScores: entry.advancedScores,
                      },
                      timestamp: Date.now(),
                    };

                    if (isValidForAdvancedScoring(userSettings)) {
                      history.diff.score =
                        Object.values(entry.advancedScores).reduce(
                          (a, b) => a + b
                        ) / Object.values(entry.advancedScores).length;
                    }

                    setHistoryEntry(history);

                    // Test if there's a history for this entry
                    const historyIndex = userList.history[type].findIndex(
                      (h) => h.entryId === _id
                    );

                    if (historyIndex === -1) {
                      listStore.history = {
                        ...listStore.history,
                        [type]: [...listStore.history[type], history],
                      };
                    } else {
                      listStore.history = {
                        ...listStore.history,
                        [type]: [
                          ...listStore.history[type].slice(0, historyIndex),
                          history,
                          ...listStore.history[type].slice(historyIndex + 1),
                        ],
                      };
                    }

                    toast("Saved!");
                  }}
                  asChild
                >
                  {userList.entries[type][parseInt(id) + 1] ? (
                    <Link to={`${rootUrl}/editor/${type}/${parseInt(id) + 1}`}>Save</Link>
                  ) : (
                    <Button>Save</Button>
                  )}
                </Button>
                <div className={
                  "editor-next-container relative transition-all delay-75 " +
                  (userList.entries[type][parseInt(id) + 1] ? "w-16" : "w-0")
                }>
                  {userList.entries[type][parseInt(id) + 1] && (
                    <Button className="w-full" variant="secondary" asChild>
                      <Link to={`${rootUrl}/editor/${type}/${parseInt(id) + 1}`}>
                        <MdArrowForward/>
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </>
        )}

        <div
          className={
            "h-[calc(100vh-8rem)] my-auto ml-auto bg-card " +
            "max-w-[400px] w-full p-5 text-white text-center rounded-xl shadow border " +
            // Grid layout, 3 rows, middle one has a set height and an internal scroll
            "grid gap-5 grid-rows-[auto,1fr,auto]"
          }
        >
          <h1 className={"text-3xl font-bold text-primary"}>History</h1>
          <div className="history-items overflow-y-auto flex flex-col gap-3">
            {
              // History
              userList.history[type].length > 0 ? (
                userList.history[type].map((history, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-row items-center justify-between gap-3 w-full"
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-2 text-left items-end">
                          <p className="line-clamp-1">
                            {
                              userList.entries[type][history.entryId].media
                                .title.userPreferred
                            }
                          </p>
                          <p className="text-muted-foreground text-sm">
                            <span>
                              (
                              {new Date(history.timestamp).toLocaleDateString()}
                              )
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-row gap-2">
                          <div className="font-bold">
                            {isValidForAdvancedScoring(userSettings)
                              ? "Scores:"
                              : "Score:"}
                          </div>
                          <div>
                            {isValidForAdvancedScoring(userSettings)
                              ? Object.values(history.diff.advancedScores).join(
                                ", "
                              ) +
                              " = " +
                              history.diff.score
                              : history.diff.score}
                          </div>
                        </div>
                      </div>
                      <Button
                        className="ml-auto"
                        onClick={() => {
                          // Remove the history
                          listStore.history = {
                            ...listStore.history,
                            [type]: [
                              ...listStore.history[type].slice(0, i),
                              ...listStore.history[type].slice(i + 1),
                            ],
                          };
                        }}
                      >
                        <MdDelete/>
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="my-auto">No history</p>
              )
            }
          </div>
          {userList.history[type].length > 0 && (
            <div
              className={
                "flex flex-row items-center justify-between gap-3 w-full mt-5"
              }
            >
              <Button
                onClick={() => {
                  SaveHistory(userList.history[type], type);
                }}
                className="flex-grow"
              >
                Commit all changes
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default EditorPage;
