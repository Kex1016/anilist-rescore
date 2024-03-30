import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {Link, Navigate} from "react-router-dom";

import { userStore } from "@/util/state";
import "./Home.css";
import {rootUrl} from "@/main.tsx";

function HomePage() {
  // const store = userStore.useState();
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const tokenType = params.get("token_type");
  const expiresIn = params.get("expires_in");
  
  // Redirect to AniList login if all three are present
  if (accessToken && tokenType && expiresIn) {
    return (
      <Navigate to={`${rootUrl}/login${window.location.hash}`} />
    );
  }
  

  return (
    <section className="min-h-[calc(100vh-6rem)] flex items-center gap-10">
      <div className="column">
        <h1 className="text-4xl lg:text-9xl font-bold">
          <div>
            Ani
            <span className="text-primary">List</span>
          </div>
          <div>
            Rescorer
          </div>
        </h1>
        <p className="text-5xl lg:text-3xl mt-4">
          A tool to quickly rescore your AniList entries.
        </p>

        <div className="mt-5">
          {userStore.checkLogin() ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button>Get Started</Button>
              </DrawerTrigger>
              <DrawerContent className="max-w-[1100px] w-full mx-auto">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-3xl">
                    Where are you going?
                  </DrawerTitle>
                  <DrawerDescription className="text-center text-xl">
                    Select one of your lists to get started.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button className="container" asChild>
                    <Link to="./list/anime">Anime</Link>
                  </Button>
                  <Button className="container" asChild>
                    <Link to="./list/manga">Manga</Link>
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button asChild>
              <a href="./login">Login with AniList</a>
            </Button>
          )}
        </div>
      </div>

      <div className="column floating-images min-h-[500px] hidden lg:block">
        <img src={`${rootUrl}/home/k-on.png`} alt="K-ON" />
        <img src={`${rootUrl}/home/lovelive.jpg`} alt="Love Live!" />
        <img src={`${rootUrl}/home/elaina.jpg`} alt="Majo no Tabitabi" />
        <img src={`${rootUrl}/home/madoka.jpg`} alt="Mahou Shoujo Madoka Magica" />
      </div>
    </section>
  );
}

export default HomePage;
