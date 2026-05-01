import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SpaceDetail from "@/pages/space";
import { WelcomeSplash } from "@/components/welcome-splash";
import { UsernameProvider } from "@/context/username-context";

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

function AppShell() {
  // Show splash on every page load (temporary — for testing)
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
      {showSplash && <WelcomeSplash onDone={() => setShowSplash(false)} />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UsernameProvider>
          <AppShell />
        </UsernameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
