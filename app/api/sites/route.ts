import { cookies } from "next/headers";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

interface Site {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  status: "online" | "offline" | "unknown";
  featured: boolean;
  rating: number;
  createdAt: string;
}

const DATA_PATH = join(process.cwd(), "data", "sites.json");

async function getSites(): Promise<Site[]> {
  const data = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

async function saveSites(sites: Site[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(sites, null, 2));
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  const decoded = Buffer.from(session.value, "base64").toString();
  return decoded.startsWith(`${secret}:`);
}

export async function GET() {
  const sites = await getSites();
  return Response.json(sites);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, url, description, category, status, featured, rating } = body;

  if (!name || !url || !description || !category) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sites = await getSites();
  const newSite: Site = {
    id: crypto.randomUUID(),
    name,
    url,
    description,
    category,
    status: status || "online",
    featured: featured || false,
    rating: Math.min(5, Math.max(1, rating || 4.0)),
    createdAt: new Date().toISOString(),
  };

  sites.push(newSite);
  await saveSites(sites);
  return Response.json(newSite, { status: 201 });
}
