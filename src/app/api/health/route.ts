import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ status: "ok", message: "Health check successful" });
}
Line 1: Health check successful
