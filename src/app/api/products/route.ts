import { NextResponse, type NextRequest } from "next/server";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "featured";

  let products: Product[] = [];

  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*")
      .not("id", "like", "prod-%");

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (brand && brand !== "all") {
      query = query.eq("brand_id", brand);
    }

    if (search && search.trim()) {
      query = query.or(
        `name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`
      );
    }

    switch (sort) {
      case "price-asc":
        query = query.order("price_kobo", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price_kobo", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "featured":
      default:
        query = query.order("featured", { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      products = data as Product[];
    } else {
      // Fallback to static catalog if DB is empty or during early seed phase
      products = [...INITIAL_PRODUCTS];
    }
  } catch {
    products = [...INITIAL_PRODUCTS];
  }

  // If fallback was used, apply filters in-memory
  if (category && category !== "all") {
    products = products.filter((p) => p.category === category);
  }
  if (brand && brand !== "all") {
    products = products.filter((p) => p.brand_id === brand);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(
    { data: products, count: products.length },
    { headers: corsHeaders }
  );
}

