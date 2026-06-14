import apiClient from "@/lib/axios";
import type {
  Customer,
  CustomerRegistrationInput,
  EntityId,
  Seller,
  SellerRegistrationInput,
  SellerStatus,
} from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const requireField = (value: string, fieldName: string) => {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }
};

const validateEmail = (email: string) => {
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
};

export const registerCustomer = async (
  input: CustomerRegistrationInput
): Promise<Customer> => {
  const email = normalizeEmail(input.email);

  requireField(input.firstName, "First name");
  requireField(input.lastName, "Last name");
  requireField(email, "Email");
  requireField(input.password, "Password");
  validateEmail(email);

  const { data: existingCustomers } = await apiClient.get<Customer[]>(
    "/customers",
    { params: { email } }
  );

  if (existingCustomers.length > 0) {
    throw new Error("Email already exists. Please use another email.");
  }

  const payload: Customer = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    password: input.password,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  const { data } = await apiClient.post<Customer>("/customers", payload);
  return data;
};

export const registerSeller = async (
  input: SellerRegistrationInput
): Promise<Seller> => {
  const email = normalizeEmail(input.email);
  const mobileNumber = input.mobileNumber.trim();

  requireField(input.businessName, "Business name");
  requireField(input.contactPerson, "Contact person");
  requireField(email, "Email");
  requireField(mobileNumber, "Mobile number");
  validateEmail(email);

  const { data: existingSellers } = await apiClient.get<Seller[]>("/sellers", {
    params: { email },
  });

  if (existingSellers.length > 0) {
    throw new Error("A seller with this email already exists.");
  }

  const payload: Seller = {
    businessName: input.businessName.trim(),
    contactPerson: input.contactPerson.trim(),
    email,
    mobileNumber,
    status: "Pending Approval",
    role: "seller",
    createdAt: new Date().toISOString(),
  };

  const { data } = await apiClient.post<Seller>("/sellers", payload);
  return data;
};

export const fetchSellers = async (): Promise<Seller[]> => {
  const { data } = await apiClient.get<Seller[]>("/sellers");
  return data;
};

export const updateSellerStatus = async (
  id: EntityId,
  status: SellerStatus
): Promise<Seller> => {
  const { data } = await apiClient.patch<Seller>(`/sellers/${id}`, {
    status,
    reviewedAt: new Date().toISOString(),
  });
  return data;
};
