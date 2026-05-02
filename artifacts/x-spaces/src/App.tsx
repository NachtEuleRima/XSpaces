import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SpaceDetail from "@/pages/space";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import { WelcomeSplash } from "@/components/welcome-splash";
import { SupportPopup } from "@/components/support-popup";
import { UsernameProvider } from "@/context/username-context";
import { useUsername } from "@/hooks/use-username";
import { UsernameCapture } from "@/components/username-capture";
import { DonationModal } from "@/components/donation-modal";
import { PostDonationToast } from "@/components/post-donation-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/space/:id" component={SpaceDetail} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

const SPLASH_ROUTES = [/^\/$/, /^\/space\//];

function AppShell() {
  const isSplashRoute = SPLASH_ROUTES.some(r => r.test(
    (window.location.pathname.replace(/\/$/, "").replace(import.meta.env.BASE_URL.replace(/\/$/, ""), "")) || "/"
  ));
  const [showSplash, setShowSplash] = useState(() => {
    if (!isSplashRoute) return false;
    if (new URLSearchParams(window.location.search).get("auth") === "1") return true;
    if (!localStorage.getItem("xcoms_username")) return true;
    if (sessionStorage.getItem("xcoms_session_seen")) return false;
    const lastSeen = parseInt(localStorage.getItem("xcoms_splash_seen") ?? "0", 10);
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - lastSeen > WEEK_MS;
  });
  const [showDonation, setShowDonation] = useState(false);
  const { clearUsername } = useUsername();
  const qc = useQueryClient();

  // Refetch all queries when the tab becomes visible again (mobile background/sleep fix).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        qc.invalidateQueries();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [qc]);

  // Allow any child to re-trigger the splash by dispatching "xcoms:signout"
  // Also immediately clear the username + cached space queries so the page
  // doesn't show stale personalized data while the new user is signing in.
  useEffect(() => {
    const handler = () => {
      clearUsername();
      qc.invalidateQueries();
      setShowSplash(true);
    };
    window.addEventListener("xcoms:signout", handler);
    return () => window.removeEventListener("xcoms:signout", handler);
  }, [clearUsername, qc]);

  useEffect(() => {
    const handler = () => setShowDonation(true);
    window.addEventListener("xcoms:donate", handler);
    return () => window.removeEventListener("xcoms:donate", handler);
  }, []);

  // Hide donate button while welcome splash is visible
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(showSplash ? "xcoms:auth-open" : "xcoms:auth-close"));
  }, [showSplash]);

  return (
    <>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
      {showSplash && <WelcomeSplash onDone={() => {
        localStorage.setItem("xcoms_splash_seen", String(Date.now()));
        sessionStorage.setItem("xcoms_session_seen", "1");
        setShowSplash(false);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 50);
      }} />}
      {!showSplash && isSplashRoute && <UsernameCapture />}
      {showDonation && <DonationModal onClose={() => setShowDonation(false)} />}
      {isSplashRoute && <SupportPopup />}
      {isSplashRoute && <PostDonationToast />}
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
