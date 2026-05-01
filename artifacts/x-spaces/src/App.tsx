import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SpaceDetail from "@/pages/space";
import { WelcomeSplash } from "@/components/welcome-splash";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/space/:id" component={SpaceDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Show splash on every page load (temporary — for testing)
  const [showSplash, setShowSplash] = useState(true);

  // Also re-check on storage changes (e.g. other tabs)
  useEffect(() => {
    const handler = () => {
      if (localStorage.getItem("xcoms_username")) setShowSplash(false);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        {showSplash && <WelcomeSplash onDone={() => setShowSplash(false)} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
