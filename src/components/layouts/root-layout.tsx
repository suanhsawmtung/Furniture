import Footer from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="mt-16 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
