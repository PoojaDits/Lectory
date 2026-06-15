import { useMutation } from "@tanstack/react-query";
import { login, registerCustomer, registerSeller } from "@/services/authApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type {
  AuthUser,
  CustomerRegistrationInput,
  LoginInput,
  SellerRegistrationInput,
} from "@/types";

/** Login mutation — persists the user into the auth store on success. */
export function useLogin(onSuccess?: (user: AuthUser) => void) {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (user) => {
      setUser(user);
      notify.success(`Welcome back, ${user.name ?? user.email}!`);
      onSuccess?.(user);
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** Customer registration mutation. */
export function useRegisterCustomer(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (input: CustomerRegistrationInput) => registerCustomer(input),
    onSuccess: () => {
      notify.success("Account created! You can now log in.");
      onSuccess?.();
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** Seller registration mutation (status = Pending Approval). */
export function useRegisterSeller(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (input: SellerRegistrationInput) => registerSeller(input),
    onSuccess: () => {
      notify.success(
        "Seller registered! Your account is pending admin approval."
      );
      onSuccess?.();
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}
