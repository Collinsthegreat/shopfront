export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  logo_url?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand_id?: string;
  brand?: string;
  category_id?: string;
  category: string;
  short_description?: string;
  description: string;
  specs: Record<string, string | number>;
  price_kobo: number;
  unit: string; // e.g. "bag", "12m length", "trip", "ton", "sheet", "sqm", "carton", "drum", "unit", "pair"
  currency: string;
  image_url: string;
  gallery?: string[];
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
  unit_snapshot?: string;
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

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "newest";

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  sort: SortOption;
  inStockOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
}
