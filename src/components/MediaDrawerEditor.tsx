import { DrawerDescription, DrawerFooter, DrawerHeader } from "./ui/drawer";
import { Button } from "./ui/button";
import { listStore, settingsStore } from "@/util/state";
import { MediaDrawerProps } from "./MediaDrawer";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { SaveScore } from "@/util/aniList";
import { toast } from "sonner";

// Extend the MediaDrawerProps interface
export interface MediaDrawerEditorProps extends MediaDrawerProps {
  onClose: () => void;
}

export function MediaDrawerEditor({ entry, onClose }: MediaDrawerEditorProps) {
  const userSettings = settingsStore.useState();

  const [newScore, setNewScore] = useState(entry.score);
  const [newAdvScores, setNewAdvScores] = useState(entry.advancedScores);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Focus on the first score input
    const firstScoreInput = document.querySelector(
      ".score-input"
    ) as HTMLInputElement;
    firstScoreInput.focus();

    // Select the text
    firstScoreInput.select();

    // Catch the enter key
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log("enter");
      }
    };

    document.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, []);

  return (
    <>
      <DrawerHeader>
        <DrawerDescription className="text-center text-xl" asChild>
          <div className="flex flex-row gap-5">
            <div
              className="aspect-card bg-center bg-cover bg-no-repeat h-56 rounded-lg"
              style={{
                backgroundImage: `url(${entry.media.coverImage.extraLarge})`,
              }}
            />
            <div className="flex flex-col text-left justify-center">
              <div className="font-bold text-3xl">
                {entry.media.title.userPreferred}
              </div>
              <div className="italic">{entry.media.genres.join(", ")}</div>
              <div className="italic">
                {entry.media.format} {entry.media.startDate.year}
              </div>
              <div className="flex flex-row gap-5 items-center mt-3">
                {userSettings.advancedScoring ? (
                  userSettings.advCategories.map((category) => {
                    return (
                      <div className="flex flex-col items-center gap-1">
                        <div className="font-bold">{category}</div>
                        <Input
                          type="number"
                          className="w-16 score-input"
                          min={0}
                          max={100}
                          id={`score-input-${category}`}
                          value={newAdvScores[category]}
                          onChange={(e) => {
                            setNewAdvScores({
                              ...newAdvScores,
                              [category]: parseInt(e.target.value),
                            });
                            // get the index of the entry
                            const entryIndex =
                              listStore.animeList.indexOf(entry);
                            // update the entry
                            listStore.animeList = [
                              ...listStore.animeList.slice(0, entryIndex),
                              {
                                ...listStore.animeList[entryIndex],
                                advancedScores: {
                                  ...listStore.animeList[entryIndex]
                                    .advancedScores,
                                  [category]: parseInt(e.target.value),
                                },
                              },
                              ...listStore.animeList.slice(entryIndex + 1),
                            ];
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <Input
                    type="number"
                    className="w-16 score-input"
                    min={0}
                    max={100}
                    value={newScore}
                    onChange={(e) => {
                      setNewScore(parseInt(e.target.value));
                    }}
                  />
                )}
                <div className="flex flex-row">
                  <div>New score:</div>
                  <div className="ml-2">
                    {userSettings.advancedScoring
                      ? // HACK: This is some voodoo to check if the average is NaN or not
                        (
                          Object.values(newAdvScores).reduce(
                            (a, b) => a + b,
                            0
                          ) /
                          Object.values(newAdvScores).filter((score) => {
                            return score !== 0;
                          }).length
                        ).toFixed(1) !== "NaN" // If the average is NaN, then the user hasn't set any scores
                        ? (
                            Object.values(newAdvScores).reduce(
                              (a, b) => a + b,
                              0
                            ) /
                            Object.values(newAdvScores).filter((score) => {
                              return score !== 0;
                            }).length
                          ).toFixed(1)
                        : "Unset"
                      : newScore}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter className="flex-row">
        <Button variant="secondary" className="container" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="default"
          className="container"
          disabled={isSaving}
          onClick={async () => {
            setIsSaving(true);

            const resp = await SaveScore(
              entry,
              userSettings.advancedScoring,
              newAdvScores,
              newScore
            );

            if (resp) {
              toast.success("Score saved!");
            } else {
              toast.error("Failed to save score!");
            }

            setIsSaving(false);
          }}
        >
          Save
        </Button>
      </DrawerFooter>
    </>
  );
}
