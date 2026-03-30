export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/admin_token=([^;]+)/);
  return match?.[1] ?? null;
}

export function setAdminToken(token: string): void {
  document.cookie = `admin_token=${token}; path=/admin; max-age=${8 * 3600}; SameSite=Strict`;
}

export function clearAdminToken(): void {
  document.cookie = "admin_token=; path=/admin; max-age=0; SameSite=Strict";
}
