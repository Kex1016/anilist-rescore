import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import NavComp from "./components/Nav";
import { Button, Code } from "@nextui-org/react";
import BackgroundComponent from "./components/Background";

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <>
          <BackgroundComponent />
          <NavComp />
          <section className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full">
            <section className="h-[calc(100vh_-_65px)] flex flex-col items-center justify-center gap-3">
              <div className="text-4xl font-bold tracking-tight">
                Unauthorized
              </div>
              <div className="text-xl tracking-tight">
                You are not authorized to view this page.
              </div>
              <Button as={Link} to="/">
                Go home
              </Button>
            </section>
          </section>
        </>
      );
    }
    if (error.status === 404) {
      return (
        <>
          <BackgroundComponent />
          <NavComp />
          <section className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full">
            <section className="h-[calc(100vh_-_65px)] flex flex-col items-center justify-center gap-3">
              <div className="text-4xl font-bold tracking-tight">Not Found</div>
              <div className="text-xl tracking-tight">
                The page you were looking for does not exist.
              </div>
              <Button as={Link} to="/">
                Go home
              </Button>
            </section>
          </section>
        </>
      );
    } else if (error instanceof Error) {
      return (
        <>
          <BackgroundComponent />
          <NavComp />
          <section className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full">
            <section className="h-[calc(100vh_-_65px)] flex flex-col items-center justify-center gap-3">
              <div className="text-4xl font-bold tracking-tight">Error</div>
              <Code className="text-xl tracking-tight">{error.message}</Code>
              <Button as={Link} to="/">
                Go home
              </Button>
            </section>
          </section>
        </>
      );
    } else {
      return (
        <>
          <BackgroundComponent />
          <NavComp />
          <section className="container lg:max-w-6xl mx-auto px-4 lg:px-0 md:max-w-full">
            <section className="h-[calc(100vh_-_65px)] flex flex-col items-center justify-center gap-3">
              <div className="text-4xl font-bold tracking-tight">Error</div>
              <Code className="text-xl tracking-tight">
                Unknown error occurred. Please try again later.
              </Code>
              <Button as={Link} to="/">
                Go home
              </Button>
            </section>
          </section>
        </>
      );
    }
  }
}
