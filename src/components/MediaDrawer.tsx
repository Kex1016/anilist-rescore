import { Entry } from "@/types/UserData";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import MediaCard from "./MediaCard";
import { useState } from "react";
import { MediaDrawerEntry } from "./MediaDrawerEntry";
import { MediaDrawerEditor } from "./MediaDrawerEditor";
import { Navigate } from "react-router-dom";
import { listStore } from "@/util/state";
import { toast } from "sonner";
import {rootUrl} from "@/main.tsx";

export type MediaDrawerProps = {
  entry: Entry;
};

export function MediaDrawer({ entry }: MediaDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [secondIsOpen, setSecondIsOpen] = useState(false);
  const [goToEditor, setGoToEditor] = useState<string | undefined>(undefined);

  const userLists = listStore.useState();

  // Handle the drawers. If the second one is open, then closes, close the first one too
  const handleSecondDrawer = (isOpen: boolean) => {
    setSecondIsOpen(isOpen);
    if (!isOpen) setIsOpen(false);
  };

  return (
    <>
      <Drawer
        open={secondIsOpen}
        dismissible
        onOpenChange={(isOpen) => {
          handleSecondDrawer(isOpen ? true : false);
        }}
      >
        <DrawerContent className="max-w-[1100px] mx-auto">
          <MediaDrawerEditor
            entry={entry}
            onClose={() => {
              handleSecondDrawer(false);
            }}
          />
        </DrawerContent>
      </Drawer>
      <Drawer
        open={isOpen}
        dismissible
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen ? true : false);
        }}
      >
        <DrawerTrigger>
          <MediaCard
            entry={entry}
            onClick={() => {
              setIsOpen(isOpen ? false : true);
            }}
          />
        </DrawerTrigger>
        <DrawerContent className="max-w-[1100px] mx-auto">
          <DrawerHeader>
            <MediaDrawerEntry entry={entry} />
          </DrawerHeader>
          <DrawerFooter className="flex-row">
            <Button
              variant={"secondary"}
              className="container"
              onClick={() => {
                setSecondIsOpen(secondIsOpen ? false : true);
              }}
            >
              Edit this entry
            </Button>
            <Button
              className="container"
              onClick={() => {
                // Get the index and type of the entry
                const type = userLists.choice;
                if (!type) return;
                if (type === "unset") return;

                const index = userLists.entries[type].findIndex(
                  (e) => e.id === entry.id
                );

                if (index === -1) {
                  toast("Entry not found");
                  return;
                }

                setGoToEditor(`${rootUrl}/editor/${type}/${index}`);
              }}
            >
              Start editing from here
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {goToEditor && <Navigate to={goToEditor} />}
    </>
  );
}
