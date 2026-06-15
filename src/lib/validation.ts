import * as Yup from "yup";

const email = Yup.string()
  .trim()
  .email("Please enter a valid email address.")
  .required("Email is required.");

// ── Auth ──
export const loginSchema = Yup.object({
  email,
  password: Yup.string().required("Password is required."),
});

export const customerRegistrationSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required."),
  lastName: Yup.string().trim().required("Last name is required."),
  email,
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),
});

export const sellerRegistrationSchema = Yup.object({
  businessName: Yup.string().trim().required("Business name is required."),
  contactPerson: Yup.string().trim().required("Contact person is required."),
  email,
  mobileNumber: Yup.string()
    .trim()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits.")
    .required("Mobile number is required."),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),
});

// ── Listing ──
export const listingSchema = Yup.object({
  price: Yup.number()
    .typeError("Price must be a number.")
    .positive("Price must be greater than zero.")
    .required("Price is required."),
  stock: Yup.number()
    .typeError("Stock must be a number.")
    .integer("Stock must be a whole number.")
    .min(0, "Stock cannot be negative.")
    .required("Stock is required."),
});

// ── New Book submission (by seller) ──
export const bookSchema = Yup.object({
  isbn: Yup.string()
    .trim()
    .matches(/^\d{10}(\d{3})?$/, "ISBN must be 10 or 13 digits.")
    .required("ISBN is required."),
  title: Yup.string().trim().required("Title is required."),
  author: Yup.string().trim().required("Author is required."),
  publisher: Yup.string().trim(),
  description: Yup.string().trim(),
  coverImage: Yup.string().trim().url("Cover image must be a valid URL.").nullable(),
});

// ── Checkout ──
export const checkoutSchema = Yup.object({
  shippingAddress: Yup.string()
    .trim()
    .min(10, "Please enter a complete shipping address.")
    .required("Shipping address is required."),
});
