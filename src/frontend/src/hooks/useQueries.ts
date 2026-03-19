import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ItemsOrdered } from "../backend";
import { useActor } from "./useActor";

export function useVisitorCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["visitorCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      await actor.incrementVisitorCount();
      return actor.getVisitorCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      address: string;
      contact: string;
      items: ItemsOrdered[];
      totalAmount: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(
        params.name,
        params.address,
        params.contact,
        params.items,
        params.totalAmount,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
