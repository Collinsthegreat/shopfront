import { supabase } from '../supabase/client';
import { Product, Category, Brand, CartResponse, Order } from './types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://shopfront-green.vercel.app/api';

/**
 * Custom Error class with status code and server error details
 */
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base fetch wrapper with Supabase Bearer token attachment and JSON parsing
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Retrieve current session token
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  if (options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg =
      (isJson && typeof body === 'object' && body !== null && (body as { error?: string }).error) ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(errorMsg, response.status, body);
  }

  return body as T;
}

// ==========================================
// Public Catalog Endpoints
// ==========================================

export async function fetchProducts(params: {
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
  limit?: number;
  page?: number;
} = {}): Promise<{ data: Product[]; count: number }> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.brand && params.brand !== 'all') query.set('brand', params.brand);
  if (params.sort) query.set('sort', params.sort);
  if (params.limit) query.set('limit', String(params.limit));
  if (params.page) query.set('page', String(params.page));

  const qs = query.toString();
  return apiFetch<{ data: Product[]; count: number }>(`/products${qs ? `?${qs}` : ''}`);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const response = await apiFetch<{ data: Product }>(`/products/${slug}`);
  return response.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiFetch<{ data: Category[] }>('/categories');
  return response.data;
}

export async function fetchBrands(): Promise<Brand[]> {
  const response = await apiFetch<{ data: Brand[] }>('/brands');
  return response.data;
}

// ==========================================
// Authenticated Cart Endpoints
// ==========================================

export async function fetchCart(): Promise<CartResponse> {
  const response = await apiFetch<{ data: CartResponse }>('/cart');
  return response.data;
}

export async function addCartItem(productId: string, quantity: number): Promise<CartResponse> {
  const response = await apiFetch<{ data: CartResponse }>('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
  return response.data;
}

export async function updateCartItem(productId: string, quantity: number): Promise<CartResponse> {
  const response = await apiFetch<{ data: CartResponse }>(`/cart/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
  return response.data;
}

export async function removeCartItem(productId: string): Promise<CartResponse> {
  const response = await apiFetch<{ data: CartResponse }>(`/cart/items/${productId}`, {
    method: 'DELETE',
  });
  return response.data;
}

export async function clearCart(): Promise<CartResponse> {
  const response = await apiFetch<{ data: CartResponse }>('/cart', {
    method: 'DELETE',
  });
  return response.data;
}

export async function mergeGuestCart(
  items: Array<{ productId: string; quantity: number }>
): Promise<CartResponse> {
  const response = await apiFetch<{ data: CartResponse }>('/cart/merge', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
  return response.data;
}

// ==========================================
// Authenticated Orders Endpoints
// ==========================================

export async function fetchOrders(): Promise<Order[]> {
  const response = await apiFetch<{ orders: Order[] }>('/orders');
  return response.orders;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const response = await apiFetch<{ order: Order }>(`/orders/${id}`);
  return response.order;
}

export async function resendOrderEmail(id: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/orders/${id}/resend-email`, {
    method: 'POST',
  });
}

export interface CreateOrderPayload {
  customer_name: string;
  delivery_address: string;
  delivery_city: 'Lagos' | 'Abuja';
  phone_number: string;
  notes?: string;
  idempotency_key: string;
  items: Array<{ productId: string; quantity: number }>;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await apiFetch<{ order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.order;
}
