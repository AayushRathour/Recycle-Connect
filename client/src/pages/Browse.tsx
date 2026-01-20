import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";

export default function Browse() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  
  const { data: listings, isLoading, error } = useListings({ search, category: category || undefined });

  // Mock map data from listings
  const mapMarkers = listings?.map(l => ({
    id: l.id,
    lat: (l.location as any).lat || 51.505 + (Math.random() - 0.5) * 0.1,
    lng: (l.location as any).lng || -0.09 + (Math.random() - 0.5) * 0.1,
    title: l.title
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Browse available materials for recycling</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search plastic, glass, metal..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setCategory("")}>
             <Filter className="h-4 w-4 mr-2" />
             Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              {["Plastic", "Glass", "Metal", "Paper", "Electronics", "Textile"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? "" : cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === cat 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
             <Map markers={mapMarkers} className="h-64 w-full rounded-2xl" />
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/20 text-destructive">
              Error loading listings
            </div>
          ) : listings?.length === 0 ? (
            <div className="text-center py-20 bg-secondary/30 rounded-3xl border-2 border-dashed border-border">
              <h3 className="text-xl font-medium text-foreground">No listings found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
