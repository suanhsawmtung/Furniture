import Footer from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const clearAuthUser = useAuthStore((s) => s.clearAuthUser);

  useEffect(() => {
    if ((error as any).status === 401) {
      clearAuthUser(); // ✅ side effect
      navigate("/", { replace: true });
    }
  }, [error, clearAuthUser, navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mt-16 flex h-[calc(80vh-4.2rem)] items-center justify-center lg:h-[calc(100vh-4.2rem)]">
        <Card className="w-full max-w-sm">
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="border-muted-foreground/70 mt-2 mb-4 grid size-24 place-items-center rounded-full border border-dashed">
              <TriangleAlert
                className="text-muted-foreground/70 size-10"
                aria-hidden
              />
            </div>
            <CardTitle>Oops!</CardTitle>
            <CardDescription>
              An error occurs accendently. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full cursor-pointer" asChild>
              <Link to="/">Go to the home page </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorPage;
