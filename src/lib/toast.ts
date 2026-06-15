import { toast, type ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Thin wrapper around react-toastify so the whole app uses
 * a single, consistent notification configuration.
 */
export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...baseOptions, ...options }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...baseOptions, ...options }),
  warning: (message: string, options?: ToastOptions) =>
    toast.warning(message, { ...baseOptions, ...options }),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, { ...baseOptions, ...options }),
};
