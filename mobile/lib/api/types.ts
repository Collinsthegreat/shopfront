export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id?: string | null;
  brand_name?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  price_kobo: number;
  unit: string;
  description?: string | null;
  specifications?: Record<string, string | number | boolean> | null;
  image_url: string;
  stock: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  description?: string | null;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  name: string;
  price_kobo: number;
  unit: string;
  image_url: string;
  stock: number;
  line_total_kobo: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal_kobo: number;
  item_count: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price_kobo: number;
  unit_snapshot: string;
  line_total_kobo: number;
  product_name: string;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal_kobo: number;
  haulage_fee_kobo: number;
  total_kobo: number;
  delivery_address: string;
  delivery_city: string;
  phone_number: string;
  customer_name: string;
  payment_method: string;
  notes?: string | null;
  created_at: string;
  items?: OrderItem[];
}
