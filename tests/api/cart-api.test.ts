import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getCart, DELETE as clearCart } from "@/app/api/cart/route";
import { POST as addCartItem } from "@/app/api/cart/items/route";
import { PATCH as updateCartItem, DELETE as deleteCartItem } from "@/app/api/cart/items/[productId]/route";
import { POST as mergeCart } from "@/app/api/cart/merge/route";
import { GET as getCategoryList } from "@/app/api/categories/route";
import { GET as getBrandList } from "@/app/api/brands/route";
import { GET as getProductDetail } from "@/app/api/products/[slug]/route";
import { getUserFromRequest } from "@/lib/supabase/get-user";

describe("Cart & Auth API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication Gate (Cookie and Bearer JWT)", () => {
    it("returns 401 when GET /api/cart has no credentials", async () => {
      const req = new NextRequest("http://localhost:3000/api/cart");
      const res = await getCart(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toContain("Unauthorized");
    });

    it("returns 401 when POST /api/cart/items has an invalid Bearer token", async () => {
      const req = new NextRequest("http://localhost:3000/api/cart/items", {
        method: "POST",
        headers: {
          authorization: "Bearer invalid.jwt.token",
          "content-type": "application/json",
        },
        body: JSON.stringify({ productId: "bm-cmt-001", quantity: 5 }),
      });
      const res = await addCartItem(req);
      expect(res.status).toBe(401);
    });

    it("returns 401 when DELETE /api/cart has no credentials", async () => {
      const req = new NextRequest("http://localhost:3000/api/cart", {
        method: "DELETE",
      });
      const res = await clearCart(req);
      expect(res.status).toBe(401);
    });

    it("returns 401 when PATCH /api/cart/items/[id] has no credentials", async () => {
      const req = new NextRequest("http://localhost:3000/api/cart/items/bm-cmt-001", {
        method: "PATCH",
        body: JSON.stringify({ quantity: 20 }),
      });
      const res = await updateCartItem(req, { params: { productId: "bm-cmt-001" } });
      expect(res.status).toBe(401);
    });

    it("returns 401 when DELETE /api/cart/items/[id] has no credentials", async () => {
      const req = new NextRequest("http://localhost:3000/api/cart/items/bm-cmt-001", {
        method: "DELETE",
      });
      const res = await deleteCartItem(req, { params: { productId: "bm-cmt-001" } });
      expect(res.status).toBe(401);
    });

    it("returns 401 when POST /api/cart/merge has no credentials", async () => {
      const req = new NextRequest("http://localhost:3000/api/cart/merge", {
        method: "POST",
        body: JSON.stringify({ items: [{ productId: "bm-cmt-001", quantity: 5 }] }),
      });
      const res = await mergeCart(req);
      expect(res.status).toBe(401);
    });

    it("rejects malformed Bearer tokens in getUserFromRequest", async () => {
      const req = new NextRequest("http://localhost:3000/api/cart", {
        headers: { authorization: "Bearer " },
      });
      const result = await getUserFromRequest(req);
      expect(result.user).toBeNull();
      expect(result.error).toBe("Missing bearer token");
    });
  });

  describe("Public Catalog Endpoints & CORS", () => {
    it("GET /api/categories returns 11 categories with CORS headers", async () => {
      const res = await getCategoryList();
      expect(res.status).toBe(200);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");
      const json = await res.json();
      expect(json.data.length).toBeGreaterThanOrEqual(11);
    });

    it("GET /api/brands returns 24 brands with CORS headers", async () => {
      const res = await getBrandList();
      expect(res.status).toBe(200);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");
      const json = await res.json();
      expect(json.data.length).toBeGreaterThanOrEqual(24);
    });

    it("GET /api/products/[slug] returns 404 for unknown product", async () => {
      const req = new NextRequest("http://localhost:3000/api/products/non-existent-material");
      const res = await getProductDetail(req, { params: { slug: "non-existent-material" } });
      expect(res.status).toBe(404);
      expect(res.headers.get("access-control-allow-origin")).toBe("*");
    });

    it("GET /api/products/[slug] resolves valid product by slug", async () => {
      const req = new NextRequest("http://localhost:3000/api/products/dangote-3x-cement-50kg");
      const res = await getProductDetail(req, { params: { slug: "dangote-3x-cement-50kg" } });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.name).toContain("Dangote");
      expect(json.data.price_kobo).toBe(950000);
      expect(json.data.unit).toBe("bag");
    });
  });
});
