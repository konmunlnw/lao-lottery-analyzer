import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { admin_key } = body;

    if (admin_key !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "รหัส Admin ไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("draws")
      .select("draw_date, number_6, number_3, number_2")
      .order("draw_date", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const csv = [
      "draw_date,number_6,number_3,number_2",
      ...(data || []).map((row) =>
        `${row.draw_date},${row.number_6},${row.number_3},${row.number_2}`
      ),
    ].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="draws_backup.csv"',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Export failed" },
      { status: 500 }
    );
  }
}