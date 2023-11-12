import { Button, Image, Link as NLink } from "@nextui-org/react";
import { Link } from "react-router-dom";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { ListboxWrapper } from "../components/ListboxWrapper";
import { checkLogin } from "../util/checkLogin";
import { UserStore, userStore } from "../util/store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EmptyImage = ({ user = userStore }: { user?: UserStore }) => {
  return <div className="h-[200px] w-[140px] bg-transparent"></div>;
};

const HomePage = () => {
  const userData = userStore.useState();
  console.log(userStore.checkLogin());

  return (
    <>
      <section className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full">
        <section className="h-[100vh] flex-row items-center gap-5 hidden lg:flex">
          <div className="flex flex-col min-w-[35%]">
            <div className="text-4xl font-bold tracking-tight">
              Welcome to <span className="text-blue-500">AniList Rescorer</span>
              .
            </div>
            <div className="text-xl tracking-tight">
              A tool to help you rescore your anime list in the blink of an eye.
            </div>
            <div className="tracking-tight mt-5">
              {checkLogin(userData) ? (
                <Button
                  color="primary"
                  variant="flat"
                  to="/dashboard"
                  as={Link}
                >
                  Dashboard
                </Button>
              ) : (
                <Button color="primary" variant="flat" to="/login" as={Link}>
                  Login
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:ml-20 -ml-[3.75rem]">
            <div className="flex flex-row gap-5">
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Image
                    alt="Image of Madoka Magica Rebellion"
                    src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx11981-aiVnvftA1xPC.jpg"
                    height={200}
                    width={140}
                    radius="lg"
                    className="object-cover animate-[levitate_13s_ease_infinite_1s_reverse] relative top-[100px] left-[50px] lg:left-0 z-1"
                  />
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content asChild>
                    <ListboxWrapper>
                      <div className="w-full px-2 py-1 text-small text-default-500">
                        Actions
                      </div>
                      <div className="w-full">
                        <NLink
                          href="https://anilist.co/anime/11981/"
                          color="foreground"
                          className="hover:bg-primary w-full px-2 py-1 rounded-small"
                          isExternal
                          showAnchorIcon
                        >
                          View on AniList
                        </NLink>
                      </div>
                    </ListboxWrapper>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>

              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Image
                    alt="Image of K-ON!"
                    src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5680-Xh6B67KuZ2PU.png"
                    height={200}
                    width={140}
                    radius="lg"
                    className="object-cover animate-[levitate_15s_ease_infinite]"
                  />
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content asChild>
                    <ListboxWrapper>
                      <div className="w-full px-2 py-1 text-small text-default-500">
                        Actions
                      </div>
                      <div className="w-full">
                        <NLink
                          href="https://anilist.co/anime/5680/"
                          color="foreground"
                          className="hover:bg-primary w-full px-2 py-1 rounded-small"
                          isExternal
                          showAnchorIcon
                        >
                          View on AniList
                        </NLink>
                      </div>
                    </ListboxWrapper>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </div>
            <div className="flex flex-row gap-5">
              <EmptyImage />
              <EmptyImage />
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Image
                    alt="Image of BNA"
                    src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx110354-JJKR42frJABe.jpg"
                    height={200}
                    width={140}
                    radius="lg"
                    className="object-cover animate-[levitate_14s_ease_infinite_1.5s_reverse] relative bottom-[50px]"
                  />
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content asChild>
                    <ListboxWrapper>
                      <div className="w-full px-2 py-1 text-small text-default-500">
                        Actions
                      </div>
                      <div className="w-full">
                        <NLink
                          href="https://anilist.co/anime/110354/"
                          color="foreground"
                          className="hover:bg-primary w-full px-2 py-1 rounded-small"
                          isExternal
                          showAnchorIcon
                        >
                          View on AniList
                        </NLink>
                      </div>
                    </ListboxWrapper>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </div>
          </div>
        </section>
        <section className="h-[100vh] flex-row items-center gap-5 flex lg:hidden">
          <div className="flex flex-col min-w-[35%] z-10">
            <div className="text-4xl font-bold tracking-tight flex flex-col items-center drop-shadow-[0px_0px_10px_rgba(0,0,0,0.25)]">
              <div>Welcome to</div>
              <div className="text-blue-500">AniList Rescorer</div>
            </div>
            <div className="text-lg tracking-tight text-center mt-3 drop-shadow-[0px_0px_10px_rgba(0,0,0,0.25)]">
              A tool to help you rescore your anime list in the blink of an eye.
            </div>
            <div className="tracking-tight mt-5 text-center">
              {userStore.checkLogin() ? (
                <Button
                  color="primary"
                  variant="flat"
                  to="/dashboard"
                  as={Link}
                >
                  Dashboard
                </Button>
              ) : (
                <Button color="primary" variant="flat" to="/login" as={Link}>
                  Login
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:ml-20 -ml-[3.75rem] absolute z-[-1] brightness-50 opacity-50 drop-shadow-[0px_5px_10px_rgba(0,0,0,0.25)]">
            <div className="flex flex-row gap-5">
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Image
                    alt="Image of Madoka Magica Rebellion"
                    src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx11981-aiVnvftA1xPC.jpg"
                    height={200}
                    width={140}
                    radius="lg"
                    className="object-cover animate-[levitate_13s_ease_infinite_1s_reverse] relative top-[100px] left-[50px] lg:left-0 z-1"
                  />
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content asChild>
                    <ListboxWrapper>
                      <div className="w-full px-2 py-1 text-small text-default-500">
                        Actions
                      </div>
                      <div className="w-full">
                        <NLink
                          href="https://anilist.co/anime/11981/"
                          color="foreground"
                          className="hover:bg-primary w-full px-2 py-1 rounded-small"
                          isExternal
                          showAnchorIcon
                        >
                          View on AniList
                        </NLink>
                      </div>
                    </ListboxWrapper>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>

              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Image
                    alt="Image of K-ON!"
                    src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5680-Xh6B67KuZ2PU.png"
                    height={200}
                    width={140}
                    radius="lg"
                    className="object-cover animate-[levitate_15s_ease_infinite]"
                  />
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content asChild>
                    <ListboxWrapper>
                      <div className="w-full px-2 py-1 text-small text-default-500">
                        Actions
                      </div>
                      <div className="w-full">
                        <NLink
                          href="https://anilist.co/anime/5680/"
                          color="foreground"
                          className="hover:bg-primary w-full px-2 py-1 rounded-small"
                          isExternal
                          showAnchorIcon
                        >
                          View on AniList
                        </NLink>
                      </div>
                    </ListboxWrapper>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </div>
            <div className="flex flex-row gap-5">
              <EmptyImage />
              <EmptyImage />
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <Image
                    alt="Image of BNA"
                    src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx110354-JJKR42frJABe.jpg"
                    height={200}
                    width={140}
                    radius="lg"
                    className="object-cover animate-[levitate_14s_ease_infinite_1.5s_reverse] relative bottom-[50px]"
                  />
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content asChild>
                    <ListboxWrapper>
                      <div className="w-full px-2 py-1 text-small text-default-500">
                        Actions
                      </div>
                      <div className="w-full">
                        <NLink
                          href="https://anilist.co/anime/110354/"
                          color="foreground"
                          className="hover:bg-primary w-full px-2 py-1 rounded-small"
                          isExternal
                          showAnchorIcon
                        >
                          View on AniList
                        </NLink>
                      </div>
                    </ListboxWrapper>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default HomePage;
