import { NextRequest, NextResponse } from "next/server";
import { submitIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCALES = ["en", "id", "zh", "jp", "ru", "fr", "ar", "es", "ko", "de", "nl", "ha", "he", "el", "hi", "pt", "bn", "vi"];
const ROUTES = ["", "/portfolio", "/news", "/feedback", "/all", "/timeline", "/work", "/college", "/project", "/organization", "/award", "/certificate", "/hire-me", "/identity", "/latest", "/literature", "/music", "/social", "/website"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || (!Array.isArray(body.urls) && !body.url)) {
    return NextResponse.json({ error: "expected { url } or { urls: string[] }" }, { status: 400 });
  }

  const urls: string[] = Array.isArray(body.urls) ? body.urls : [body.url];
  const ok = await submitIndexNow(urls);
  return NextResponse.json({ success: ok, count: urls.length });
}

export async function GET() {
  const urls = ROUTES.flatMap((route) => LOCALES.map((lang) => `https://faranaiki.id/${lang}${route}`));
  const ok = await submitIndexNow(urls);
  return NextResponse.json({ success: ok, count: urls.length });
}
