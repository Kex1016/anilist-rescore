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

import { Link } from "react-router-dom";

import { userStore } from "@/util/state";
import "./Home.css";

function HomePage() {
  // const store = userStore.useState();

  return (
    <section className="min-h-[calc(100vh-6rem)] flex items-center gap-10">
      <div className="column">
        <h1 className="text-4xl font-bold">AL Rescorer</h1>
        <p className="text-lg mt-4">
          A tool to quickly rescore your AniList entries.
        </p>

        <div className="mt-4">
          {userStore.checkLogin() ? (
            <Drawer>
              <DrawerTrigger>
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
                    <Link to="/list/anime">Anime</Link>
                  </Button>
                  <Button className="container" asChild>
                    <Link to="/list/manga">Manga</Link>
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button asChild>
              <a href="/login">Login with AniList</a>
            </Button>
          )}
        </div>
      </div>

      <div className="column floating-images min-h-[500px] hidden lg:block">
        <img src="/home/k-on.png" alt="K-ON" />
        <img src="/home/lovelive.jpg" alt="Love Live!" />
        <img src="/home/elaina.jpg" alt="Majo no Tabitabi" />
        <img src="/home/madoka.jpg" alt="Mahou Shoujo Madoka Magica" />
      </div>
    </section>
  );
}

export default HomePage;
