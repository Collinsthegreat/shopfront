import { z } from "zod";

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim(),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\s\-()]+$/, "Please enter a valid phone number")
    .trim(),
  address: z
    .string()
    .min(5, "Delivery address must be at least 5 characters")
    .max(250, "Address cannot exceed 250 characters")
    .trim(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(60, "City cannot exceed 60 characters")
    .trim(),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(60, "State cannot exceed 60 characters")
    .trim(),
  note: z
    .string()
    .max(300, "Delivery note cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(50, "Quantity exceeds limit"),
});

export const createOrderApiSchema = z.object({
  items: z
    .array(orderItemInputSchema)
    .min(1, "Order must contain at least one item"),
  delivery: checkoutFormSchema,
  idempotencyKey: z.string().min(10, "Invalid idempotency key").optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderApiSchema>;
