import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface SystemMetrics {
  totalListings: number;
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  successfulPurchases: number;
  pendingPurchases: number;
  totalRevenue: number;
}

export function useMetrics() {
  const { toast } = useToast();

  return useQuery<SystemMetrics>({
    queryKey: ["metrics"],
    queryFn: async () => {
      const response = await fetch("/api/metrics", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch metrics");
      }

      return response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
