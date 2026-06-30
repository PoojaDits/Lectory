import apiClient from "@/lib/axios";
import type {
  AuthUser,
  CustomerRegistrationInput,
  EntityId,
  LoginInput,
  SellerRegistrationInput,
  SellerStatus,
  UserRole,
} from "@/types";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export interface BackendRegisterResponse {
  message: string;
  userId: string;
  email: string;
  role: UserRole;
  sellerStatus?: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
}

interface BackendLoginUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  contactPerson?: string;
  mobileNumber?: string;
  sellerStatus?: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
}

interface BackendLoginResponse {
  access_token: string;
  refresh_token: string;
  user: BackendLoginUser;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

const mapSellerStatus = (
  status?: BackendLoginUser["sellerStatus"]
): SellerStatus | undefined => {
  if (status === "PENDING_APPROVAL") return "Pending Approval";
  if (status === "APPROVED") return "Approved";
  if (status === "REJECTED") return "Rejected";
  return undefined;
};

const toAuthUser = (user: BackendLoginUser): AuthUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  name:
    user.role === "customer"
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
      : user.role === "seller"
        ? user.businessName ?? user.contactPerson ?? user.email
        : user.firstName ?? user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  businessName: user.businessName,
  contactPerson: user.contactPerson,
  mobileNumber: user.mobileNumber,
  status: mapSellerStatus(user.sellerStatus),
});

// ── Registration: Customer ──
// Backend creates the user immediately and sends OTP by email.
export const registerCustomer = async (
  input: CustomerRegistrationInput
): Promise<BackendRegisterResponse> => {
  const { data } = await apiClient.post<BackendRegisterResponse>("/auth/register", {
    role: "customer",
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
  });

  return data;
};

// ── Registration: Seller ──
// Backend stores sellerStatus=PENDING_APPROVAL and sends OTP by email.
export const registerSeller = async (
  input: SellerRegistrationInput
): Promise<BackendRegisterResponse> => {
  const { data } = await apiClient.post<BackendRegisterResponse>("/auth/register", {
    role: "seller",
    businessName: input.businessName.trim(),
    contactPerson: input.contactPerson.trim(),
    email: normalizeEmail(input.email),
    mobileNumber: input.mobileNumber.trim(),
    password: input.password,
  });

  return data;
};

// ── OTP verification ──
export const verifyOtp = async (
  input: VerifyOtpInput
): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>("/auth/verify-otp", {
    email: normalizeEmail(input.email),
    otp: input.otp.trim(),
  });
  return data;
};

export const resendOtp = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>("/auth/resend-otp", {
    email: normalizeEmail(email),
  });
  return data;
};

// ── Login ──
// Backend validates bcrypt password and email verification, then returns JWTs.
export const login = async (input: LoginInput): Promise<AuthSession> => {
  const { data } = await apiClient.post<BackendLoginResponse>("/auth/login", {
    email: normalizeEmail(input.email),
    password: input.password,
  });

  return {
    user: toAuthUser(data.user),
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
};

export const logoutFromBackend = async (): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>("/auth/logout");
  return data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", {
    email: normalizeEmail(email),
  });
  return data;
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>("/auth/reset-password", {
    email: normalizeEmail(email),
    otp: otp.trim(),
    newPassword,
  });
  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.post<{ message: string }>("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};

// Kept only to avoid breaking older imports. Do not use for new auth flows.
export const fetchUserByEmail = async (_email: string): Promise<null> => null;

// Kept only to avoid breaking older imports. Do not use for new auth flows.
export const resetUserPassword = async (
  _userId: EntityId,
  _newPassword: string
): Promise<never> => {
  throw new Error("Use resetPassword(email, otp, newPassword) instead.");
};
