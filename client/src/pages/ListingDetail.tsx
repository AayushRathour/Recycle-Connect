import { useListing } from "@/hooks/use-listings";
import { useCreateInquiry } from "@/hooks/use-inquiries";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, MapPin, Calendar, Check, Send } from "lucide-react";
import Map from "@/components/Map";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ListingDetail() {
  const [, params] = useRoute("/listings/:id");
  const id = parseInt(params?.id || "0");
  const { data: listing, isLoading } = useListing(id);
  const { user } = useAuth();
  const inquiryMutation = useCreateInquiry();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary h-12 w-12" /></div>;
  if (!listing) return <div className="container py-20 text-center">Listing not found</div>;

  const location = listing.location as { lat: number; lng: number; address: string };

  const handleContact = () => {
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to contact sellers.", variant: "destructive" });
      return;
    }
    
    inquiryMutation.mutate({
      listingId: listing.id,
      sellerId: listing.sellerId,
      buyerId: user.id,
      message
    }, {
      onSuccess: () => {
        toast({ title: "Inquiry Sent!", description: "The seller has been notified." });
        setMessage("");
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image & Map Column */}
        <div className="space-y-8">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-border/50 h-[400px] relative bg-muted">
            {listing.images?.[0] ? (
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">No Image</div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
              {listing.category}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Location</h3>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              {location.address}
            </div>
            <Map 
              center={[location.lat, location.lng]} 
              markers={[{ id: 1, lat: location.lat, lng: location.lng, title: listing.title }]}
              className="h-64 w-full rounded-2xl"
            />
          </div>
        </div>

        {/* Details Column */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">{listing.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                {Number(listing.quantity)} {listing.unit}
              </span>
              <span className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                ${Number(listing.price)} total
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Posted {new Date(listing.createdAt || "").toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <h3 className="text-lg font-bold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Contact Seller</h3>
            {user?.id === listing.sellerId ? (
              <div className="p-4 bg-secondary/50 rounded-xl text-center text-muted-foreground">
                This is your listing.
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  placeholder="Hi, I'm interested in this material. Is it still available?" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleContact} 
                  className="w-full"
                  disabled={inquiryMutation.isPending || !message}
                >
                  {inquiryMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                  Send Inquiry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
