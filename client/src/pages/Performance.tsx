import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMetrics } from "@/hooks/use-metrics";
import { Activity, DollarSign, Package, ShoppingCart, Users, TrendingUp, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function Performance() {
  const { data: metrics, isLoading } = useMetrics();
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0 });
  const startTime = useState(() => new Date())[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setUptime({ days, hours, minutes });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const metricsCards = [
    {
      title: "Total Users",
      value: metrics?.totalUsers || 0,
      icon: Users,
      description: `${metrics?.totalBuyers || 0} Buyers, ${metrics?.totalSellers || 0} Sellers`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Listings",
      value: metrics?.totalListings || 0,
      icon: Package,
      description: "Active listings in marketplace",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Successful Purchases",
      value: metrics?.successfulPurchases || 0,
      icon: ShoppingCart,
      description: "Completed transactions",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Requests",
      value: metrics?.pendingPurchases || 0,
      icon: Clock,
      description: "Awaiting seller response",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Revenue",
      value: `₹${(metrics?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      description: "From successful purchases",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Success Rate",
      value: metrics?.successfulPurchases && metrics?.successfulPurchases + metrics?.pendingPurchases > 0
        ? `${Math.round((metrics.successfulPurchases / (metrics.successfulPurchases + metrics.pendingPurchases)) * 100)}%`
        : "0%",
      icon: TrendingUp,
      description: "Purchase acceptance rate",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Avg. Transaction",
      value: metrics?.successfulPurchases && metrics.successfulPurchases > 0
        ? `₹${Math.round((metrics.totalRevenue || 0) / metrics.successfulPurchases).toLocaleString()}`
        : "₹0",
      icon: Activity,
      description: "Average purchase value",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Session Uptime",
      value: uptime.days > 0 ? `${uptime.days}d ${uptime.hours}h` : `${uptime.hours}h ${uptime.minutes}m`,
      icon: Clock,
      description: "Current session duration",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Performance Metrics</h1>
        <p className="text-muted-foreground">
          System-wide statistics and performance indicators
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <CardDescription className="text-xs">
                  {metric.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Buyer Activity</span>
              <span className="font-semibold">
                {metrics?.totalBuyers || 0} active buyers
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Seller Activity</span>
              <span className="font-semibold">
                {metrics?.totalSellers || 0} active sellers
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Listings per Seller</span>
              <span className="font-semibold">
                {metrics?.totalSellers && metrics.totalSellers > 0
                  ? ((metrics.totalListings || 0) / metrics.totalSellers).toFixed(1)
                  : "0"}{" "}
                avg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Purchase Conversion</span>
              <span className="font-semibold">
                {metrics?.totalListings && metrics.totalListings > 0
                  ? (((metrics.successfulPurchases || 0) / metrics.totalListings) * 100).toFixed(1)
                  : "0"}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Platform statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Platform Status</span>
              <span className="font-semibold text-green-600">● Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Session Uptime</span>
              <span className="font-semibold">
                {uptime.days > 0 && `${uptime.days}d `}
                {uptime.hours}h {uptime.minutes}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Data Refresh Rate</span>
              <span className="font-semibold">30 seconds</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="font-semibold">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
