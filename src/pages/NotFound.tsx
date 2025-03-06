
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! We couldn't find the page you're looking for.</p>
        <p className="text-muted-foreground mb-8">
          The page you requested doesn't exist or might have been moved.
        </p>
        <Button asChild className="mb-4">
          <Link to={user ? "/" : "/auth/signin"}>
            Return to {user ? "Dashboard" : "Sign In"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
