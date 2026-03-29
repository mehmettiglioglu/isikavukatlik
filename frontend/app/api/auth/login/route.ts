import { NextRequest, NextResponse } from "next/server";

// Geçici test endpoint — backend hazır olunca bu dosya silinecek
// Gerçek auth: .NET API /api/auth/login
const TEST_CREDENTIALS = {
  username: "admin",
  password: "Isik2024!",
};

const MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQWRtaW4ifQ.mock";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (
    body.username === TEST_CREDENTIALS.username &&
    body.password === TEST_CREDENTIALS.password
  ) {
    return NextResponse.json({
      token: MOCK_TOKEN,
      username: "admin",
      role: "Admin",
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    });
  }

  return NextResponse.json(
    { message: "Kullanıcı adı veya şifre hatalı." },
    { status: 401 }
  );
}
