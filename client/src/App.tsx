import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";

import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Browse from "@/pages/Browse";
import ListingDetail from "@/pages/ListingDetail";
import CreateListing from "@/pages/CreateListing";
import IdentifyWaste from "@/pages/IdentifyWaste";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  if (!user) {
    // Redirect to login but render nothing in the meantime
    setTimeout(() => setLocation("/auth"), 0);
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/browse" component={Browse} />
        <Route path="/listings/:id" component={ListingDetail} />
        
        {/* Protected Routes */}
        <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} />
        </Route>
        <Route path="/create-listing">
          <ProtectedRoute component={CreateListing} />
        </Route>
        <Route path="/identify">
          <ProtectedRoute component={IdentifyWaste} />
        </Route>

        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 RecycleConnect. All rights reserved. Building a cleaner world together.
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
