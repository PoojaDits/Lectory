import { Field, ErrorMessage } from "formik";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  as?: "input" | "textarea" | "select";
  children?: React.ReactNode;
  rows?: number;
}

/**
 * Formik-bound labelled input with inline validation error.
 * Matches the warm Lectory aesthetic used across the app.
 */
export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  as = "input",
  children,
  rows,
}: FormFieldProps) {
  const baseClass =
    "mt-2 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-secondary-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100";

  return (
    <label className="block">
      <span className="text-sm font-semibold text-secondary-700">{label}</span>
      <Field
        as={as}
        name={name}
        type={as === "input" ? type : undefined}
        rows={as === "textarea" ? rows : undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={baseClass}
      >
        {children}
      </Field>
      <ErrorMessage
        name={name}
        component="p"
        className="mt-1 text-sm font-medium text-red-600"
      />
    </label>
  );
}
