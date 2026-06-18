import { useQuery } from "@tanstack/react-query";
import { fetchStores, fetchStoreDetails } from "@/services/storeApi";
import { queryKeys } from "@/lib/queryKeys";
import type { EntityId } from "@/types";

/** Cache window for store pages — sellers/listings change rarely. */
const STORE_STALE = 5 * 60 * 1000;

/** All approved stores (sellers) enriched with their book counts. */
export const useStores = () =>
  useQuery({
    queryKey: queryKeys.stores.list,
    queryFn: fetchStores,
    staleTime: STORE_STALE,
  });

/**
 * A single store together with all the books it lists for sale.
 * Disabled until a store id is available.
 */
export const useStoreDetails = (storeId: EntityId | undefined) =>
  useQuery({
    queryKey: queryKeys.stores.detail(storeId ?? ""),
    queryFn: () => fetchStoreDetails(storeId!),
    enabled: storeId != null && String(storeId).length > 0,
    staleTime: STORE_STALE,
  });
