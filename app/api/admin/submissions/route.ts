import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin, isAllowedAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const authorization = request.headers.get("authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");

  if (!supabaseUrl || !supabasePublishableKey || !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: userData, error: userError } = await authClient.auth.getUser(token);

  if (userError || !isAllowedAdmin(userData.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const [contactsResult, assessmentsResult] = await Promise.all([
      supabase
        .from("contact_submissions")
        .select("id,name,email,company,subject,message,status,source,created_at,updated_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("assessment_submissions")
        .select("id,name,company,email,phone,website,industry,company_size,existing_tools,challenges,automation_areas,additional_info,status,source,created_at,updated_at")
        .order("created_at", { ascending: false }),
    ]);

    if (contactsResult.error || assessmentsResult.error) {
      return NextResponse.json(
        { error: contactsResult.error?.message || assessmentsResult.error?.message || "Failed to load submissions" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      contacts: contactsResult.data ?? [],
      assessments: assessmentsResult.data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load submissions" },
      { status: 500 },
    );
  }
}
