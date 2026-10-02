export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_kobo: number;
  currency: string;
  category: "carry" | "stationery" | "desk" | "living";
  image_url: string;
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  created_at?: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  note: string | null;
  idempotency_key?: string | null;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface EmailLog {
  id: string;
  order_id: string;
  to_email: string;
  provider_message_id: string | null;
  status: "sent" | "failed";
  error: string | null;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}
