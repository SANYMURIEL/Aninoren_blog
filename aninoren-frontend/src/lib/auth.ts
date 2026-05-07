const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Identifiants invalides");
  const data = await res.json();
  return data.access_token;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("aninoren_token");
}

export function setToken(token: string) {
  localStorage.setItem("aninoren_token", token);
}

export function removeToken() {
  localStorage.removeItem("aninoren_token");
}

export function isLoggedIn(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    // Vérifier expiration du JWT côté client
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
