import { Badge } from "@/components/ui/badge";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MdSettings, MdLogout, MdScoreboard } from "react-icons/md";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";
import { userStore, settingsStore, listStore } from "@/util/state";
import { toast } from "sonner";

import "./Navbar.css";
import {
  defaultListData,
  defaultSettings,
  defaultViewerData,
} from "@/types/UserData";
import { cva } from "class-variance-authority";
import { ThemeToggle } from "./ThemeToggle";

function Navbar() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);

  const routes = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "/settings",
      name: "Settings",
      loginRequired: true,
    },
    {
      path: "/list/anime",
      name: "Anime List",
      loginRequired: true,
    },
    {
      path: "/list/manga",
      name: "Manga List",
      loginRequired: true,
    },
  ];

  const customNavMenuStyle = cva(
    "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
  );

  return (
    <div className="navbar sticky top-0 z-50 bg-background/50 backdrop-blur-lg p-4 border-b border-accent flex items-center">
      <div className="navbar-logo">
        AniList Rescorer
        <Badge className="ml-2">v1.0.0</Badge>
      </div>
      <div className="navbar-links ml-auto">
        {/* Auto routes */}
        <NavigationMenu>
          <NavigationMenuList>
            {routes.map((route) => {
              if (route.loginRequired && !userStore.checkLogin()) return <></>;
              return (
                <NavigationMenuItem key={route.path}>
                  <NavigationMenuLink
                    asChild
                    className={
                      customNavMenuStyle() +
                      " data-[open=true]:bg-accent/50 bg-accent/0"
                    }
                  >
                    <NavLink to={route.path}>{route.name}</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}

            {/* Contact */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={
                  customNavMenuStyle() +
                  " aria-[current]:bg-accent/50 bg-accent/0"
                }
              >
                Contact
              </NavigationMenuTrigger>
              <NavigationMenuContent className="">
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="https://haiiro.moe"
                        target="_blank"
                      >
                        <div
                          className="h-10 w-10 dark:invert-0 invert"
                          style={{
                            backgroundImage: "url('/haiiro.png')",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "150%",
                          }}
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          haiiro
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          A small blog for a decent sized person.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem
                    href="https://github.com/Kex1016"
                    target="_blank"
                    title="Github"
                  >
                    Code that by no means is tidy.
                  </ListItem>
                  <ListItem
                    href="https://anilist.co/cakes"
                    target="_blank"
                    title="AniList"
                  >
                    Where degeneracy happens.
                  </ListItem>
                  <ListItem
                    href="https://discord.com/users/147709526357966848"
                    target="_blank"
                    title="Discord"
                  >
                    Of course I have a Discord.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Login */}
            {userStore.checkLogin() ? (
              <></>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={customNavMenuStyle()}>
                  <Link to="/login">Login</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Avatar */}
      {userStore.checkLogin() && (
        <div className="avatar">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer ml-3 mr-3 transition-transform ease-in-out duration-75">
                <AvatarImage
                  src={userStore.avatar.medium}
                  alt={`${userStore.name}'s avatar`}
                />
                <AvatarFallback>{userStore.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <NavLink to="/settings">
                    <MdSettings className="mr-2 h-full" />
                    Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MdScoreboard className="mr-2 h-full" />
                  Score your list
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                  <MdLogout className="mr-2 h-full" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="theme-toggle">
        <ThemeToggle />
      </div>

      {/* Logout dialog */}
      <AlertDialog open={logoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-accent text-accent-foreground"
              onClick={() => {
                setLogoutDialogOpen(false);
                userStore.setData(defaultViewerData);
                settingsStore.setData(defaultSettings);
                listStore.setData(defaultListData);
                toast("Success!", {
                  description: "You have been logged out.",
                });
              }}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
