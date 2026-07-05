import { readFile } from "fs/promises";
import { join } from "path";
import HomeClient from "./home-client";

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

export const dynamic = "force-dynamic";

async function getSites(): Promise<Site[]> {
  const data = await readFile(join(process.cwd(), "data", "sites.json"), "utf-8");
  return JSON.parse(data);
}

export default async function Home() {
  const allSites = await getSites();
  const sites = allSites.filter((s) => s.status === "online");
  return <HomeClient sites={sites} />;
}
