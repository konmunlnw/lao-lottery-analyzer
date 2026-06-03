import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await req.json();

    const { draw_date, number_6, number_3, number_2 } = body;

    const { data, error } = await supabase
      .from("draws")
      .upsert(
        {
          draw_date,
          number_6,
          number_3,
          number_2,
        },
        {
          onConflict: "draw_date",
        }
      )
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      {
        error: err?.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}