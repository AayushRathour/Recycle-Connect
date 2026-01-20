import { useAuth } from "@/hooks/use-auth";
import { useListings, useDeleteListing } from "@/hooks/use-listings";
import { StatsCard } from "@/components/StatsCard";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Package, TrendingUp, DollarSign, Leaf } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, {user.username}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === "seller" ? "Manage your waste listings and track impact." : "Track your sourcing and recycling impact."}
          </p>
        </div>
        
        {user.role === "seller" && (
          <Link href="/create-listing">
            <Button className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> New Listing
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard 
          title="Total Recycled" 
          value="1,240 kg" 
          icon={<Leaf className="h-6 w-6" />}
          trend="12%"
          trendUp={true}
        />
        <StatsCard 
          title="Active Listings" 
          value="8" 
          icon={<Package className="h-6 w-6" />}
        />
        <StatsCard 
          title="Est. Savings" 
          value="$4,250" 
          icon={<DollarSign className="h-6 w-6" />}
          trend="8%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {user.role === "seller" ? <SellerListings /> : <BuyerActivity />}
        </div>

        {/* Sidebar / Chart */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-full">
            <h3 className="font-bold mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Impact Trends
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Jan', value: 400 },
                  { name: 'Feb', value: 300 },
                  { name: 'Mar', value: 600 },
                  { name: 'Apr', value: 800 },
                  { name: 'May', value: 500 },
                ]}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Monthly waste volume processed (kg)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SellerListings() {
  const { data: listings, isLoading } = useListings();
  const deleteMutation = useDeleteListing();

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border/50">
        <h3 className="font-bold text-lg">My Listings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Item</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-right py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {listings?.map((listing) => (
              <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{listing.title}</div>
                  <div className="text-xs text-muted-foreground">{Number(listing.quantity)} {listing.unit}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {listing.category}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    listing.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-muted-foreground">
                  {listing.createdAt ? format(new Date(listing.createdAt), 'MMM d, yyyy') : '-'}
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if(confirm('Are you sure?')) deleteMutation.mutate(listing.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {listings?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No listings yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
}

function BuyerActivity() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
      <p className="text-muted-foreground">Your recent inquiries and saved items will appear here.</p>
      
      <div className="mt-6 flex justify-center">
        <Link href="/identify">
          <Button variant="secondary">
            Try AI Waste Identification
          </Button>
        </Link>
      </div>
    </div>
  );
}
