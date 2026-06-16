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
const findUserByEmail = async (email: string): Promise<UserRecord | null> => {
  const { data } = await apiClient.get<UserRecord[]>("/users", {
    params: { email },
  });
  return data.find((u) => normalizeEmail(u.email) === email) ?? null;
};

// ── Registration: Customer ──
export const registerCustomer = async (
  input: CustomerRegistrationInput
): Promise<Customer> => {
  const email = normalizeEmail(input.email);

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("Email already exists. Please use another email.");
  }

  const createdAt = new Date().toISOString();

  // 1. Create profile
  const { data: customer } = await apiClient.post<Customer>("/customers", {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    role: "customer",
    createdAt,
  });

  // 2. Create credentials row
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

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("A seller with this email already exists.");
  }

  const createdAt = new Date().toISOString();

  const { data: seller } = await apiClient.post<Seller>("/sellers", {
    businessName: input.businessName.trim(),
    contactPerson: input.contactPerson.trim(),
    email,
    mobileNumber,
    status: "Pending Approval",
    role: "seller",
    createdAt,
  });

  // Seller logs in with email + password.
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

  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  if (user.role === "admin") {
    const { data: admins } = await apiClient.get<Admin[]>("/admins");
    const admin = admins.find((a) => sameId(a.id, user.profileId));
    if (!admin) throw new Error("Admin profile not found.");
    return toAdminUser(user, admin);
  }

  if (user.role === "customer") {
    const { data: customers } = await apiClient.get<Customer[]>("/customers");
    const customer = customers.find((c) => sameId(c.id, user.profileId));
    if (!customer) throw new Error("Customer profile not found.");
    return toCustomerUser(user, customer);
  }

  // seller
  const { data: sellers } = await apiClient.get<Seller[]>("/sellers");
  const seller = sellers.find((s) => sameId(s.id, user.profileId));
  if (!seller) throw new Error("Seller profile not found.");

  if (seller.status !== "Approved") {
    throw new Error(
      `Your seller account is "${seller.status}". Please wait for admin approval before logging in.`
    );
  }
  return toSellerUser(user, seller);
};
