import { NextResponse, type NextRequest } from "next/server";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { corsHeaders, handleOptions } from "@/lib/cors";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Product slug or ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  let product: Product | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (!error && data) {
      product = data as Product;
    }
  } catch {
    // Ignore and fallback to static catalog
  }

  if (!product) {
    product = INITIAL_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
  }

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json({ data: product }, { headers: corsHeaders });
}
