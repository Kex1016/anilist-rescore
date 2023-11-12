import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Entry, UserData } from "../types/UserData";
import { checkLogin } from "../util/checkLogin";
import { useAsyncList } from "@react-stately/data";
import {
  Button,
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";

type ListType = "anime" | "manga";

const uppercaseFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const pad = (n: number) => {
  return n < 10 ? "0" + n : n;
};

const ListViewPage = () => {
  const params = useParams<{ type: ListType }>();
  const [userData] = useState(
    JSON.parse(localStorage.getItem("data") as string) as UserData
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const list = useAsyncList({
    async load() {
      // Limit the amount of items to 50
      const limit = 50;
      const lists = await getKeyValue(userData.lists.entries, params.type!);
      const entries = lists.slice(0, limit) as Entry[];

      if (entries.length < limit) {
        setHasMore(false);
      }

      return {
        items: entries,
      };
    },
    async sort({ items, sortDescriptor }) {
      // Sort the items
      return {
        items: items.sort((a, b) => {
          setIsLoading(true);
          const first = a[sortDescriptor.column as keyof Entry];
          const second = b[sortDescriptor.column as keyof Entry];
          let cmp =
            (parseInt(first as string) || first) <
            (parseInt(second as string) || second)
              ? -1
              : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          setIsLoading(false);
          return cmp;
        }),
      };
    },
  });

  // FIXME: This gives an empty array.
  const loadMore = async () => {
    if (!hasMore) return;

    const limit = 50;
    const lists = await getKeyValue(userData.lists.entries, params.type!);
    const entries = lists.slice(list.items.length, limit) as Entry[];

    console.log(entries);

    if (entries.length < limit) {
      setHasMore(false);
    }

    for (const entry of entries) {
      list.append(entry);
    }
  };

  // TODO: Right click menu on each entry
  return (
    <>
      {!params.type && <Navigate to="/list/anime" />}
      {!checkLogin(userData.user) && <Navigate to="/login" />}
      <section className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full">
        <section className="h-[100vh] flex flex-row gap-5 pt-16">
          <Table
            isHeaderSticky
            aria-label={`List of ${params.type}`}
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            classNames={{ table: "w-full", base: "my-5" }}
            bottomContent={
              hasMore && !isLoading ? (
                <Button
                  isDisabled={list.isLoading}
                  variant="flat"
                  onPress={loadMore}
                  isLoading={list.isLoading}
                  className="p-5"
                >
                  Load More
                </Button>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn key="cover" allowsSorting={false}>
                Cover
              </TableColumn>
              <TableColumn key="title" allowsSorting>
                Title
              </TableColumn>
              <TableColumn key="start_date">Started At</TableColumn>
              <TableColumn key="finish_date">Finished At</TableColumn>
              <TableColumn key="score" allowsSorting>
                Score(s)
              </TableColumn>
              <TableColumn key="status" allowsSorting>
                Status
              </TableColumn>
            </TableHeader>
            <TableBody
              items={list.items}
              isLoading={isLoading}
              loadingContent={
                <Spinner
                  label="Loading..."
                  className="fixed bg-default-200/25 p-5 rounded-md backdrop-blur-sm"
                />
              }
            >
              {(item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell key={`${item.id}-cover`}>
                      <Image
                        src={item.media.coverImage.medium}
                        alt={item.media.title.romaji}
                        width={50}
                        height={75}
                      />
                    </TableCell>
                    <TableCell key={`${item.id}-title`}>
                      {item.media.title.romaji}
                    </TableCell>
                    <TableCell key={`${item.id}-start_date`}>
                      {item.startedAt.year
                        ? `${pad(item.startedAt.year)}. ${pad(
                            item.startedAt.month
                          )}. ${pad(item.startedAt.day)}.`
                        : "N/A"}
                    </TableCell>
                    <TableCell key={`${item.id}-finish_date`}>
                      {item.completedAt.year
                        ? `${pad(item.completedAt.year)}. ${pad(
                            item.completedAt.month
                          )}. ${pad(item.completedAt.day)}.`
                        : "N/A"}
                    </TableCell>
                    <TableCell key={`${item.id}-score`}>{item.score}</TableCell>
                    <TableCell key={`${item.id}-status`}>
                      {uppercaseFirst(item.status)}
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </section>
      </section>
    </>
  );
};

export default ListViewPage;
