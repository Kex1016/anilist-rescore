import { useParams } from "react-router-dom";
import { listStore, userStore } from "@/util/state";

import "./List.css";
import { useEffect, useRef, useState } from "react";
import { Entry } from "@/types/UserData";
import { MediaDrawer } from "@/components/MediaDrawer";
import { Input } from "@/components/ui/input";
import NotLoggedInPage from "./NotLoggedIn";
import {setupMatomo} from "@/util/matomo.ts";

type ListPageParams = "anime" | "manga";

function ListPage() {
  const params = useParams<{ type: ListPageParams }>();

  const firstRender = useRef(true);
  const lastParam = useRef(params.type);
  const observer = useRef<IntersectionObserver>();
  const [list, setList] = useState<Entry[]>([]);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setupMatomo();
    
    if (!userStore.checkLogin()) return;

    if (firstRender.current) {
      firstRender.current = false;

      if (params.type === "anime" || params.type === "manga") {
        setList(listStore.entries[params.type].slice(0, 60));
      }

      listStore.choice = params.type as ListPageParams;

      return;
    }

    if (lastParam.current !== params.type) {
      lastParam.current = params.type;

      if (params.type === "anime" || params.type === "manga") {
        setList(listStore.entries[params.type].slice(0, 60));
      }

      return;
    }

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Load more entries
        const currentLength = list!.length;
        const remainingLength =
          listStore.entries[params.type || "anime"].length - currentLength;
        const remainingSearchLength =
          listStore.entries[params.type || "anime"].filter((entry) => {
            return entry.media.title.userPreferred
              .toLowerCase()
              .includes(search.toLowerCase());
          }).length - currentLength;

        // If there are no more entries to load, return
        if (remainingLength <= 0) {
          return;
        }

        // If there are no more entries to load, return (search)
        if (isSearching && remainingSearchLength <= 0) {
          return;
        }

        let newList: Entry[] = [];

        if (params.type === "anime" || params.type === "manga") {
          // Test for length
          console.log(remainingLength);

          newList = listStore.entries[params.type];

          if (remainingLength > 60) {
            // if search is not empty, filter the list
            if (search !== "") {
              newList = listStore.entries[params.type].filter((entry) => {
                return entry.media.title.userPreferred
                  .toLowerCase()
                  .includes(search.toLowerCase());
              });
            }
            newList = newList.slice(currentLength, currentLength + 60);
            console.log("60");
          } else {
            // if search is not empty, filter the list
            if (search !== "") {
              newList = listStore.entries[params.type].filter((entry) => {
                return entry.media.title.userPreferred
                  .toLowerCase()
                  .includes(search.toLowerCase());
              });
            }
            newList = newList.slice(
              currentLength,
              currentLength + remainingLength
            );
            console.log("remaining");
          }
        }

        setList([...list!, ...newList]);
        console.log(list);
      }
    });

    if (list.length !== listStore.entries[params.type || "anime"].length) {
      observer.current.observe(document.getElementById("loader")!);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [params.type, list, isSearching, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsSearching(true);
    if (e.target.value === "") {
      setIsSearching(false);
    }

    let filtered: Entry[] = [];
    if (params.type === "anime" || params.type === "manga") {
      filtered = listStore.entries[params.type].filter((entry) => {
        return entry.media.title.userPreferred
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    }

    setList(filtered.slice(0, 60));
  };

  const user = userStore.useState();

  if (!user.token.accessToken) return <NotLoggedInPage />;
  if (params.type !== "anime" && params.type !== "manga") return <div>404</div>;

  return (
    <>
      <section className={"list min-h-[100dvh] " + params.type}>
        <h1 className="container text-2xl font-bold my-5">
          Your {params.type === "anime" ? "Anime" : "Manga"} List
        </h1>
        <div className="search container mb-5">
          <Input
            type="text"
            placeholder="Search..."
            alt="Search"
            className="max-w-[500px] w-full"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="list-container container flex flex-wrap justify-center gap-5 w-fit mb-5">
          {list.map((entry) => {
            return (
              <div
                className="entry-container"
                key={entry.id}
                onClick={() => {}}
              >
                <MediaDrawer entry={entry} />
              </div>
            );
          })}
          <div id="loader" />
        </div>
      </section>
    </>
  );
}

export default ListPage;
