import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMarketplaceOrders,
  fetchCustomerOrders,
  fetchCustomerProfile,
  fetchSellerOrders,
  updateCustomerProfile,} from "@/services/customerApi";

import { queryKeys } from "@/lib/queryKeys";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type { CartEntry, Customer, EntityId } from "@/types";
import { useAuthStore } from "@/stores/useAuthStore";

export function useCustomerProfile(customerId: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.customers.detail(customerId ?? ""),
    queryFn: () => fetchCustomerProfile(customerId!),
    enabled: Boolean(customerId),
  });
}

export function useUpdateCustomerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: EntityId; updates: Partial<Customer> }) =>
      updateCustomerProfile(id, updates),
    onSuccess: (updatedCustomer) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      // Also sync currentUser in useAuthStore if it matches
      const { currentUser, setUser } = useAuthStore.getState();
      if (currentUser && String(currentUser.id) === String(updatedCustomer.id)) {
        setUser({
          ...currentUser,
          name: `${updatedCustomer.firstName} ${updatedCustomer.lastName}`.trim(),
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          phone: updatedCustomer.phone,
          addresses: updatedCustomer.addresses ?? [],
          avatar: updatedCustomer.avatar,
        });
      }
      notify.success("Profile updated successfully.");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useCustomerOrders(customerId: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.byCustomer(customerId ?? ""),
    queryFn: () => fetchCustomerOrders(customerId!),
    enabled: Boolean(customerId),
  });
}

export function useSellerOrders(sellerId: EntityId | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.bySeller(sellerId ?? ""),
    queryFn: () => fetchSellerOrders(sellerId!),
    enabled: Boolean(sellerId),
  });
}

export function useCreateMarketplaceOrders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      customerId: EntityId;
      entries: CartEntry[];
      shippingAddress: string;
    }) => createMarketplaceOrders(params),
    onSuccess: (_, { customerId }) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: queryKeys.cart.byCustomer(customerId) });
      notify.success("Order placed! Thank you for shopping with us. 🎉");
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}
