import { useMutation } from "@tanstack/react-query";
import {
  login,
  logoutFromBackend,
  registerCustomer,
  registerSeller,
  resendOtp,
  verifyOtp,
  type AuthSession,
  type VerifyOtpInput,
} from "@/services/authApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { notify } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import type {
  AuthUser,
  CustomerRegistrationInput,
  LoginInput,
  SellerRegistrationInput,
} from "@/types";

/** Login mutation — persists backend user + JWT tokens into the auth store. */
export function useLogin(onSuccess?: (user: AuthUser) => void) {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (session: AuthSession) => {
      setSession(session.user, {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      notify.success(`Welcome back, ${session.user.name ?? session.user.email}!`);
      onSuccess?.(session.user);
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** Customer registration mutation — backend sends OTP after creating user. */
export function useRegisterCustomer(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (input: CustomerRegistrationInput) => registerCustomer(input),
    onSuccess: () => {
      notify.success("Registration started! Please verify the OTP sent to your email.");
      onSuccess?.();
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** Seller registration mutation — backend sends OTP and keeps seller pending approval. */
export function useRegisterSeller(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (input: SellerRegistrationInput) => registerSeller(input),
    onSuccess: () => {
      notify.success("Seller registration started! Please verify the OTP sent to your email.");
      onSuccess?.();
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** OTP verify mutation for /auth/verify-otp. */
export function useVerifyOtp(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (input: VerifyOtpInput) => verifyOtp(input),
    onSuccess: () => {
      notify.success("Email verified successfully! You can now log in.");
      onSuccess?.();
    },
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

/** Resend OTP mutation for /auth/resend-otp. */
export function useResendOtp() {
  return useMutation({
    mutationFn: (email: string) => resendOtp(email),
    onSuccess: () => notify.success("OTP resent successfully. Please check your email."),
    onError: (error) => notify.error(getErrorMessage(error)),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => logoutFromBackend(),
    onSuccess: () => {
      logout();
      notify.info("You have been logged out.");
    },
    onError: (error) => {
      logout();
      notify.info(getErrorMessage(error) || "Logged out locally.");
    },
  });
}
