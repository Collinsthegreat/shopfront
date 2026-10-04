import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ data }, { headers: corsHeaders });
    }
  } catch {
    // Fallback to constants
  }

  return NextResponse.json({ data: CATEGORIES }, { headers: corsHeaders });
}
