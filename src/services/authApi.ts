import apiClient from "@/lib/axios";
import { sameId } from "@/utils/helpers";
import type {
  Admin,
  AuthUser,
  Customer,
  CustomerRegistrationInput,
  EntityId,
  LoginInput,
  Seller,
  SellerRegistrationInput,
} from "@/types";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

// ── A row in the `users` table = single source of truth for credentials ──
interface UserRecord {
  id: EntityId;
  email: string;
  password: string;
  role: "customer" | "seller" | "admin";
  profileId: EntityId;
  createdAt: string;
}

const toCustomerUser = (u: UserRecord, c: Customer): AuthUser => ({
  id: c.id,
  email: u.email,
  role: "customer",
  name: `${c.firstName} ${c.lastName}`.trim(),
  firstName: c.firstName,
  lastName: c.lastName,
  phone: c.phone,
  addresses: c.addresses ?? [],
  avatar: c.avatar,
  createdAt: c.createdAt,
});

const toSellerUser = (u: UserRecord, s: Seller): AuthUser => ({
  id: s.id,
  email: u.email,
  role: "seller",
  name: s.contactPerson,
  businessName: s.businessName,
  contactPerson: s.contactPerson,
  mobileNumber: s.mobileNumber,
  status: s.status,
  createdAt: s.createdAt,
  reviewedAt: s.reviewedAt,
});

const toAdminUser = (u: UserRecord, a: Admin): AuthUser => ({
  id: a.id,
  email: u.email,
  role: "admin",
  name: a.name ?? "Admin",
});

/** Find a single user by email (case-insensitive). */
export const fetchUserByEmail = async (email: string): Promise<UserRecord | null> => {
  const clean = normalizeEmail(email);
  const { data } = await apiClient.get<UserRecord[]>("/users", {
    params: { email: clean },
  });
  return data.find((u) => normalizeEmail(u.email) === clean) ?? null;
};

const findUserByEmail = fetchUserByEmail;

export const resetUserPassword = async (
  userId: EntityId,
  newPassword: string
): Promise<UserRecord> => {
  const { data } = await apiClient.patch<UserRecord>(`/users/${userId}`, {
    password: newPassword,
  });
  return data;
};

// ── Registration: Customer ──
export const registerCustomer = async (
  input: CustomerRegistrationInput
): Promise<Customer> => {
  const email = normalizeEmail(input.email);

  // Validate email uniqueness
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("An account with this email already exists. Please use a different email or login.");
  }

  const createdAt = new Date().toISOString();

  // 1. Create customer profile
  const { data: customer } = await apiClient.post<Customer>("/customers", {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    role: "customer",
    createdAt,
    phone: "",
    addresses: [],
  });

  // 2. Create credentials row with proper profileId
  await apiClient.post<UserRecord>("/users", {
    email,
    password: input.password,
    role: "customer",
    profileId: customer.id,
    createdAt,
  });

  // 3. Auto-provision an empty cart for the customer
  await apiClient.post("/carts", { customerId: customer.id });

  return customer;
};

// ── Registration: Seller (status = Pending Approval) ──
export const registerSeller = async (
  input: SellerRegistrationInput
): Promise<Seller> => {
  const email = normalizeEmail(input.email);
  const mobileNumber = input.mobileNumber.trim();

  // Validate email uniqueness
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("A seller account with this email already exists. Please use a different email or login.");
  }

  // Validate mobile number format (must be exactly 10 digits)
  if (!/^\d{10}$/.test(mobileNumber)) {
    throw new Error("Mobile number must be exactly 10 digits.");
  }

  // Validate business name
  if (!input.businessName.trim()) {
    throw new Error("Business name is required.");
  }

  // Validate contact person
  if (!input.contactPerson.trim()) {
    throw new Error("Contact person name is required.");
  }

  // Validate password strength
  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const createdAt = new Date().toISOString();

  // 1. Create seller profile
  const { data: seller } = await apiClient.post<Seller>("/sellers", {
    businessName: input.businessName.trim(),
    contactPerson: input.contactPerson.trim(),
    email,
    mobileNumber,
    status: "Pending Approval",
    role: "seller",
    createdAt,
  });

  // 2. Create credentials row with proper profileId
  await apiClient.post<UserRecord>("/users", {
    email,
    password: input.password,
    role: "seller",
    profileId: seller.id,
    createdAt,
  });

  return seller;
};

// ── Login ──
export const login = async (input: LoginInput): Promise<AuthUser> => {
  const email = normalizeEmail(input.email);
  const password = input.password;

  // Validate input
  if (!email) {
    throw new Error("Email is required.");
  }
  if (!password) {
    throw new Error("Password is required.");
  }

  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("No account found with this email. Please register first.");
  }

  // Verify password
  if (user.password !== password) {
    throw new Error("Incorrect password. Please try again.");
  }

  // Build AuthUser based on role
  if (user.role === "admin") {
    const { data: admins } = await apiClient.get<Admin[]>("/admins");
    const admin = admins.find((a) => sameId(a.id, user.profileId));
    if (!admin) throw new Error("Admin profile not found. Please contact support.");
    return toAdminUser(user, admin);
  }

  if (user.role === "customer") {
    const { data: customers } = await apiClient.get<Customer[]>("/customers");
    const customer = customers.find((c) => sameId(c.id, user.profileId));
    if (!customer) throw new Error("Customer profile not found. Please contact support.");
    return toCustomerUser(user, customer);
  }

  // seller
  const { data: sellers } = await apiClient.get<Seller[]>("/sellers");
  const seller = sellers.find((s) => sameId(s.id, user.profileId));
  if (!seller) throw new Error("Seller profile not found. Please contact support.");

  if (seller.status === "Pending Approval") {
    throw new Error(
      "Your seller account is still pending approval. Please wait for the admin team to review your application before logging in."
    );
  }

  if (seller.status === "Rejected") {
    throw new Error(
      "Your seller account has been rejected. Please contact support for more information."
    );
  }

  return toSellerUser(user, seller);
};
