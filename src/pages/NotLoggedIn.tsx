import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function NotLoggedInPage() {
  return (
    <section className="min-h-[calc(100vh-6rem)] flex flex-col justify-center items-start gap-5">
      <h1 className="text-4xl font-bold text-foreground">
        You are not logged in
      </h1>
      <p className="text-lg text-muted-foreground">
        Please log in to view this page
      </p>
      <Button asChild>
        <NavLink to="/login">Log in</NavLink>
      </Button>
    </section>
  );
}

export default NotLoggedInPage;
