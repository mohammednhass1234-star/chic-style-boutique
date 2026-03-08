// Force rebuild 2026-03-08-20-20
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ status: "ok", message: "Health check successful" });
}
