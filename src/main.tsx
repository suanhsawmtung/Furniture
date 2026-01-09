import { AppQueryClientProvider } from "@/providers/app-query-client-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import "./index.css";
import { router } from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppQueryClientProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </AppQueryClientProvider>
  </StrictMode>,
);
