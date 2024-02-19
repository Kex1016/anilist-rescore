import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DrawerDescription } from "./ui/drawer";
import { Button } from "./ui/button";
import { settingsStore } from "@/util/state";
import { MediaDrawerProps } from "./MediaDrawer";

export function MediaDrawerEntry({ entry }: MediaDrawerProps) {
  const userSettings = settingsStore.useState();

  return (
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
          <div className="flex flex-row gap-3 mt-3">
            <div className="flex flex-col items-start gap-1">
              <div className="font-bold">Progress</div>
              <div className="font-bold">Status</div>
              <div className="font-bold">Score</div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div>
                {entry.progress} / {entry.media.episodes}
              </div>
              <div>
                {entry.status.slice(0, 1).toUpperCase() +
                  entry.status.slice(1).toLowerCase()}
              </div>
              {userSettings.advancedScoring ? (
                <Popover>
                  <PopoverTrigger>
                    <Button variant="secondary" className="text-xl">
                      {entry.score}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="text-xl font-bold text-center mb-3">
                      Scores
                    </div>
                    {Object.entries(entry.advancedScores).map(
                      ([key, value]) => {
                        return (
                          <div className="grid grid-cols-2 text-lg" key={key}>
                            <div className="font-bold">{key}:</div>
                            <div>{value !== 0 ? value : "Unset"}</div>
                          </div>
                        );
                      }
                    )}
                  </PopoverContent>
                </Popover>
              ) : (
                <div>{entry.score}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DrawerDescription>
  );
}
