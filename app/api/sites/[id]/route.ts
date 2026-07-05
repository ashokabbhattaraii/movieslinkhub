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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const sites = await getSites();
  const index = sites.findIndex((s) => s.id === id);

  if (index === -1) {
    return Response.json({ error: "Site not found" }, { status: 404 });
  }

  sites[index] = { ...sites[index], ...body, id };
  await saveSites(sites);
  return Response.json(sites[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sites = await getSites();
  const filtered = sites.filter((s) => s.id !== id);

  if (filtered.length === sites.length) {
    return Response.json({ error: "Site not found" }, { status: 404 });
  }

  await saveSites(filtered);
  return Response.json({ success: true });
}
