import {
  Avatar,
  Button,
  Chip,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
} from "@nextui-org/react";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { defaultUserData, defaultViewerData } from "../types/UserData";
import { MdLogout, MdDashboard, MdList } from "react-icons/md";
import { checkLogin } from "../util/checkLogin";
import { UserStore, userStore } from "../util/store";

const NavComp = ({ user = userStore }: { user?: UserStore }) => {
  const navigate = useNavigate();
  const currentUrl = new URL(window.location.href);
  const [active, setActive] = useState(currentUrl.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userData = user.useState();

  const routes = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "/about",
      name: "About",
    },
    {
      path: "/dashboard",
      name: "Dashboard",
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

  return (
    <>
      <Navbar
        position="static"
        isBordered
        classNames={{
          wrapper: "lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full",
          base: "fixed top-0 left-0",
        }}
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      >
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarBrand className="w-fit flex-grow-0 text-2xl font-bold">
          <span className="mr-3">AniList Rescore</span>
          <Chip variant="faded" size="sm" className="text-xs">
            v1.0
          </Chip>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4">
          {routes.map((route) => {
            if (route.loginRequired && !checkLogin(userData)) {
              return null;
            }

            return (
              <NavbarItem isActive={active === "/"} key={route.name}>
                <NavLink
                  to={`${route.path}`}
                  className={({ isActive }) => {
                    const def = "transition-colors duration-200 font-semibold";

                    return `text-sm ${
                      isActive
                        ? "text-primary-500 hover:text-primary-400 " + def
                        : "text-default-900 hover:text-primary-700 " + def
                    }`;
                  }}
                  onClick={() => setActive(`${route.path}` as string)}
                >
                  {route.name}
                </NavLink>
              </NavbarItem>
            );
          })}
        </NavbarContent>
        <NavbarMenu>
          {routes.map((route) => {
            if (route.loginRequired && !checkLogin(userData)) {
              return null;
            }

            return (
              <NavbarMenuItem key={route.name}>
                <NavLink
                  to={`${route.path}`}
                  className={({ isActive }) => {
                    const def = "transition-colors duration-200 text-xl";

                    return `text-sm ${
                      isActive
                        ? "text-primary-500 hover:text-primary-400 " + def
                        : "text-default-900 hover:text-primary-700 " + def
                    }`;
                  }}
                  onClick={() => {
                    setActive(`${route.path}` as string);
                    setIsMenuOpen(false);
                  }}
                >
                  {route.name}
                </NavLink>
              </NavbarMenuItem>
            );
          })}
          {checkLogin(userData) && (
            <NavbarMenuItem className="text-danger text-xl cursor-pointer">
              <div
                onClick={() => {
                  user.setData(defaultViewerData);
                  localStorage.setItem("data", JSON.stringify(defaultUserData));
                  window.location.reload();
                }}
              >
                Logout
              </div>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
        <NavbarContent justify="end">
          {checkLogin(userData) ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar isBordered radius="md" src={userData.avatar.medium} />
              </DropdownTrigger>
              <DropdownMenu variant="faded" aria-label="User dropdown">
                <DropdownSection title="Rescorer">
                  <DropdownItem
                    description="Go to your dashboard"
                    startContent={
                      <div className="text-lg">
                        <MdDashboard />
                      </div>
                    }
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                  >
                    Dashboard
                  </DropdownItem>
                  <DropdownItem
                    description="View your anime/manga list"
                    startContent={
                      <div className="text-lg">
                        <MdList />
                      </div>
                    }
                    onClick={() => {
                      navigate("/list");
                    }}
                  >
                    Your lists
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Account">
                  <DropdownItem
                    description="Log out of AL Rescorer"
                    startContent={
                      <div className="text-lg text-foreground">
                        <MdLogout />
                      </div>
                    }
                    onClick={() => {
                      user.setData(defaultViewerData);
                      localStorage.setItem(
                        "data",
                        JSON.stringify(defaultUserData)
                      );
                      window.location.reload();
                    }}
                    classNames={{
                      title: "text-danger",
                    }}
                  >
                    Logout
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button color="primary" variant="flat" to="/login" as={NavLink}>
              Login
            </Button>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default NavComp;
