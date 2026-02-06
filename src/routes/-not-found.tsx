import { Route as rootRoute } from "./__root";
import { Link, NotFoundRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Border } from "@/components/border";

export const Route = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component:      NotFound,
});

function NotFound() {
  return (
    <Border>
      <div className="text-center my-auto">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </Border>
  );
}
